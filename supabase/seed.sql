-- ============================================================
-- BURBLE FLOWER E-COMMERCE REAL CATALOG SEED DATA
-- ============================================================

-- 1. SITE SETTINGS SEED (Singleton)
INSERT INTO public.site_settings (id, store_name, tagline, whatsapp_number, admin_email, currency_symbol, announcement_text, announcement_enabled, free_shipping_threshold, flat_shipping_fee)
VALUES (
  1,
  'Burble',
  'Flowers make moments special',
  '97400000000',
  'admin@burbleflowers.com',
  'QAR',
  'Fresh Flowers Sourced Daily • Same-Day Delivery • Premium Quality • Beautifully Wrapped',
  true,
  300.00,
  25.00
)
ON CONFLICT (id) DO UPDATE SET
  store_name = EXCLUDED.store_name,
  tagline = EXCLUDED.tagline,
  whatsapp_number = EXCLUDED.whatsapp_number,
  admin_email = EXCLUDED.admin_email,
  currency_symbol = EXCLUDED.currency_symbol,
  announcement_text = EXCLUDED.announcement_text,
  announcement_enabled = EXCLUDED.announcement_enabled,
  free_shipping_threshold = EXCLUDED.free_shipping_threshold,
  flat_shipping_fee = EXCLUDED.flat_shipping_fee,
  updated_at = NOW();

-- 2. CATEGORIES SEED (6 Core Catalog Categories)
INSERT INTO public.categories (id, name, slug, description, image_url, sort_order, active)
VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Hand Bouquets', 'hand-bouquets', 'Hand-crafted fresh floral bouquets wrapped in bespoke luxury paper.', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455198/burble/product_blush_bouquet.jpg', 1, true),
  ('c1000000-0000-0000-0000-000000000002', 'Flowers in Vase', 'flowers-in-vase', 'Artisanal floral arrangements presented in crystal and ceramic vases.', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455265/burble/product_white_lily.jpg', 2, true),
  ('c1000000-0000-0000-0000-000000000003', 'Premium Collections', 'premium-collections', 'Exclusive luxury arrangements featuring rare Ecuadorian roses & Dutch blooms.', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455268/burble/premium_banner.jpg', 3, true),
  ('c1000000-0000-0000-0000-000000000004', 'Gift Hampers', 'gift-hampers', 'Curated luxury gift sets with Belgian chocolates, scented candles & fresh flowers.', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455264/burble/product_pastel_bouquet.jpg', 4, true),
  ('c1000000-0000-0000-0000-000000000005', 'Combos', 'combos', 'Perfect pairings of signature bouquets with artisan cakes and helium balloons.', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455263/burble/product_red_roses.jpg', 5, true),
  ('c1000000-0000-0000-0000-000000000006', 'DIY Flowers', 'diy-flowers', 'Stem bundles for creative home styling, flower arranging & workshops.', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455266/burble/product_sunshine_bouquet.jpg', 6, true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order,
  active = EXCLUDED.active;

-- 3. COLLECTIONS & OCCASIONS SEED
-- Occasions
INSERT INTO public.collections (id, title, slug, subtitle, image_url, type, sort_order, active)
VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Birthday', 'birthday', 'Celebrate special birthdays with vibrant fresh blooms.', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455266/burble/product_sunshine_bouquet.jpg', 'occasion', 1, true),
  ('a1000000-0000-0000-0000-000000000002', 'Anniversary', 'anniversary', 'Express eternal devotion with romantic red roses.', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455263/burble/product_red_roses.jpg', 'occasion', 2, true),
  ('a1000000-0000-0000-0000-000000000003', 'Love & Romance', 'love-romance', 'Passionate arrangements created for romantic moments.', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455198/burble/product_blush_bouquet.jpg', 'occasion', 3, true),
  ('a1000000-0000-0000-0000-000000000004', 'Graduation', 'graduation', 'Honor bright achievements with cheerful celebratory flowers.', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455264/burble/product_pastel_bouquet.jpg', 'occasion', 4, true),
  ('a1000000-0000-0000-0000-000000000005', 'Get Well Soon', 'get-well-soon', 'Bring warmth and healing wishes with uplifting pastel florals.', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455265/burble/product_white_lily.jpg', 'occasion', 5, true),
  ('a1000000-0000-0000-0000-000000000006', 'Thank You', 'thank-you', 'Convey sincere appreciation with elegant bouquets.', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455265/burble/product_white_lily.jpg', 'occasion', 6, true),
  ('a1000000-0000-0000-0000-000000000007', 'Love You', 'love-you', 'Say I Love You with timeless handcrafted floral gifts.', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455263/burble/product_red_roses.jpg', 'occasion', 7, true)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  image_url = EXCLUDED.image_url,
  type = EXCLUDED.type,
  sort_order = EXCLUDED.sort_order,
  active = EXCLUDED.active;

-- Flower Types
INSERT INTO public.collections (id, title, slug, subtitle, image_url, type, sort_order, active)
VALUES
  ('f1000000-0000-0000-0000-000000000001', 'Roses', 'roses', 'Classic, velvet, spray & garden roses.', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455263/burble/product_red_roses.jpg', 'flower', 1, true),
  ('f1000000-0000-0000-0000-000000000002', 'Tulips', 'tulips', 'Dutch imported crisp spring tulips.', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455264/burble/product_pastel_bouquet.jpg', 'flower', 2, true),
  ('f1000000-0000-0000-0000-000000000003', 'Lilies', 'lilies', 'Fragrant white & stargazer oriental lilies.', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455265/burble/product_white_lily.jpg', 'flower', 3, true),
  ('f1000000-0000-0000-0000-000000000004', 'Peonies', 'peonies', 'Lush pink and white blush peonies.', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455198/burble/product_blush_bouquet.jpg', 'flower', 4, true),
  ('f1000000-0000-0000-0000-000000000005', 'Carnations', 'carnations', 'Long-lasting vibrant spray carnations.', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455266/burble/product_sunshine_bouquet.jpg', 'flower', 5, true),
  ('f1000000-0000-0000-0000-000000000006', 'Orchids', 'orchids', 'Exotic phalaenopsis & cymbidium orchids.', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455265/burble/product_white_lily.jpg', 'flower', 6, true),
  ('f1000000-0000-0000-0000-000000000007', 'Hydrangeas', 'hydrangeas', 'Voluminous pastel hydrangeas.', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455264/burble/product_pastel_bouquet.jpg', 'flower', 7, true),
  ('f1000000-0000-0000-0000-000000000008', 'Mixed Flowers', 'mixed-flowers', 'Curated multi-bloom seasonal compositions.', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455266/burble/product_sunshine_bouquet.jpg', 'flower', 8, true)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  image_url = EXCLUDED.image_url,
  type = EXCLUDED.type,
  sort_order = EXCLUDED.sort_order,
  active = EXCLUDED.active;

-- Standard Collections
INSERT INTO public.collections (id, title, slug, subtitle, image_url, type, sort_order, active)
VALUES
  ('cc000000-0000-0000-0000-000000000001', 'Best Sellers', 'best-sellers', 'Our most loved arrangements voted by customers.', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455263/burble/product_red_roses.jpg', 'collection', 1, true),
  ('cc000000-0000-0000-0000-000000000002', 'Luxury Collection', 'luxury-collection', 'Grand arrangements for grand statements.', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455268/burble/premium_banner.jpg', 'collection', 2, true),
  ('cc000000-0000-0000-0000-000000000003', 'Birthday Collection', 'birthday-collection', 'Bright, joyous birthday florals.', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455266/burble/product_sunshine_bouquet.jpg', 'collection', 3, true),
  ('cc000000-0000-0000-0000-000000000004', 'Romantic Collection', 'romantic-collection', 'Passion red & blush romance collection.', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455198/burble/product_blush_bouquet.jpg', 'collection', 4, true),
  ('cc000000-0000-0000-0000-000000000005', 'Elegant Whites', 'elegant-whites', 'Pure white lilies, roses and hydrangeas.', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455265/burble/product_white_lily.jpg', 'collection', 5, true),
  ('cc000000-0000-0000-0000-000000000006', 'Colorful Blooms', 'colorful-blooms', 'Vibrant multi-color celebratory flowers.', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455264/burble/product_pastel_bouquet.jpg', 'collection', 6, true)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  image_url = EXCLUDED.image_url,
  type = EXCLUDED.type,
  sort_order = EXCLUDED.sort_order,
  active = EXCLUDED.active;

-- 4. PRODUCTS SEED
INSERT INTO public.products (id, name, slug, description, price, compare_at_price, category_id, is_featured, is_new_arrival, stock_status, active, main_image_url, hover_image_url, sort_order)
VALUES
  (
    'd1000000-0000-0000-0000-000000000001',
    'Blush Elegance Bouquet',
    'blush-elegance-bouquet',
    'A graceful hand-tied bouquet of blush pink garden roses, spray roses and silver eucalyptus wrapped in delicate cream tissue.',
    280.00,
    320.00,
    'c1000000-0000-0000-0000-000000000001',
    true,
    true,
    'in_stock',
    true,
    'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455198/burble/product_blush_bouquet.jpg',
    'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455264/burble/product_pastel_bouquet.jpg',
    1
  ),
  (
    'd1000000-0000-0000-0000-000000000002',
    'Red Love Bouquet',
    'red-love-bouquet',
    'Classic arrangement of premium deep red velvet roses wrapped in sleek black paper with satin ribbon.',
    290.00,
    NULL,
    'c1000000-0000-0000-0000-000000000001',
    true,
    true,
    'in_stock',
    true,
    'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455263/burble/product_red_roses.jpg',
    'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455269/burble/hero_desktop.jpg',
    2
  ),
  (
    'd1000000-0000-0000-0000-000000000003',
    'Pastel Dream Bouquet',
    'pastel-dream-bouquet',
    'Dreamy combination of peach garden roses, cream ranunculus and lilac lisianthus wrapped in soft lavender paper.',
    300.00,
    350.00,
    'c1000000-0000-0000-0000-000000000001',
    true,
    true,
    'in_stock',
    true,
    'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455264/burble/product_pastel_bouquet.jpg',
    'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455198/burble/product_blush_bouquet.jpg',
    3
  ),
  (
    'd1000000-0000-0000-0000-000000000004',
    'White Lily Bouquet',
    'white-lily-bouquet',
    'Pure white oriental lilies complemented with white spray roses and fresh greenery wrapped in sage paper.',
    330.00,
    NULL,
    'c1000000-0000-0000-0000-000000000001',
    false,
    true,
    'in_stock',
    true,
    'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455265/burble/product_white_lily.jpg',
    'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455264/burble/product_pastel_bouquet.jpg',
    4
  ),
  (
    'd1000000-0000-0000-0000-000000000005',
    'Sunshine Mixed Bouquet',
    'sunshine-mixed-bouquet',
    'Radiant bright arrangement featuring golden sunflowers, yellow roses and daisy chrysanthemums in eco-friendly kraft wrap.',
    260.00,
    290.00,
    'c1000000-0000-0000-0000-000000000001',
    true,
    true,
    'in_stock',
    true,
    'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455266/burble/product_sunshine_bouquet.jpg',
    'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455198/burble/product_blush_bouquet.jpg',
    5
  ),
  (
    'd1000000-0000-0000-0000-000000000006',
    'Classic Red Roses Vase',
    'classic-red-roses-vase',
    'Long-stemmed red roses arranged in an artisan clear crystal vase.',
    350.00,
    NULL,
    'c1000000-0000-0000-0000-000000000002',
    true,
    false,
    'in_stock',
    true,
    'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455263/burble/product_red_roses.jpg',
    'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455272/burble/delivery_banner.jpg',
    6
  ),
  (
    'd1000000-0000-0000-0000-000000000007',
    'Mixed Floral Vase',
    'mixed-floral-vase',
    'A vibrant garden arrangement of seasonal blooms presented in a handcrafted ceramic vase.',
    280.00,
    NULL,
    'c1000000-0000-0000-0000-000000000002',
    true,
    false,
    'in_stock',
    true,
    'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455264/burble/product_pastel_bouquet.jpg',
    'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455271/burble/hero_slide_two.jpg',
    7
  ),
  (
    'd1000000-0000-0000-0000-000000000008',
    'Elegant White Vase',
    'elegant-white-vase',
    'Pure white lilies and roses in an opaque ribbed white ceramic vase.',
    380.00,
    NULL,
    'c1000000-0000-0000-0000-000000000002',
    true,
    false,
    'in_stock',
    true,
    'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455265/burble/product_white_lily.jpg',
    'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455198/burble/product_blush_bouquet.jpg',
    8
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  compare_at_price = EXCLUDED.compare_at_price,
  category_id = EXCLUDED.category_id,
  is_featured = EXCLUDED.is_featured,
  is_new_arrival = EXCLUDED.is_new_arrival,
  stock_status = EXCLUDED.stock_status,
  active = EXCLUDED.active,
  main_image_url = EXCLUDED.main_image_url,
  hover_image_url = EXCLUDED.hover_image_url,
  sort_order = EXCLUDED.sort_order,
  updated_at = NOW();

-- 5. COLLECTION ITEMS JUNCTION SEED
INSERT INTO public.collection_items (collection_id, product_id, sort_order)
VALUES
  ('cc000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001', 1),
  ('cc000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000002', 2),
  ('cc000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000003', 3),
  ('a1000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000005', 1),
  ('a1000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000002', 1),
  ('f1000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000002', 1)
ON CONFLICT (collection_id, product_id) DO NOTHING;

-- 6. BLOG POSTS SEED
INSERT INTO public.blog_posts (id, title, slug, excerpt, content, cover_image, author, is_published, published_at)
VALUES
  (
    'b1000000-0000-0000-0000-000000000001',
    'The Meaning Behind Different Flowers',
    'meaning-behind-different-flowers',
    'Discover what red roses, pink peonies and white lilies symbolize when gifting your loved ones.',
    'Flowers have carried deep romantic and cultural symbolism for centuries. Red roses represent passionate love, while white lilies embody purity and elegance.',
    'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455269/burble/hero_desktop.jpg',
    'Burble Florist',
    true,
    NOW()
  ),
  (
    'b1000000-0000-0000-0000-000000000002',
    'How to Keep Your Flowers Fresh Longer',
    'keep-flowers-fresh-longer',
    'Simple care tips to extend the life of your handcrafted bouquet at home.',
    'Trim stems at a 45-degree angle under lukewarm running water every two days. Always change the water daily and keep blooms away from direct sunlight.',
    'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455271/burble/hero_slide_two.jpg',
    'Master Florist',
    true,
    NOW()
  ),
  (
    'b1000000-0000-0000-0000-000000000003',
    'Perfect Flowers for Every Occasion',
    'perfect-flowers-for-every-occasion',
    'A curated guide to choosing memorable blooms for birthdays, anniversaries and special moments.',
    'Whether celebrating an milestone anniversary or expressing heartfelt gratitude, selecting the right floral arrangement elevates every moment.',
    'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455198/burble/product_blush_bouquet.jpg',
    'Burble Stylist',
    true,
    NOW()
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  cover_image = EXCLUDED.cover_image,
  author = EXCLUDED.author,
  is_published = EXCLUDED.is_published,
  published_at = EXCLUDED.published_at;

-- 7. HOMEPAGE SECTIONS SEED
INSERT INTO public.homepage_sections (id, section_key, title, subtitle, is_visible, sort_order, content_json)
VALUES
  ('e1000000-0000-0000-0000-000000000001', 'announcement_bar', 'Announcement Bar', 'Top store announcement banner', true, 1, '{"text": "Fresh Flowers Sourced Daily • Same-Day Delivery • Premium Quality • Beautifully Wrapped"}'::jsonb),
  ('e1000000-0000-0000-0000-000000000002', 'hero_banner', 'Main Hero Slider', 'Homepage top visual hero slides', true, 2, '{"heading": "Handcrafted Floral Arrangements", "subheading": "Sourced daily for life''s most memorable moments"}'::jsonb),
  ('e1000000-0000-0000-0000-000000000003', 'feature_bar', 'Value Proposition Bar', 'Guarantees & features bar', true, 3, '{"features": ["Same Day Delivery", "Fresh Daily Guarantee", "Bespoke Gift Wrapping"]}'::jsonb)
ON CONFLICT (section_key) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  is_visible = EXCLUDED.is_visible,
  sort_order = EXCLUDED.sort_order,
  content_json = EXCLUDED.content_json,
  updated_at = NOW();

-- 8. MEDIA ASSETS SEED
INSERT INTO public.media_assets (public_id, url, width, height, format, folder, alt_text)
VALUES
  ('burble/product_blush_bouquet', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455198/burble/product_blush_bouquet.jpg', 1024, 1024, 'jpg', 'burble', 'Blush Elegance Bouquet'),
  ('burble/product_red_roses', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455263/burble/product_red_roses.jpg', 1024, 1024, 'jpg', 'burble', 'Red Love Bouquet'),
  ('burble/product_pastel_bouquet', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455264/burble/product_pastel_bouquet.jpg', 1024, 1024, 'jpg', 'burble', 'Pastel Dream Bouquet'),
  ('burble/product_white_lily', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455265/burble/product_white_lily.jpg', 1024, 1024, 'jpg', 'burble', 'White Lily Bouquet'),
  ('burble/product_sunshine_bouquet', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455266/burble/product_sunshine_bouquet.jpg', 1024, 1024, 'jpg', 'burble', 'Sunshine Mixed Bouquet'),
  ('burble/premium_banner', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455268/burble/premium_banner.jpg', 1376, 768, 'jpg', 'burble', 'Premium Collection Banner'),
  ('burble/hero_desktop', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455269/burble/hero_desktop.jpg', 1376, 768, 'jpg', 'burble', 'Main Hero Banner Desktop'),
  ('burble/hero_slide_two', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455271/burble/hero_slide_two.jpg', 1376, 768, 'jpg', 'burble', 'Hero Slide Two'),
  ('burble/delivery_banner', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455272/burble/delivery_banner.jpg', 1376, 768, 'jpg', 'burble', 'Same Day Delivery Banner'),
  ('burble/hero_mobile', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455274/burble/hero_mobile.jpg', 768, 1376, 'jpg', 'burble', 'Hero Mobile Banner'),
  ('burble/hero_mobile_v2', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455275/burble/hero_mobile_v2.jpg', 768, 1376, 'jpg', 'burble', 'Hero Mobile Banner V2')
ON CONFLICT (public_id) DO UPDATE SET
  url = EXCLUDED.url,
  width = EXCLUDED.width,
  height = EXCLUDED.height,
  format = EXCLUDED.format,
  folder = EXCLUDED.folder,
  alt_text = EXCLUDED.alt_text;

