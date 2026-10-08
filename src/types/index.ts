export type UserRole = 'customer' | 'admin';

export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  full_name?: string;
  created_at: string;
}

export interface SiteSettings {
  id: number;
  store_name: string;
  tagline: string;
  whatsapp_number: string;
  admin_email: string;
  currency_symbol: string;
  announcement_text: string;
  announcement_enabled: boolean;
  free_shipping_threshold: number;
  flat_shipping_fee: number;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  sort_order: number;
  active: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  compare_at_price?: number | null;
  category_id?: string | null;
  category?: Category | null;
  is_featured: boolean;
  is_new_arrival: boolean;
  stock_status: 'in_stock' | 'out_of_stock';
  active: boolean;
  main_image_url: string;
  hover_image_url?: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text?: string;
  sort_order: number;
}

export interface Collection {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  image_url?: string;
  type: 'occasion' | 'flower' | 'collection';
  sort_order: number;
  active: boolean;
}

export interface HomepageSection {
  id: string;
  section_key: string;
  title: string;
  subtitle?: string;
  is_visible: boolean;
  sort_order: number;
  content_json: Record<string, any>;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  cover_image?: string;
  author: string;
  is_published: boolean;
  published_at: string;
  created_at: string;
}

export interface MediaAsset {
  id: string;
  public_id: string;
  url: string;
  width?: number;
  height?: number;
  format?: string;
  folder?: string;
  alt_text?: string;
  created_at: string;
}

export type OrderSource = 'whatsapp' | 'cod';
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'out_of_delivery' | 'delivered' | 'cancelled';

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id?: string;
  product_name: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Order {
  id: string;
  order_number: string;
  source: OrderSource;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  city: string;
  district?: string;
  pincode?: string;
  delivery_notes?: string;
  subtotal: number;
  shipping_fee: number;
  total_amount: number;
  status: OrderStatus;
  email_sent: boolean;
  created_at: string;
  currency_symbol?: string;
  order_items?: OrderItem[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CheckoutFormData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  city: string;
  district?: string;
  pincode?: string;
  delivery_notes?: string;
  payment_method: OrderSource;
}
