import { supabase, isSupabaseConfigured } from './client';
import { resolveAssetUrl } from './data';
import { Product, Bike, JournalPost, Order, Profile, SiteContent, AdminStats } from '@/types/database';

// ========================================
// ADMIN DASHBOARD STATS
// ========================================

export async function getAdminStats(): Promise<AdminStats> {
  if (!isSupabaseConfigured || !supabase) {
    return { totalProducts: 4, totalOrders: 2, totalRevenue: 1955000, totalMembers: 1, recentOrders: [] };
  }

  try {
    const [productsRes, ordersRes, profilesRes] = await Promise.all([
      supabase.from('products').select('id', { count: 'exact', head: true }),
      supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
    ]);

    const orders = (ordersRes.data || []) as Order[];
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total_idr || 0), 0);

    return {
      totalProducts: productsRes.count || 0,
      totalOrders: orders.length,
      totalRevenue,
      totalMembers: profilesRes.count || 0,
      recentOrders: orders,
    };
  } catch {
    return { totalProducts: 0, totalOrders: 0, totalRevenue: 0, totalMembers: 0, recentOrders: [] };
  }
}

// ========================================
// PRODUCTS CRUD
// ========================================

export async function getAllProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data || []).map(p => ({ ...p as Product, image_url: resolveAssetUrl((p as Product).image_url) }));
}

export async function createProduct(product: Omit<Product, 'id'>): Promise<Product> {
  if (!supabase) throw new Error('Supabase not configured');
  const id = `prod-${Date.now()}`;
  const { id: _, created_at: __, ...payload } = product as Record<string, unknown>;
  const { data, error } = await supabase.from('products').insert([{ id, ...payload }]).select();
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) {
    throw new Error('Gagal menambah produk: 0 baris tersimpan di Supabase. Periksa izin RLS admin.');
  }
  return data[0] as Product;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  if (!supabase) throw new Error('Supabase not configured');
  const { id: _, created_at: __, ...cleanUpdates } = updates as Record<string, unknown>;
  const { data, error } = await supabase.from('products').update(cleanUpdates).eq('id', id).select();
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) {
    throw new Error('Gagal update produk: Database menolak perubahan (0 baris terupdate). Pastikan SQL script fix permission admin sudah dijalankan di Supabase.');
  }
  return data[0] as Product;
}

export async function deleteProduct(id: string): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('products').delete().eq('id', id).select();
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) {
    throw new Error('Gagal menghapus produk: 0 baris terhapus di Supabase. Periksa izin RLS admin.');
  }
}

// ========================================
// JOURNAL POSTS CRUD
// ========================================

export async function getAllJournalPosts(): Promise<JournalPost[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  const { data, error } = await supabase.from('journal_posts').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data || []).map(p => ({ ...p as JournalPost, cover_image_url: resolveAssetUrl((p as JournalPost).cover_image_url) }));
}

export async function createJournalPost(post: Omit<JournalPost, 'id'>): Promise<JournalPost> {
  if (!supabase) throw new Error('Supabase not configured');
  const id = `post-${Date.now()}`;
  const { id: _, created_at: __, ...payload } = post as Record<string, unknown>;
  const { data, error } = await supabase.from('journal_posts').insert([{ id, ...payload }]).select();
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) {
    throw new Error('Gagal menambah artikel: 0 baris tersimpan di Supabase. Periksa izin RLS admin.');
  }
  return data[0] as JournalPost;
}

export async function updateJournalPost(id: string, updates: Partial<JournalPost>): Promise<JournalPost> {
  if (!supabase) throw new Error('Supabase not configured');
  const { id: _, created_at: __, ...cleanUpdates } = updates as Record<string, unknown>;
  const { data, error } = await supabase.from('journal_posts').update(cleanUpdates).eq('id', id).select();
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) {
    throw new Error('Gagal update artikel: Database menolak perubahan (0 baris terupdate). Pastikan SQL script fix permission admin sudah dijalankan di Supabase.');
  }
  return data[0] as JournalPost;
}

export async function deleteJournalPost(id: string): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('journal_posts').delete().eq('id', id).select();
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) {
    throw new Error('Gagal menghapus artikel: 0 baris terhapus di Supabase. Periksa izin RLS admin.');
  }
}

// ========================================
// BIKES CRUD
// ========================================

export async function getAllBikes(): Promise<Bike[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  const { data, error } = await supabase.from('bikes').select('*').order('year', { ascending: true });
  if (error) throw new Error(error.message);
  return (data || []).map(b => ({ ...b as Bike, image_url: resolveAssetUrl((b as Bike).image_url) }));
}

export async function createBike(bike: Omit<Bike, 'id'>): Promise<Bike> {
  if (!supabase) throw new Error('Supabase not configured');
  const id = `bike-${Date.now()}`;
  const { id: _, created_at: __, ...payload } = bike as Record<string, unknown>;
  const { data, error } = await supabase.from('bikes').insert([{ id, ...payload }]).select();
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) {
    throw new Error('Gagal menambah motor: 0 baris tersimpan di Supabase. Periksa izin RLS admin.');
  }
  return data[0] as Bike;
}

export async function updateBike(id: string, updates: Partial<Bike>): Promise<Bike> {
  if (!supabase) throw new Error('Supabase not configured');
  const { id: _, created_at: __, ...cleanUpdates } = updates as Record<string, unknown>;
  const { data, error } = await supabase.from('bikes').update(cleanUpdates).eq('id', id).select();
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) {
    throw new Error('Gagal update motor: Database menolak perubahan (0 baris terupdate). Pastikan SQL script fix permission admin sudah dijalankan di Supabase.');
  }
  return data[0] as Bike;
}

export async function deleteBike(id: string): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('bikes').delete().eq('id', id).select();
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) {
    throw new Error('Gagal menghapus motor: 0 baris terhapus di Supabase. Periksa izin RLS admin.');
  }
}

// ========================================
// ORDERS MANAGEMENT
// ========================================

export async function getAllOrders(): Promise<Order[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data || []) as Order[];
}

export async function updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('orders').update({ status }).eq('id', id).select();
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) {
    throw new Error('Gagal update order: Database menolak perubahan (0 baris terupdate).');
  }
  return data[0] as Order;
}

// ========================================
// SITE CONTENT CMS
// ========================================

export async function getAllSiteContent(): Promise<SiteContent[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  const { data, error } = await supabase.from('site_content').select('*').order('section');
  if (error) throw new Error(error.message);
  return (data || []) as SiteContent[];
}

export async function updateSiteContent(key: string, value: string): Promise<SiteContent> {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase
    .from('site_content')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
    .select();
  if (error) {
    // Fallback: try update then insert
    const { data: updateData, error: updateErr } = await supabase
      .from('site_content')
      .update({ value, updated_at: new Date().toISOString() })
      .eq('key', key)
      .select();
    if (!updateErr && updateData && updateData.length > 0) {
      return updateData[0] as SiteContent;
    }
    console.warn('Supabase site_content upsert note:', error.message);
  }
  return (data?.[0] || { key, value, section: 'general', updated_at: new Date().toISOString() }) as SiteContent;
}

export async function createSiteContent(content: SiteContent): Promise<SiteContent> {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('site_content').insert([content]).select();
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) {
    throw new Error('Gagal menambah site content.');
  }
  return data[0] as SiteContent;
}

// ========================================
// USER / PROFILE MANAGEMENT
// ========================================

export async function getAllProfiles(): Promise<Profile[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data || []) as Profile[];
}

export async function updateUserRole(id: string, role: Profile['role']): Promise<Profile> {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('profiles').update({ role }).eq('id', id).select();
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) {
    throw new Error('Gagal update user role: Database menolak perubahan.');
  }
  return data[0] as Profile;
}

// ========================================
// ========================================
// IMAGE UPLOAD (SEC-010: SVG Stored XSS Hardening)
// ========================================

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp']);
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function uploadImage(file: File, folder: string = 'uploads'): Promise<string> {
  if (!supabase) throw new Error('Supabase not configured');
  if (!file) throw new Error('File tidak valid.');

  // 1. File size check
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Ukuran file melebihi batas maksimal 5 MB.');
  }

  // 2. Extension validation (rejects .svg, .svgz, .html, etc.)
  const ext = (file.name.split('.').pop() || '').toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    throw new Error(`Format file .${ext} tidak diizinkan. Hanya gambar raster (.jpg, .jpeg, .png, .webp) yang diperbolehkan.`);
  }

  // 3. MIME-type validation (rejects image/svg+xml, application/xml, etc.)
  const mimeType = (file.type || '').toLowerCase();
  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    throw new Error(`Tipe MIME "${mimeType}" tidak diizinkan. Dokumen SVG dan format vektor dilarang demi keamanan.`);
  }

  // 4. Magic bytes / file signature verification
  const buffer = await file.slice(0, 16).arrayBuffer();
  const bytes = new Uint8Array(buffer);

  // Reject any file starting with '<' (0x3C) e.g., <?xml, <svg, <html
  if (bytes[0] === 0x3C) {
    throw new Error('Isi file mengandung format XML/SVG dan ditolak demi keamanan (SEC-010 XSS Protection).');
  }

  // Verify valid raster magic bytes:
  // JPEG: FF D8 FF
  const isJpeg = bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF;
  // PNG: 89 50 4E 47
  const isPng = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47;
  // WebP: RIFF (52 49 46 46) ... WEBP (57 45 42 50 at offset 8)
  const isWebp = bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
                 bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50;

  if (!isJpeg && !isPng && !isWebp) {
    throw new Error('Isi biner file tidak valid untuk format gambar raster yang diizinkan (.jpg, .png, .webp).');
  }

  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage
    .from('sakala-assets')
    .upload(fileName, file, { cacheControl: '3600', upsert: false, contentType: mimeType });

  if (error) throw new Error(error.message);

  const { data: urlData } = supabase.storage
    .from('sakala-assets')
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}
