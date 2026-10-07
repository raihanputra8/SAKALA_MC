import { NextRequest, NextResponse } from 'next/server';

interface InstagramPostData {
  shortcode: string;
  permalink: string;
  author_name?: string;
  author_url?: string;
  thumbnail_url?: string;
  title?: string;
  html?: string;
  has_official_media: boolean;
  error?: string;
}

// In-memory cache for official oEmbed responses (TTL: 1 hour)
interface CacheEntry {
  data: InstagramPostData;
  expiresAt: number;
}
const oembedCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60 * 60 * 1000;

// Rate limiting configuration (SEC-011)
// Note: In-memory rate limiting protects single-node / local runtimes.
// For multi-region serverless deployments (e.g. Vercel), an external distributed
// store such as Redis/Upstash is required for cross-instance enforcement.
interface RateLimitRecord {
  count: number;
  resetAt: number;
}
const ipRateLimits = new Map<string, RateLimitRecord>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30; // 30 requests per minute per IP

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = ipRateLimits.get(ip);

  if (!record || record.resetAt <= now) {
    ipRateLimits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  record.count += 1;
  return true;
}

// Bounded parameters
const MAX_BATCH_URLS = 10;
const MAX_URL_LENGTH = 500;
const FETCH_TIMEOUT_MS = 5000;
const MAX_CACHE_ENTRIES = 200;

function validateAndExtractInstagramShortcode(rawUrl: string): { isValid: boolean; shortcode?: string; cleanPermalink?: string } {
  if (!rawUrl || typeof rawUrl !== 'string' || rawUrl.length > MAX_URL_LENGTH) {
    return { isValid: false };
  }

  try {
    const parsed = new URL(rawUrl.trim());
    const hostname = parsed.hostname.toLowerCase();
    
    // Strict hostname validation: only instagram.com or www.instagram.com
    if (hostname !== 'instagram.com' && hostname !== 'www.instagram.com' && !hostname.endsWith('.instagram.com')) {
      return { isValid: false };
    }

    // Match /p/SHORTCODE, /reel/SHORTCODE, /reels/SHORTCODE
    const pathname = parsed.pathname;
    const match = pathname.match(/\/(?:p|reel|reels)\/([A-Za-z0-9_-]+)/);
    if (!match || !match[1]) {
      return { isValid: false };
    }

    const shortcode = match[1];
    return {
      isValid: true,
      shortcode,
      cleanPermalink: `https://www.instagram.com/p/${shortcode}/`,
    };
  } catch {
    return { isValid: false };
  }
}

async function fetchOfficialOEmbed(permalink: string, shortcode: string): Promise<InstagramPostData> {
  // Check in-memory cache first
  const cached = oembedCache.get(shortcode);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  const apiVersion = process.env.META_GRAPH_API_VERSION || 'v21.0';
  const appId = process.env.META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN || (appId && appSecret ? `${appId}|${appSecret}` : null);

  // If no official Meta credentials configured, return valid permalink structure without scraping
  if (!accessToken) {
    const fallbackData: InstagramPostData = {
      shortcode,
      permalink,
      has_official_media: false,
    };
    return fallbackData;
  }

  try {
    const oembedEndpoint = `https://graph.facebook.com/${apiVersion}/instagram_oembed?url=${encodeURIComponent(permalink)}&access_token=${encodeURIComponent(accessToken)}`;
    
    // Explicit timeout protection: abort after 5 seconds to prevent hung connections
    const response = await fetch(oembedEndpoint, {
      next: { revalidate: 3600 },
      headers: {
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    if (!response.ok) {
      const fallbackData: InstagramPostData = {
        shortcode,
        permalink,
        has_official_media: false,
        error: `Meta oEmbed status ${response.status}`,
      };
      return fallbackData;
    }

    const data = await response.json();
    const result: InstagramPostData = {
      shortcode,
      permalink,
      author_name: data.author_name || undefined,
      author_url: data.author_url || undefined,
      thumbnail_url: data.thumbnail_url || undefined,
      title: data.title || undefined,
      html: data.html || undefined,
      has_official_media: Boolean(data.thumbnail_url),
    };

    // Maintain bounded cache size
    if (oembedCache.size >= MAX_CACHE_ENTRIES) {
      const oldestKey = oembedCache.keys().next().value;
      if (oldestKey) oembedCache.delete(oldestKey);
    }

    // Cache the result
    oembedCache.set(shortcode, {
      data: result,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });

    return result;
  } catch (err) {
    return {
      shortcode,
      permalink,
      has_official_media: false,
      error: err instanceof Error ? err.message : 'oEmbed request failed',
    };
  }
}

export async function GET(req: NextRequest) {
  // 0. Rate limiting enforcement
  const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
                   req.headers.get('x-real-ip') || 
                   '127.0.0.1';

  if (!checkRateLimit(clientIp)) {
    return NextResponse.json(
      { error: 'Batas permintaan tercapai (Rate limit exceeded). Coba lagi dalam 1 menit.' },
      { status: 429, headers: { 'Retry-After': '60' } }
    );
  }

  const { searchParams } = new URL(req.url);
  const singleUrl = searchParams.get('url');
  const batchUrlsParam = searchParams.get('urls');

  // 1. Batch mode: query multiple post URLs with strict array size capping
  if (batchUrlsParam) {
    try {
      const urls: unknown = JSON.parse(batchUrlsParam);
      if (!Array.isArray(urls)) {
        return NextResponse.json({ error: 'urls parameter must be a JSON array of strings' }, { status: 400 });
      }

      // SEC-011: Strict upper bound on batch size
      if (urls.length > MAX_BATCH_URLS) {
        return NextResponse.json(
          { error: `Jumlah URL melebihi batas maksimal ${MAX_BATCH_URLS} per permintaan.` },
          { status: 400 }
        );
      }

      const results: InstagramPostData[] = [];
      for (const url of urls) {
        if (typeof url !== 'string' || url.length > MAX_URL_LENGTH) continue;
        const { isValid, shortcode, cleanPermalink } = validateAndExtractInstagramShortcode(url);
        if (isValid && shortcode && cleanPermalink) {
          const postData = await fetchOfficialOEmbed(cleanPermalink, shortcode);
          results.push(postData);
        }
      }

      return NextResponse.json({
        success: true,
        posts: results,
      });
    } catch {
      return NextResponse.json({ error: 'Invalid JSON in urls parameter' }, { status: 400 });
    }
  }

  // 2. Single URL mode
  if (!singleUrl) {
    return NextResponse.json({ error: 'url or urls parameter is required' }, { status: 400 });
  }

  if (singleUrl.length > MAX_URL_LENGTH) {
    return NextResponse.json(
      { error: `Panjang URL melebihi batas maksimal ${MAX_URL_LENGTH} karakter.` },
      { status: 400 }
    );
  }

  const { isValid, shortcode, cleanPermalink } = validateAndExtractInstagramShortcode(singleUrl);
  if (!isValid || !shortcode || !cleanPermalink) {
    return NextResponse.json(
      { error: 'URL Instagram tidak valid. Masukkan URL resmi dengan format https://www.instagram.com/p/... atau /reel/...' },
      { status: 400 }
    );
  }

  const data = await fetchOfficialOEmbed(cleanPermalink, shortcode);
  return NextResponse.json({
    success: true,
    ...data,
  });
}
