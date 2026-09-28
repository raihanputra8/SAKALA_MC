import { supabase, isSupabaseConfigured } from './client';
import { mockBikes, mockProducts, mockJournalPosts, mockProfile, mockOrders } from '@/data/mockData';
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
    return mockBikes.map(b => ({ ...b, image_url: resolveAssetUrl(b.image_url) }));
  }
  try {
    const { data, error } = await supabase.from('bikes').select('*').order('year', { ascending: true });
    if (error || !data || data.length === 0) {
      return mockBikes.map(b => ({ ...b, image_url: resolveAssetUrl(b.image_url) }));
    }
    return (data as Bike[]).map(b => ({ ...b, image_url: resolveAssetUrl(b.image_url) }));
  } catch (err) {
    console.warn('Failed to fetch from Supabase, using mock data:', err);
    return mockBikes.map(b => ({ ...b, image_url: resolveAssetUrl(b.image_url) }));
  }
}

export async function getBikeById(id: string): Promise<Bike | null> {
  const bikes = await getBikes();
  const normalizedId = decodeURIComponent(id).toLowerCase();
  const found = bikes.find((b) => b.id.toLowerCase() === normalizedId);
  if (found) return found;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('bikes').select('*').eq('id', id).single();
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

  return bikes[0] || null;
}

export async function getProducts(category?: string): Promise<Product[]> {
  if (!isSupabaseConfigured || !supabase) {
    const prods = (!category || category === 'all')
      ? mockProducts
      : mockProducts.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    return prods.map(p => ({ ...p, image_url: resolveAssetUrl(p.image_url) }));
  }
  try {
    let query = supabase.from('products').select('*');
    if (category && category !== 'all') {
      query = query.eq('category', category.toLowerCase());
    }
    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      const prods = (!category || category === 'all')
        ? mockProducts
        : mockProducts.filter((p) => p.category.toLowerCase() === category.toLowerCase());
      return prods.map(p => ({ ...p, image_url: resolveAssetUrl(p.image_url) }));
    }
    return (data as Product[]).map(p => ({ ...p, image_url: resolveAssetUrl(p.image_url) }));
  } catch (err) {
    console.warn('Failed to fetch products from Supabase, using mock data:', err);
    const prods = (!category || category === 'all')
      ? mockProducts
      : mockProducts.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    return prods.map(p => ({ ...p, image_url: resolveAssetUrl(p.image_url) }));
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  const products = await getProducts();
  const found = products.find((p) => p.id === id || p.sku.toLowerCase() === id.toLowerCase());
  if (found) return found;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
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

  return products[0] || null;
}

export async function getJournalPosts(): Promise<JournalPost[]> {
  if (!isSupabaseConfigured || !supabase) {
    return mockJournalPosts.map(p => ({ ...p, cover_image_url: resolveAssetUrl(p.cover_image_url) }));
  }
  try {
    const { data, error } = await supabase.from('journal_posts').select('*').order('publish_date', { ascending: false });
    if (error || !data || data.length === 0) {
      return mockJournalPosts.map(p => ({ ...p, cover_image_url: resolveAssetUrl(p.cover_image_url) }));
    }
    return (data as JournalPost[]).map(p => ({ ...p, cover_image_url: resolveAssetUrl(p.cover_image_url) }));
  } catch (err) {
    console.warn('Failed to fetch journal posts, using mock data:', err);
    return mockJournalPosts.map(p => ({ ...p, cover_image_url: resolveAssetUrl(p.cover_image_url) }));
  }
}

export async function getJournalPostBySlug(slug: string): Promise<JournalPost | null> {
  const posts = await getJournalPosts();
  const normalizedSlug = decodeURIComponent(slug);
  const found = posts.find(
    (p) =>
      p.slug === normalizedSlug ||
      (normalizedSlug.includes('tangkuban') && p.slug.includes('tangkuban')) ||
      (normalizedSlug.includes('subang') && p.slug.includes('tangkuban'))
  );
  if (found) return found;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('journal_posts')
        .select('*')
        .eq('slug', normalizedSlug)
        .single();
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

  return posts[0] || null;
}

export async function getUserProfile(): Promise<Profile> {
  if (!isSupabaseConfigured || !supabase) {
    return { ...mockProfile, avatar_url: resolveAssetUrl(mockProfile.avatar_url || '') };
  }
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ...mockProfile, avatar_url: resolveAssetUrl(mockProfile.avatar_url || '') };
    const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (error || !data) return { ...mockProfile, avatar_url: resolveAssetUrl(mockProfile.avatar_url || '') };
    return { ...(data as Profile), avatar_url: resolveAssetUrl((data as Profile).avatar_url || '') };
  } catch {
    return { ...mockProfile, avatar_url: resolveAssetUrl(mockProfile.avatar_url || '') };
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
  if (!isSupabaseConfigured || !supabase) {
    return { success: true };
  }
  try {
    const { error } = await supabase.from('orders').insert([order]);
    if (error) {
      console.error('Failed to create order in Supabase:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to save order' };
  }
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }
  try {
    const { data, error } = await supabase.from('orders').select('*').eq('id', orderId).single();
    if (error || !data) return null;
    return data as Order;
  } catch {
    return null;
  }
}

export async function getOrders(): Promise<Order[]> {
  if (!isSupabaseConfigured || !supabase) {
    return mockOrders.map((o) => ({
      ...o,
      items: o.items.map((item) => ({
        ...item,
        product: {
          ...item.product,
          image_url: resolveAssetUrl(item.product.image_url),
        },
      })),
    }));
  }
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (error || !data || data.length === 0) {
      return mockOrders.map((o) => ({
        ...o,
        items: o.items.map((item) => ({
          ...item,
          product: {
            ...item.product,
            image_url: resolveAssetUrl(item.product.image_url),
          },
        })),
      }));
    }
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
    return mockOrders;
  }
}

