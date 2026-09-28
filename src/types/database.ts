export interface Profile {
  id: string;
  full_name: string;
  email?: string;
  avatar_url?: string;
  role: 'member' | 'artisan' | 'founder' | 'admin';
  created_at?: string;
}

export interface Bike {
  id: string;
  title: string;
  year: number;
  make: string;
  model: string;
  specs: {
    frame?: string;
    exhaust?: string;
    colorway?: string;
    workshop?: string;
    engine?: string;
    chassis?: string;
    finish?: string;
    wheels?: string;
    displacement?: string;
    suspension?: string;
    rims?: string;
  };
  image_url: string;
  status: 'archival' | 'commissioned' | 'private_collection';
  description?: string;
  gallery?: string[];
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: 'all' | 't-shirts' | 'hoodies' | 'jackets' | 'headwear' | 'accessories';
  price_idr: number;
  price_usd: number;
  stock_status: 'available' | 'low_stock' | 'waitlist' | 'sold_out';
  stock_count?: number;
  description: string;
  image_url: string;
}

export interface JournalPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  read_time: string;
  author: string;
  author_role?: string;
  photographer?: string;
  publish_date: string;
  elevation?: string;
  temperature?: string;
  coordinates?: string;
  excerpt: string;
  content?: string;
  gallery?: string[];
  cover_image_url: string;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  city: string;
  postal_code: string;
  courier: string;
  payment_method: string;
  items: CartItem[];
  subtotal_idr: number;
  shipping_fee_idr: number;
  total_idr: number;
  status: 'pending' | 'paid' | 'dispatching' | 'delivered' | 'cancelled';
  created_at?: string;
}

export interface SiteContent {
  key: string;
  value: string;
  section: string;
  label?: string;
  field_type?: 'text' | 'textarea' | 'richtext' | 'url' | 'number';
  updated_at?: string;
}

export interface AdminStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalMembers: number;
  recentOrders: Order[];
}

export interface InstagramConfig {
  profile_url: string;
  post_urls: string[];
  enabled: boolean;
}
