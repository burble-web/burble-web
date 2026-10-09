-- ============================================================
-- MIGRATION: 20261009_arabic_localization.sql
-- DESCRIPTION: Safe, incremental schema migration adding complete
--              Arabic and RTL localization columns and RPC updates
--              to an existing Burble Supabase production database.
-- ============================================================

BEGIN;

-- 1. SITE SETTINGS TABLE (Bilingual Store Details)
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS store_name_ar TEXT DEFAULT 'بيربل',
  ADD COLUMN IF NOT EXISTS tagline_ar TEXT DEFAULT 'الزهور تضفي سحراً على أجمل اللحظات',
  ADD COLUMN IF NOT EXISTS currency_symbol_ar TEXT DEFAULT 'ر.ق',
  ADD COLUMN IF NOT EXISTS announcement_text_ar TEXT DEFAULT 'زهور نضرة يتم استيرادها يومياً • توصيل في نفس اليوم • جودة فاخرة • تغليف راقٍ ومميز';

-- 2. CATEGORIES TABLE (Bilingual Category Names & Descriptions)
ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS name_ar TEXT,
  ADD COLUMN IF NOT EXISTS description_ar TEXT;

-- 3. PRODUCTS TABLE (Bilingual Product Titles, Descriptions, Short Descriptions & Translation Origin)
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS name_ar TEXT,
  ADD COLUMN IF NOT EXISTS description_ar TEXT,
  ADD COLUMN IF NOT EXISTS short_description_ar TEXT,
  ADD COLUMN IF NOT EXISTS arabic_translation_source TEXT;

-- 4. PRODUCT IMAGES TABLE (Bilingual Accessible Alt Text)
ALTER TABLE public.product_images
  ADD COLUMN IF NOT EXISTS alt_text_ar TEXT;

-- 5. COLLECTIONS & OCCASIONS TABLE (Bilingual Collection Titles & Subtitles)
ALTER TABLE public.collections
  ADD COLUMN IF NOT EXISTS title_ar TEXT,
  ADD COLUMN IF NOT EXISTS subtitle_ar TEXT;

-- 6. HOMEPAGE SECTIONS TABLE (Bilingual CMS Headings & Subheadings)
ALTER TABLE public.homepage_sections
  ADD COLUMN IF NOT EXISTS title_ar TEXT,
  ADD COLUMN IF NOT EXISTS subtitle_ar TEXT;

-- 7. BLOG POSTS TABLE (Bilingual Articles, Excerpts, Content & Authors)
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS title_ar TEXT,
  ADD COLUMN IF NOT EXISTS excerpt_ar TEXT,
  ADD COLUMN IF NOT EXISTS content_ar TEXT,
  ADD COLUMN IF NOT EXISTS author_ar TEXT DEFAULT 'منسق زهور بيربل';

-- 8. MEDIA ASSETS TABLE (Bilingual Cloudinary Asset Alt Text)
ALTER TABLE public.media_assets
  ADD COLUMN IF NOT EXISTS alt_text_ar TEXT;

-- 9. ORDERS TABLE (Customer Locale at Checkout Time)
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS locale TEXT DEFAULT 'en';

-- 10. ORDER ITEMS TABLE (Bilingual Product Name Snapshot)
ALTER TABLE public.order_items
  ADD COLUMN IF NOT EXISTS product_name_ar TEXT;

-- ============================================================
-- 11. ATOMIC ORDER CREATION RPC (Upgraded with product_name_ar & locale)
-- ============================================================
-- Cleanly drop previous 10-argument signature to avoid ambiguous function overloading in PostgREST
DROP FUNCTION IF EXISTS public.create_order(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, JSONB);

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
  p_items JSONB, -- Array of { product_id: string, quantity: number }
  p_locale TEXT DEFAULT 'en'
)
RETURNS JSONB AS $$
DECLARE
  v_free_shipping_threshold NUMERIC(10,2);
  v_flat_shipping_fee NUMERIC(10,2);
  v_item JSONB;
  v_product RECORD;
  v_qty INT;
  v_subtotal NUMERIC(10,2) := 0;
  v_shipping NUMERIC(10,2) := 0;
  v_total NUMERIC(10,2) := 0;
  v_order_id UUID := NULL;
  v_order_num TEXT;
  v_rand INT;
  v_retry INT;
  v_item_total NUMERIC(10,2);
  v_locale TEXT;
  v_result JSONB;
BEGIN
  -- 1. Validate source
  IF p_source IS NULL OR p_source NOT IN ('whatsapp', 'cod') THEN
    RAISE EXCEPTION 'Invalid order source. Must be "whatsapp" or "cod".';
  END IF;

  -- 2. Validate & normalize locale strictly to 'en' or 'ar'
  IF p_locale IS NOT NULL AND LOWER(TRIM(p_locale)) = 'ar' THEN
    v_locale := 'ar';
  ELSE
    v_locale := 'en';
  END IF;

  -- 3. Input validation for customer & delivery details
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

  -- 4. Fetch site settings for shipping calculations with safe NULL / missing row fallback
  SELECT
    COALESCE(free_shipping_threshold, 300.00),
    COALESCE(flat_shipping_fee, 25.00)
  INTO
    v_free_shipping_threshold,
    v_flat_shipping_fee
  FROM public.site_settings
  WHERE id = 1;

  -- Apply fallbacks if table is empty or row id = 1 is missing
  v_free_shipping_threshold := COALESCE(v_free_shipping_threshold, 300.00);
  v_flat_shipping_fee := COALESCE(v_flat_shipping_fee, 25.00);

  -- 5. Validate items non-empty
  IF p_items IS NULL OR jsonb_typeof(p_items) <> 'array' OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'Order must contain a non-empty array of items.';
  END IF;

  -- 6. Calculate subtotal & verify products in DB
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
      SELECT id, name, name_ar, price, active, stock_status INTO v_product FROM public.products WHERE id = (v_item->>'product_id')::uuid;
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

  -- 7. Calculate shipping fee
  IF v_subtotal >= v_free_shipping_threshold OR v_subtotal = 0 THEN
    v_shipping := 0.00;
  ELSE
    v_shipping := v_flat_shipping_fee;
  END IF;

  v_total := v_subtotal + v_shipping;

  -- 8. Insert Order with targeted retry on order_number conflict
  v_order_id := NULL;
  FOR v_retry IN 1..10 LOOP
    v_rand := floor(1000 + random() * 9000)::int;
    v_order_num := 'BURBLE-' || to_char(NOW(), 'YYYYMMDD') || '-' || v_rand::text;

    INSERT INTO public.orders (
      order_number, source, customer_name, customer_email, customer_phone,
      delivery_address, city, district, pincode, delivery_notes,
      subtotal, shipping_fee, total_amount, status, locale
    ) VALUES (
      v_order_num, p_source, TRIM(p_customer_name), LOWER(TRIM(p_customer_email)), TRIM(p_customer_phone),
      TRIM(p_delivery_address), COALESCE(NULLIF(TRIM(p_city), ''), 'Doha'), p_district, p_pincode, p_delivery_notes,
      v_subtotal, v_shipping, v_total, 'pending', v_locale
    )
    ON CONFLICT (order_number) DO NOTHING
    RETURNING id INTO v_order_id;

    -- If an order ID was returned, insert succeeded
    IF v_order_id IS NOT NULL THEN
      EXIT;
    END IF;
  END LOOP;

  IF v_order_id IS NULL THEN
    RAISE EXCEPTION 'Could not generate a unique order number after 10 attempts. Please retry checkout.';
  END IF;

  -- 9. Insert Order Items
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_qty := (v_item->>'quantity')::int;
    SELECT name, name_ar, price INTO v_product FROM public.products WHERE id = (v_item->>'product_id')::uuid;

    INSERT INTO public.order_items (
      order_id, product_id, product_name, product_name_ar, price, quantity, total
    ) VALUES (
      v_order_id,
      (v_item->>'product_id')::uuid,
      v_product.name,
      v_product.name_ar,
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

-- Permissions on create_order RPC
REVOKE EXECUTE ON FUNCTION public.create_order(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, JSONB, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_order(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, JSONB, TEXT) TO anon, authenticated, service_role, postgres;

COMMIT;
