import { supabase, isSupabaseConfigured } from './client';
import { Bike, Product, JournalPost, Profile, Order } from '@/types/database';

export const SUPABASE_STORAGE_BASE = 'https://hrpkjwxxlolifyizuuns.supabase.co/storage/v1/object/public/sakala-assets';

export function resolveAssetUrl(url: string): string {
  if (!url) return url;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/assets/')) {
    const filename = url.replace('/assets/', '');
    return `${SUPABASE_STORAGE_BASE}/${filename}`;
  }
  return url;
}

export async function getBikes(): Promise<Bike[]> {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }
  try {
    const { data, error } = await supabase.from('bikes').select('*').order('year', { ascending: true });
    if (error || !data) {
      return [];
    }
    return (data as Bike[]).map(b => ({ ...b, image_url: resolveAssetUrl(b.image_url) }));
  } catch (err) {
    console.error('Failed to fetch bikes from Supabase:', err);
    return [];
  }
}

export async function getBikeById(id: string): Promise<Bike | null> {
  const normalizedId = decodeURIComponent(id).toLowerCase();
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('bikes').select('*').eq('id', id).maybeSingle();
      if (!error && data) {
        return {
          ...(data as Bike),
          image_url: resolveAssetUrl((data as Bike).image_url),
        };
      }
    } catch {
      // ignore
    }
  }

  const bikes = await getBikes();
  return bikes.find((b) => b.id.toLowerCase() === normalizedId) || null;
}

export async function getProducts(category?: string): Promise<Product[]> {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }
  try {
    let query = supabase.from('products').select('*');
    if (category && category !== 'all') {
      query = query.eq('category', category.toLowerCase());
    }
    const { data, error } = await query;
    if (error || !data) {
      return [];
    }
    return (data as Product[]).map(p => ({ ...p, image_url: resolveAssetUrl(p.image_url) }));
  } catch (err) {
    console.error('Failed to fetch products from Supabase:', err);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  const normalizedId = decodeURIComponent(id).toLowerCase();
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`id.eq.${id},sku.ilike.${id}`)
        .maybeSingle();
      if (!error && data) {
        return {
          ...(data as Product),
          image_url: resolveAssetUrl((data as Product).image_url),
        };
      }
    } catch {
      // ignore
    }
  }

  const products = await getProducts();
  return products.find((p) => p.id.toLowerCase() === normalizedId || p.sku.toLowerCase() === normalizedId) || null;
}

export async function getJournalPosts(): Promise<JournalPost[]> {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }
  try {
    const { data, error } = await supabase.from('journal_posts').select('*').order('publish_date', { ascending: false });
    if (error || !data) {
      return [];
    }
    return (data as JournalPost[]).map(p => ({ ...p, cover_image_url: resolveAssetUrl(p.cover_image_url) }));
  } catch (err) {
    console.error('Failed to fetch journal posts from Supabase:', err);
    return [];
  }
}

export async function getJournalPostBySlug(slug: string): Promise<JournalPost | null> {
  const normalizedSlug = decodeURIComponent(slug).toLowerCase();
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('journal_posts')
        .select('*')
        .eq('slug', normalizedSlug)
        .maybeSingle();
      if (!error && data) {
        return {
          ...(data as JournalPost),
          cover_image_url: resolveAssetUrl((data as JournalPost).cover_image_url),
        };
      }
    } catch {
      // ignore
    }
  }

  const posts = await getJournalPosts();
  return posts.find((p) => p.slug.toLowerCase() === normalizedSlug) || null;
}

export async function getUserProfile(userId?: string): Promise<Profile | null> {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }
  try {
    let targetId = userId;
    if (!targetId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      targetId = user.id;
    }
    const { data, error } = await supabase.from('profiles').select('*').eq('id', targetId).maybeSingle();
    if (error || !data) return null;
    return { ...(data as Profile), avatar_url: resolveAssetUrl((data as Profile).avatar_url || '') };
  } catch {
    return null;
  }
}

export async function subscribeToCircle(email: string): Promise<{ success: boolean; message: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return { success: true, message: 'Terima kasih! Email Anda telah terdaftar untuk menerima informasi terbaru.' };
  }
  try {
    const { error } = await supabase.from('newsletter_subscribers').insert([{ email }]);
    if (error) {
      if (error.code === '23505') {
        return { success: true, message: 'Email Anda sudah terdaftar sebelumnya untuk menerima informasi terbaru.' };
      }
      return { success: false, message: error.message };
    }
    return { success: true, message: 'Terima kasih! Email Anda telah terdaftar untuk menerima informasi terbaru.' };
  } catch {
    return { success: false, message: 'Terjadi gangguan koneksi. Silakan coba lagi.' };
  }
}

export async function createOrder(order: Order): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        customer_phone: order.customer_phone,
        shipping_address: order.shipping_address,
        city: order.city,
        postal_code: order.postal_code,
        courier: order.courier,
        payment_method: order.payment_method,
        items: (order.items || []).map((i) => ({
          productId: i.product?.id || (i as unknown as { productId?: string }).productId,
          quantity: i.quantity,
          size: i.size,
        })),
      }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || 'Gagal memproses pesanan.' };
    }
    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to save order';
    return { success: false, error: errorMsg };
  }
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }
  try {
    // 1. Direct select (works for authenticated order owner or admin)
    const { data, error } = await supabase.from('orders').select('*').eq('id', orderId).maybeSingle();
    if (!error && data) {
      const order = data as Order;
      return {
        ...order,
        items: (order.items || []).map((item) => ({
          ...item,
          product: {
            ...item.product,
            image_url: resolveAssetUrl(item.product?.image_url),
          },
        })),
      };
    }

    // 2. Secure tracking RPC (for guest order tracking without broad SELECT permissions or PII exposure)
    const { data: rpcData, error: rpcErr } = await supabase.rpc('get_order_tracking', { p_order_id: orderId });
    if (!rpcErr && rpcData && rpcData.length > 0) {
      const order = rpcData[0] as Order;
      return {
        ...order,
        items: (order.items || []).map((item) => ({
          ...item,
          product: {
            ...item.product,
            image_url: resolveAssetUrl(item.product?.image_url),
          },
        })),
      };
    }

    return null;
  } catch {
    return null;
  }
}

export async function getOrders(userEmail?: string): Promise<Order[]> {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }
  try {
    let query = supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (userEmail) {
      query = query.eq('customer_email', userEmail);
    }

    const { data, error } = await query;
    if (error || !data) return [];
    return (data as Order[]).map((o) => ({
      ...o,
      items: (o.items || []).map((item) => ({
        ...item,
        product: {
          ...item.product,
          image_url: resolveAssetUrl(item.product.image_url),
        },
      })),
    }));
  } catch {
    return [];
  }
}
