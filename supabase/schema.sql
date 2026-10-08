-- ============================================================
-- BURBLE FLOWER E-COMMERCE DATABASE SCHEMA
-- ============================================================

-- 1. EXTENSIONS & FUNCTIONS SETUP
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Helper function to check if current authenticated user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- 2. PROFILES TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. SITE SETTINGS TABLE (Singleton)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  store_name TEXT NOT NULL DEFAULT 'Burble',
  tagline TEXT DEFAULT 'Flowers make moments special',
  whatsapp_number TEXT NOT NULL DEFAULT '97400000000',
  admin_email TEXT NOT NULL DEFAULT 'admin@burbleflowers.com',
  currency_symbol TEXT NOT NULL DEFAULT 'QAR',
  announcement_text TEXT DEFAULT 'Fresh Flowers Sourced Daily • Same-Day Delivery • Premium Quality',
  announcement_enabled BOOLEAN NOT NULL DEFAULT true,
  free_shipping_threshold NUMERIC(10,2) DEFAULT 300.00,
  flat_shipping_fee NUMERIC(10,2) DEFAULT 25.00,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed initial site settings if missing
INSERT INTO public.site_settings (id, store_name, tagline, whatsapp_number, admin_email, currency_symbol)
VALUES (1, 'Burble', 'Flowers make moments special', '97400000000', 'admin@burbleflowers.com', 'QAR')
ON CONFLICT (id) DO NOTHING;

-- 4. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON public.categories(active);

-- 5. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  compare_at_price NUMERIC(10,2) CHECK (compare_at_price IS NULL OR compare_at_price >= price),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_new_arrival BOOLEAN NOT NULL DEFAULT false,
  stock_status TEXT NOT NULL DEFAULT 'in_stock' CHECK (stock_status IN ('in_stock', 'out_of_stock')),
  active BOOLEAN NOT NULL DEFAULT true,
  main_image_url TEXT NOT NULL,
  hover_image_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_products_new_arrival ON public.products(is_new_arrival) WHERE active = true;

-- 6. PRODUCT IMAGES TABLE
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_product_images_product ON public.product_images(product_id);

-- 7. COLLECTIONS & OCCASIONS TABLE
CREATE TABLE IF NOT EXISTS public.collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  subtitle TEXT,
  image_url TEXT,
  type TEXT NOT NULL DEFAULT 'collection' CHECK (type IN ('occasion', 'flower', 'collection')),
  sort_order INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_collections_type ON public.collections(type, active);

-- 8. COLLECTION ITEMS (Junction table)
CREATE TABLE IF NOT EXISTS public.collection_items (
  collection_id UUID NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (collection_id, product_id)
);

-- 9. HOMEPAGE SECTIONS (CMS Layout)
CREATE TABLE IF NOT EXISTS public.homepage_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  content_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_homepage_sections_visible ON public.homepage_sections(is_visible, sort_order);

-- 10. BLOG POSTS TABLE
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  author TEXT DEFAULT 'Burble Florist',
  is_published BOOLEAN NOT NULL DEFAULT true,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);

-- 11. MEDIA ASSETS TABLE (Cloudinary Registry)
CREATE TABLE IF NOT EXISTS public.media_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  public_id TEXT UNIQUE NOT NULL,
  url TEXT NOT NULL,
  width INT,
  height INT,
  format TEXT,
  folder TEXT DEFAULT 'burble',
  alt_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('whatsapp', 'cod')),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Doha',
  district TEXT,
  pincode TEXT,
  delivery_notes TEXT,
  subtotal NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0),
  shipping_fee NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (shipping_fee >= 0),
  total_amount NUMERIC(10,2) NOT NULL CHECK (total_amount >= 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'out_for_delivery', 'delivered', 'cancelled')),
  email_sent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders(created_at DESC);

-- 13. ORDER ITEMS TABLE (Snapshot of purchase data)
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  quantity INT NOT NULL CHECK (quantity > 0),
  total NUMERIC(10,2) NOT NULL CHECK (total >= 0)
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);

-- 14. NEWSLETTER SUBSCRIBERS TABLE
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 15. ATOMIC ORDER CREATION RPC (Prevents price manipulation)
-- ============================================================
CREATE OR REPLACE FUNCTION public.create_order(
  p_source TEXT,
  p_customer_name TEXT,
  p_customer_email TEXT,
  p_customer_phone TEXT,
  p_delivery_address TEXT,
  p_city TEXT,
  p_district TEXT,
  p_pincode TEXT,
  p_delivery_notes TEXT,
  p_items JSONB -- Array of { product_id: string, quantity: number }
)
RETURNS JSONB AS $$
DECLARE
  v_site_settings RECORD;
  v_item JSONB;
  v_product RECORD;
  v_qty INT;
  v_subtotal NUMERIC(10,2) := 0;
  v_shipping NUMERIC(10,2) := 0;
  v_total NUMERIC(10,2) := 0;
  v_order_id UUID;
  v_order_num TEXT;
  v_rand INT;
  v_item_total NUMERIC(10,2);
  v_result JSONB;
BEGIN
  -- 1. Validate source
  IF p_source IS NULL OR p_source NOT IN ('whatsapp', 'cod') THEN
    RAISE EXCEPTION 'Invalid order source. Must be "whatsapp" or "cod".';
  END IF;

  -- 2. Input validation for customer & delivery details
  IF p_customer_name IS NULL OR LENGTH(TRIM(p_customer_name)) < 2 OR LENGTH(p_customer_name) > 100 THEN
    RAISE EXCEPTION 'Valid customer name is required (2 to 100 characters).';
  END IF;

  IF p_customer_email IS NULL OR LENGTH(TRIM(p_customer_email)) < 5 OR LENGTH(p_customer_email) > 255 OR p_customer_email NOT LIKE '%@%.%' THEN
    RAISE EXCEPTION 'Valid customer email address is required.';
  END IF;

  IF p_customer_phone IS NULL OR LENGTH(TRIM(p_customer_phone)) < 6 OR LENGTH(p_customer_phone) > 30 THEN
    RAISE EXCEPTION 'Valid customer contact phone number is required.';
  END IF;

  IF p_delivery_address IS NULL OR LENGTH(TRIM(p_delivery_address)) < 5 OR LENGTH(p_delivery_address) > 500 THEN
    RAISE EXCEPTION 'Valid delivery address is required (5 to 500 characters).';
  END IF;

  IF p_city IS NOT NULL AND LENGTH(p_city) > 100 THEN
    RAISE EXCEPTION 'City name exceeds maximum length of 100 characters.';
  END IF;

  -- 3. Fetch site settings for shipping calculations
  SELECT free_shipping_threshold, flat_shipping_fee INTO v_site_settings FROM public.site_settings WHERE id = 1;
  IF v_site_settings IS NULL THEN
    v_site_settings.free_shipping_threshold := 300.00;
    v_site_settings.flat_shipping_fee := 25.00;
  END IF;

  -- 4. Validate items non-empty
  IF p_items IS NULL OR jsonb_typeof(p_items) <> 'array' OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'Order must contain a non-empty array of items.';
  END IF;

  -- 5. Calculate subtotal & verify products in DB
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    IF v_item->>'product_id' IS NULL THEN
      RAISE EXCEPTION 'Each order item must contain a valid product_id.';
    END IF;

    BEGIN
      v_qty := (v_item->>'quantity')::int;
    EXCEPTION WHEN OTHERS THEN
      RAISE EXCEPTION 'Item quantity must be a valid integer.';
    END;

    IF v_qty IS NULL OR v_qty < 1 OR v_qty > 100 THEN
      RAISE EXCEPTION 'Product quantity must be between 1 and 100 units.';
    END IF;

    BEGIN
      SELECT id, name, price, active, stock_status INTO v_product FROM public.products WHERE id = (v_item->>'product_id')::uuid;
    EXCEPTION WHEN OTHERS THEN
      RAISE EXCEPTION 'Invalid UUID format for product ID %.', v_item->>'product_id';
    END;

    IF v_product IS NULL THEN
      RAISE EXCEPTION 'Product with ID % not found.', v_item->>'product_id';
    END IF;

    IF NOT v_product.active THEN
      RAISE EXCEPTION 'Product "%" is currently inactive.', v_product.name;
    END IF;

    IF v_product.stock_status <> 'in_stock' THEN
      RAISE EXCEPTION 'Product "%" is currently out of stock.', v_product.name;
    END IF;

    v_item_total := v_product.price * v_qty;
    v_subtotal := v_subtotal + v_item_total;
  END LOOP;

  -- 6. Calculate shipping fee
  IF v_subtotal >= v_site_settings.free_shipping_threshold OR v_subtotal = 0 THEN
    v_shipping := 0.00;
  ELSE
    v_shipping := v_site_settings.flat_shipping_fee;
  END IF;

  v_total := v_subtotal + v_shipping;

  -- 7. Generate human readable order number BURBLE-YYYYMMDD-XXXX
  v_rand := floor(1000 + random() * 9000)::int;
  v_order_num := 'BURBLE-' || to_char(NOW(), 'YYYYMMDD') || '-' || v_rand::text;

  -- 8. Insert Order
  INSERT INTO public.orders (
    order_number, source, customer_name, customer_email, customer_phone,
    delivery_address, city, district, pincode, delivery_notes,
    subtotal, shipping_fee, total_amount, status
  ) VALUES (
    v_order_num, p_source, TRIM(p_customer_name), LOWER(TRIM(p_customer_email)), TRIM(p_customer_phone),
    TRIM(p_delivery_address), COALESCE(NULLIF(TRIM(p_city), ''), 'Doha'), p_district, p_pincode, p_delivery_notes,
    v_subtotal, v_shipping, v_total, 'pending'
  ) RETURNING id INTO v_order_id;

  -- 9. Insert Order Items
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_qty := (v_item->>'quantity')::int;
    SELECT name, price INTO v_product FROM public.products WHERE id = (v_item->>'product_id')::uuid;

    INSERT INTO public.order_items (
      order_id, product_id, product_name, price, quantity, total
    ) VALUES (
      v_order_id,
      (v_item->>'product_id')::uuid,
      v_product.name,
      v_product.price,
      v_qty,
      v_product.price * v_qty
    );
  END LOOP;

  -- 10. Return created order summary
  SELECT jsonb_build_object(
    'id', v_order_id,
    'order_number', v_order_num,
    'source', p_source,
    'subtotal', v_subtotal,
    'shipping_fee', v_shipping,
    'total_amount', v_total
  ) INTO v_result;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Explicit permissions on create_order RPC
REVOKE EXECUTE ON FUNCTION public.create_order(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_order(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, JSONB) TO anon, authenticated;

-- ============================================================
-- 16. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ POLICIES
CREATE POLICY "Public Read Site Settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (active = true OR public.is_admin());
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (active = true OR public.is_admin());
CREATE POLICY "Public Read Product Images" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Public Read Collections" ON public.collections FOR SELECT USING (active = true OR public.is_admin());
CREATE POLICY "Public Read Collection Items" ON public.collection_items FOR SELECT USING (true);
CREATE POLICY "Public Read Homepage Sections" ON public.homepage_sections FOR SELECT USING (is_visible = true OR public.is_admin());
CREATE POLICY "Public Read Blog Posts" ON public.blog_posts FOR SELECT USING (is_published = true OR public.is_admin());
CREATE POLICY "Public Read Media Assets" ON public.media_assets FOR SELECT USING (true);
CREATE POLICY "Public Insert Newsletter" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);

-- PROFILES USER SELF-READ POLICY
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

-- ADMIN POLICIES (Full Control)
CREATE POLICY "Admin Full Control Profiles" ON public.profiles FOR ALL USING (public.is_admin());
CREATE POLICY "Admin Full Control Site Settings" ON public.site_settings FOR ALL USING (public.is_admin());
CREATE POLICY "Admin Full Control Categories" ON public.categories FOR ALL USING (public.is_admin());
CREATE POLICY "Admin Full Control Products" ON public.products FOR ALL USING (public.is_admin());
CREATE POLICY "Admin Full Control Product Images" ON public.product_images FOR ALL USING (public.is_admin());
CREATE POLICY "Admin Full Control Collections" ON public.collections FOR ALL USING (public.is_admin());
CREATE POLICY "Admin Full Control Collection Items" ON public.collection_items FOR ALL USING (public.is_admin());
CREATE POLICY "Admin Full Control Homepage Sections" ON public.homepage_sections FOR ALL USING (public.is_admin());
CREATE POLICY "Admin Full Control Blog Posts" ON public.blog_posts FOR ALL USING (public.is_admin());
CREATE POLICY "Admin Full Control Media Assets" ON public.media_assets FOR ALL USING (public.is_admin());
CREATE POLICY "Admin Full Control Orders" ON public.orders FOR ALL USING (public.is_admin());
CREATE POLICY "Admin Full Control Order Items" ON public.order_items FOR ALL USING (public.is_admin());
CREATE POLICY "Admin Full Control Subscribers" ON public.newsletter_subscribers FOR ALL USING (public.is_admin());

