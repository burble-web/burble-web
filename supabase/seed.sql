-- ============================================================
-- BURBLE FLOWER E-COMMERCE REAL CATALOG SEED DATA (EN + AR)
-- ============================================================

-- 1. SITE SETTINGS SEED (Singleton)
INSERT INTO public.site_settings (
  id,
  store_name,
  store_name_ar,
  tagline,
  tagline_ar,
  whatsapp_number,
  admin_email,
  currency_symbol,
  currency_symbol_ar,
  announcement_text,
  announcement_text_ar,
  announcement_enabled,
  free_shipping_threshold,
  flat_shipping_fee
)
VALUES (
  1,
  'Burble',
  'بيربل',
  'Flowers make moments special',
  'الزهور تضفي سحراً على أجمل اللحظات',
  '97400000000',
  'admin@burbleflowers.com',
  'QAR',
  'ر.ق',
  'Fresh Flowers Sourced Daily • Same-Day Delivery • Premium Quality • Beautifully Wrapped',
  'زهور نضرة يتم استيرادها يومياً • توصيل في نفس اليوم • جودة فاخرة • تغليف راقٍ ومميز',
  true,
  300.00,
  25.00
)
ON CONFLICT (id) DO UPDATE SET
  store_name = EXCLUDED.store_name,
  store_name_ar = EXCLUDED.store_name_ar,
  tagline = EXCLUDED.tagline,
  tagline_ar = EXCLUDED.tagline_ar,
  whatsapp_number = EXCLUDED.whatsapp_number,
  admin_email = EXCLUDED.admin_email,
  currency_symbol = EXCLUDED.currency_symbol,
  currency_symbol_ar = EXCLUDED.currency_symbol_ar,
  announcement_text = EXCLUDED.announcement_text,
  announcement_text_ar = EXCLUDED.announcement_text_ar,
  announcement_enabled = EXCLUDED.announcement_enabled,
  free_shipping_threshold = EXCLUDED.free_shipping_threshold,
  flat_shipping_fee = EXCLUDED.flat_shipping_fee,
  updated_at = NOW();

-- 2. CATEGORIES SEED (6 Core Catalog Categories)
INSERT INTO public.categories (id, name, name_ar, slug, description, description_ar, image_url, sort_order, active)
VALUES
  (
    'c1000000-0000-0000-0000-000000000001',
    'Hand Bouquets',
    'باقات يد فاخرة',
    'hand-bouquets',
    'Hand-crafted fresh floral bouquets wrapped in bespoke luxury paper.',
    'باقات زهور طبيعية نضرة منسقة يدوياً ومغلفة بأرقى أوراق التغليف الفاخرة.',
    'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455198/burble/product_blush_bouquet.jpg',
    1,
    true
  ),
  (
    'c1000000-0000-0000-0000-000000000002',
    'Flowers in Vase',
    'زهور في فازة',
    'flowers-in-vase',
    'Artisanal floral arrangements presented in crystal and ceramic vases.',
    'تنسيقات زهرية استثنائية معروضة في فازات كريستالية وسيراميك راقية.',
    'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455265/burble/product_white_lily.jpg',
    2,
    true
  ),
  (
    'c1000000-0000-0000-0000-000000000003',
    'Premium Collections',
    'التشكيلة الفاخرة',
    'premium-collections',
    'Exclusive luxury arrangements featuring rare Ecuadorian roses & Dutch blooms.',
    'تنسيقات زهور حصرية واستثنائية تضم ورود الإكوادور النادرة والزهور الهولندية الفاخرة.',
    'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455268/burble/premium_banner.jpg',
    3,
    true
  ),
  (
    'c1000000-0000-0000-0000-000000000004',
    'Gift Hampers',
    'صناديق الهدايا والتوزيعات',
    'gift-hampers',
    'Curated luxury gift sets with Belgian chocolates, scented candles & fresh flowers.',
    'مجموعات هدايا راقية تجمع بين الشوكولاتة البلجيكية، الشموع المعطرة والزهور النضرة.',
    'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455264/burble/product_pastel_bouquet.jpg',
    4,
    true
  ),
  (
    'c1000000-0000-0000-0000-000000000005',
    'Combos',
    'الباقات المدمجة',
    'combos',
    'Perfect pairings of signature bouquets with artisan cakes and helium balloons.',
    'توليفات مثالية تجمع بين باقاتنا المميزة مع الكيك الفاخر وبالونات الهيليوم.',
    'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455263/burble/product_red_roses.jpg',
    5,
    true
  ),
  (
    'c1000000-0000-0000-0000-000000000006',
    'DIY Flowers',
    'التنسيق المنزلي (DIY)',
    'diy-flowers',
    'Stem bundles for creative home styling, flower arranging & workshops.',
    'حزم سيقان زهور منفردة للإبداع والتنسيق المنزلي وورش العمل.',
    'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455266/burble/product_sunshine_bouquet.jpg',
    6,
    true
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order,
  active = EXCLUDED.active;

-- 3. COLLECTIONS & OCCASIONS SEED
-- Occasions
INSERT INTO public.collections (id, title, title_ar, slug, subtitle, subtitle_ar, image_url, type, sort_order, active)
VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Birthday', 'أعياد الميلاد', 'birthday', 'Celebrate special birthdays with vibrant fresh blooms.', 'احتفل بأعياد الميلاد بأبهى باقات الزهور النضرة والمبهجة.', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455266/burble/product_sunshine_bouquet.jpg', 'occasion', 1, true),
  ('a1000000-0000-0000-0000-000000000002', 'Anniversary', 'الذكرى السنوية', 'anniversary', 'Express eternal devotion with romantic red roses.', 'عبّر عن أسمى مشاعر المحبة بجمال الجوري الأحمر المخملي.', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455263/burble/product_red_roses.jpg', 'occasion', 2, true),
  ('a1000000-0000-0000-0000-000000000003', 'Love & Romance', 'حب ورومانسية', 'love-romance', 'Passionate arrangements created for romantic moments.', 'تنسيقات مفعمة بالشغف صُممت لتخليد اللحظات الرومانسية.', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455198/burble/product_blush_bouquet.jpg', 'occasion', 3, true),
  ('a1000000-0000-0000-0000-000000000004', 'Graduation', 'التخرج والنجاح', 'graduation', 'Honor bright achievements with cheerful celebratory flowers.', 'كافئ النجاح والإنجاز بباقات احتفالية مشرقة تليق بالفرحة.', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455264/burble/product_pastel_bouquet.jpg', 'occasion', 4, true),
  ('a1000000-0000-0000-0000-000000000005', 'Get Well Soon', 'سلامتك وشفاء عاجل', 'get-well-soon', 'Bring warmth and healing wishes with uplifting pastel florals.', 'انشر التفاؤل وأمنيات الشفاء بألوان الباستيل الزهرية الهادئة.', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455265/burble/product_white_lily.jpg', 'occasion', 5, true),
  ('a1000000-0000-0000-0000-000000000006', 'Thank You', 'شكر وتقدير', 'thank-you', 'Convey sincere appreciation with elegant bouquets.', 'عبّر عن الامتنان والتقدير بأرقى باقات الزهور الملكية.', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455265/burble/product_white_lily.jpg', 'occasion', 6, true),
  ('a1000000-0000-0000-0000-000000000007', 'Love You', 'محبة وامتنان', 'love-you', 'Say I Love You with timeless handcrafted floral gifts.', 'عبّر عن محبتك الصادقة بباقات زهور كلاسيكية خالدة.', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455263/burble/product_red_roses.jpg', 'occasion', 7, true)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  subtitle = EXCLUDED.subtitle,
  subtitle_ar = EXCLUDED.subtitle_ar,
  image_url = EXCLUDED.image_url,
  type = EXCLUDED.type,
  sort_order = EXCLUDED.sort_order,
  active = EXCLUDED.active;

-- Flower Types
INSERT INTO public.collections (id, title, title_ar, slug, subtitle, subtitle_ar, image_url, type, sort_order, active)
VALUES
  ('f1000000-0000-0000-0000-000000000001', 'Roses', 'الجوري والورد', 'roses', 'Classic, velvet, spray & garden roses.', 'الجوري الكلاسيكي، المخملي، بيبي جوري وجوري الحديقة.', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455263/burble/product_red_roses.jpg', 'flower', 1, true),
  ('f1000000-0000-0000-0000-000000000002', 'Tulips', 'التوليب', 'tulips', 'Dutch imported crisp spring tulips.', 'زهور التوليب الهولندية الفاخرة ذات النضارة الفائقة.', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455264/burble/product_pastel_bouquet.jpg', 'flower', 2, true),
  ('f1000000-0000-0000-0000-000000000003', 'Lilies', 'الزنبق (الليلي)', 'lilies', 'Fragrant white & stargazer oriental lilies.', 'زهور الزنبق الأبيض الفواحة وزنبق الستارجايزر الشرقي.', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455265/burble/product_white_lily.jpg', 'flower', 3, true),
  ('f1000000-0000-0000-0000-000000000004', 'Peonies', 'الفاونيا (البيوني)', 'peonies', 'Lush pink and white blush peonies.', 'زهور الفاونيا الوردية والبيضاء الغنية بالبتلات الفاخرة.', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455198/burble/product_blush_bouquet.jpg', 'flower', 4, true),
  ('f1000000-0000-0000-0000-000000000005', 'Carnations', 'القرنفل', 'carnations', 'Long-lasting vibrant spray carnations.', 'زهور القرنفل المتألقة بألوانها الزاهية وتدوم طويلاً.', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455266/burble/product_sunshine_bouquet.jpg', 'flower', 5, true),
  ('f1000000-0000-0000-0000-000000000006', 'Orchids', 'الأوركيد', 'orchids', 'Exotic phalaenopsis & cymbidium orchids.', 'زهور أوركيد الفالينوبسيس والسيمبيديوم النادرة والملكية.', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455265/burble/product_white_lily.jpg', 'flower', 6, true),
  ('f1000000-0000-0000-0000-000000000007', 'Hydrangeas', 'الهيدرانجيا', 'hydrangeas', 'Voluminous pastel hydrangeas.', 'زهور الهيدرانجيا الممتلئة بألوان الباستيل الساحرة.', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455264/burble/product_pastel_bouquet.jpg', 'flower', 7, true),
  ('f1000000-0000-0000-0000-000000000008', 'Mixed Flowers', 'زهور مشكلة', 'mixed-flowers', 'Curated multi-bloom seasonal compositions.', 'توليفات زهرية موسمية منوعة تجمع أجمل أنواع الزهور.', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455266/burble/product_sunshine_bouquet.jpg', 'flower', 8, true)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  subtitle = EXCLUDED.subtitle,
  subtitle_ar = EXCLUDED.subtitle_ar,
  image_url = EXCLUDED.image_url,
  type = EXCLUDED.type,
  sort_order = EXCLUDED.sort_order,
  active = EXCLUDED.active;

-- Standard Collections
INSERT INTO public.collections (id, title, title_ar, slug, subtitle, subtitle_ar, image_url, type, sort_order, active)
VALUES
  ('cc000000-0000-0000-0000-000000000001', 'Best Sellers', 'الأكثر مبيعاً', 'best-sellers', 'Our most loved arrangements voted by customers.', 'التنسيقات الأكثر طلباً ومحبة لدى عملاء بيربل.', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455263/burble/product_red_roses.jpg', 'collection', 1, true),
  ('cc000000-0000-0000-0000-000000000002', 'Luxury Collection', 'المجموعة الفاخرة', 'luxury-collection', 'Grand arrangements for grand statements.', 'تنسيقات زهرية ضخمة تليق بالمناسبات الكبرى.', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455268/burble/premium_banner.jpg', 'collection', 2, true),
  ('cc000000-0000-0000-0000-000000000003', 'Birthday Collection', 'مجموعة أعياد الميلاد', 'birthday-collection', 'Bright, joyous birthday florals.', 'زهور أعياد ميلاد مبهجة تشع بالفرح والسرور.', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455266/burble/product_sunshine_bouquet.jpg', 'collection', 3, true),
  ('cc000000-0000-0000-0000-000000000004', 'Romantic Collection', 'المجموعة الرومانسية', 'romantic-collection', 'Passion red & blush romance collection.', 'تشكيلة الجوري الأحمر المخملي والوردي الرومانسي.', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455198/burble/product_blush_bouquet.jpg', 'collection', 4, true),
  ('cc000000-0000-0000-0000-000000000005', 'Elegant Whites', 'البياض الملكي', 'elegant-whites', 'Pure white lilies, roses and hydrangeas.', 'نقاء الزنبق الأبيض، الجوري والهيدرانجيا الملكية.', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455265/burble/product_white_lily.jpg', 'collection', 5, true),
  ('cc000000-0000-0000-0000-000000000006', 'Colorful Blooms', 'ألوان البهجة', 'colorful-blooms', 'Vibrant multi-color celebratory flowers.', 'زهور احتفالية متعددة الألوان تضفي بهجة استثنائية.', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455264/burble/product_pastel_bouquet.jpg', 'collection', 6, true)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  subtitle = EXCLUDED.subtitle,
  subtitle_ar = EXCLUDED.subtitle_ar,
  image_url = EXCLUDED.image_url,
  type = EXCLUDED.type,
  sort_order = EXCLUDED.sort_order,
  active = EXCLUDED.active;

-- 4. PRODUCTS SEED
INSERT INTO public.products (
  id,
  name,
  name_ar,
  slug,
  description,
  description_ar,
  short_description,
  short_description_ar,
  price,
  compare_at_price,
  category_id,
  is_featured,
  is_new_arrival,
  stock_status,
  active,
  main_image_url,
  hover_image_url,
  sort_order,
  arabic_translation_source
)
VALUES
  (
    'd1000000-0000-0000-0000-000000000001',
    'Blush Elegance Bouquet',
    'باقة بلش الأنيقة',
    'blush-elegance-bouquet',
    'A graceful hand-tied bouquet of blush pink garden roses, spray roses and silver eucalyptus wrapped in delicate cream tissue.',
    'باقة يد ساحرة منسقة بعناية من ورود جوري الحديقة الوردية الناعمة والبيبي جوري مع أوراق الكينا العطرة، مغلفة بأوراق كريمية فاخرة.',
    'Blush garden roses with silver eucalyptus in cream wrap.',
    'ورود جوري وردية ناعمة مع أوراق الكينا العطرة بتغليف كريمي أنيق.',
    280.00,
    320.00,
    'c1000000-0000-0000-0000-000000000001',
    true,
    true,
    'in_stock',
    true,
    'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455198/burble/product_blush_bouquet.jpg',
    'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455264/burble/product_pastel_bouquet.jpg',
    1,
    'manual'
  ),
  (
    'd1000000-0000-0000-0000-000000000002',
    'Red Love Bouquet',
    'باقة عشق الجوري الأحمر',
    'red-love-bouquet',
    'Classic arrangement of premium deep red velvet roses wrapped in sleek black paper with satin ribbon.',
    'تنسيق كلاسيكي آسر من أفخر ورود الجوري المخملي الأحمر الداكن، مغلفة بأناقة في ورق أسود فاخر مع شريط ستان حريري.',
    'Deep red velvet roses in sleek black luxury wrap.',
    'جوري أحمر مخملي داكن بتغليف أسود ملكي وشريط ستان.',
    290.00,
    NULL,
    'c1000000-0000-0000-0000-000000000001',
    true,
    true,
    'in_stock',
    true,
    'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455263/burble/product_red_roses.jpg',
    'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455269/burble/hero_desktop.jpg',
    2,
    'manual'
  ),
  (
    'd1000000-0000-0000-0000-000000000003',
    'Pastel Dream Bouquet',
    'باقة حلم الباستيل',
    'pastel-dream-bouquet',
    'Dreamy combination of peach garden roses, cream ranunculus and lilac lisianthus wrapped in soft lavender paper.',
    'مزيج حالم وفاتن يجمع بين الجوري الخوخي الناعم، زهور الحوذان الكريمية والليزانثس البنفسجي، مغلفة بأوراق اللافندر الراقية.',
    'Peach garden roses, cream ranunculus and lilac lisianthus.',
    'تناغم ألوان الباستيل الهادئة بين الجوري الخوخي والليزانثس البنفسجي.',
    300.00,
    350.00,
    'c1000000-0000-0000-0000-000000000001',
    true,
    true,
    'in_stock',
    true,
    'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455264/burble/product_pastel_bouquet.jpg',
    'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455198/burble/product_blush_bouquet.jpg',
    3,
    'manual'
  ),
  (
    'd1000000-0000-0000-0000-000000000004',
    'White Lily Bouquet',
    'باقة الزنبق الأبيض الملكي',
    'white-lily-bouquet',
    'Pure white oriental lilies complemented with white spray roses and fresh greenery wrapped in sage paper.',
    'زهور الزنبق الأبيض (الليلي) الفواحة مع زهور البيبي جوري البيضاء وأغصان الخضرة النضرة، بتغليف أنيق بدرجات الأخضر المريمي.',
    'Fragrant white oriental lilies and spray roses.',
    'زنبق أبيض ناصع فواح متناغم مع البيبي جوري الأبيض وخضرة نضرة.',
    330.00,
    NULL,
    'c1000000-0000-0000-0000-000000000001',
    false,
    true,
    'in_stock',
    true,
    'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455265/burble/product_white_lily.jpg',
    'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455264/burble/product_pastel_bouquet.jpg',
    4,
    'manual'
  ),
  (
    'd1000000-0000-0000-0000-000000000005',
    'Sunshine Mixed Bouquet',
    'باقة إشراقة الشمس المشكلة',
    'sunshine-mixed-bouquet',
    'Radiant bright arrangement featuring golden sunflowers, yellow roses and daisy chrysanthemums in eco-friendly kraft wrap.',
    'تنسيق مبهج ونابض بالحياة يضم دوار الشمس الذهبي والورود الصفراء مع زهور الأقحوان المتألقة في تغليف كرافت راقٍ وصديق للبيئة.',
    'Golden sunflowers, yellow roses and chrysanthemums.',
    'دوار الشمس الذهبي مع الجوري الأصفر في تغليف كرافت طبيعي.',
    260.00,
    290.00,
    'c1000000-0000-0000-0000-000000000001',
    true,
    true,
    'in_stock',
    true,
    'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455266/burble/product_sunshine_bouquet.jpg',
    'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455198/burble/product_blush_bouquet.jpg',
    5,
    'manual'
  ),
  (
    'd1000000-0000-0000-0000-000000000006',
    'Classic Red Roses Vase',
    'فازة الجوري الأحمر الكلاسيكية',
    'classic-red-roses-vase',
    'Long-stemmed red roses arranged in an artisan clear crystal vase.',
    'أفخم ورود الجوري الأحمر طويل الساق منسقة بحرفية في فازة كريستال نقية وفاخرة تضفي بهاءً على أي مساحة.',
    'Long-stemmed red roses in clear crystal vase.',
    'ورود جوري أحمر طويل الساق في فازة كريستال نقية.',
    350.00,
    NULL,
    'c1000000-0000-0000-0000-000000000002',
    true,
    false,
    'in_stock',
    true,
    'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455263/burble/product_red_roses.jpg',
    'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455272/burble/delivery_banner.jpg',
    6,
    'manual'
  ),
  (
    'd1000000-0000-0000-0000-000000000007',
    'Mixed Floral Vase',
    'فازة الحديقة الزهرية المشكلة',
    'mixed-floral-vase',
    'A vibrant garden arrangement of seasonal blooms presented in a handcrafted ceramic vase.',
    'تنسيق زهور موسمية غني بألوان الطبيعة المبهجة، مقدم في فازة سيراميك مصنوعة ومزخرفة يدوياً.',
    'Seasonal multi-bloom garden mix in handcrafted ceramic vase.',
    'زهور موسمية مبهجة منسقة في فازة سيراميك يدوية الصنع.',
    280.00,
    NULL,
    'c1000000-0000-0000-0000-000000000002',
    true,
    false,
    'in_stock',
    true,
    'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455264/burble/product_pastel_bouquet.jpg',
    'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455271/burble/hero_slide_two.jpg',
    7,
    'manual'
  ),
  (
    'd1000000-0000-0000-0000-000000000008',
    'Elegant White Vase',
    'فازة البياض الملكي الفاخرة',
    'elegant-white-vase',
    'Pure white lilies and roses in an opaque ribbed white ceramic vase.',
    'زهور الزنبق الأبيض الناصع مع ورود الجوري الأبيض في فازة سيراميك بيضاء مضلعة تعكس أعلى معايير النقاء والرقي.',
    'Pure white lilies and roses in ribbed white ceramic vase.',
    'زنبق أبيض وجوري في فازة سيراميك بيضاء أنيقة.',
    380.00,
    NULL,
    'c1000000-0000-0000-0000-000000000002',
    true,
    false,
    'in_stock',
    true,
    'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455265/burble/product_white_lily.jpg',
    'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455198/burble/product_blush_bouquet.jpg',
    8,
    'manual'
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  name_ar = EXCLUDED.name_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  short_description = EXCLUDED.short_description,
  short_description_ar = EXCLUDED.short_description_ar,
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
  arabic_translation_source = EXCLUDED.arabic_translation_source,
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
INSERT INTO public.blog_posts (id, title, title_ar, slug, excerpt, excerpt_ar, content, content_ar, cover_image, author, author_ar, is_published, published_at)
VALUES
  (
    'b1000000-0000-0000-0000-000000000001',
    'The Meaning Behind Different Flowers',
    'معاني ودلالات ألوان وأنواع الزهور المختلفة',
    'meaning-behind-different-flowers',
    'Discover what red roses, pink peonies and white lilies symbolize when gifting your loved ones.',
    'اكتشف ما ترمز إليه ورود الجوري الأحمر، الفاونيا الوردية وزهور الزنبق الأبيض عند إهدائها لأحبائك.',
    'Flowers have carried deep romantic and cultural symbolism for centuries. Red roses represent passionate love, while white lilies embody purity and elegance.',
    'تحمل الزهور دلالات رومانسية وثقافية عميقة عبر العصور. فالجوري الأحمر يعبر عن الحب الصادق والشغف، بينما يجسد الزنبق الأبيض النقاء والأناقة الملكية.',
    'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455269/burble/hero_desktop.jpg',
    'Burble Florist',
    'منسق زهور بيربل',
    true,
    NOW()
  ),
  (
    'b1000000-0000-0000-0000-000000000002',
    'How to Keep Your Flowers Fresh Longer',
    'كيف تحافظ على نضارة باقة الزهور لفترة أطول في المنزل',
    'keep-flowers-fresh-longer',
    'Simple care tips to extend the life of your handcrafted bouquet at home.',
    'نصائح وإرشادات بسيطة من خبراء بيربل لإطالة عمر باقات الزهور الطبيعية داخل منزلك.',
    'Trim stems at a 45-degree angle under lukewarm running water every two days. Always change the water daily and keep blooms away from direct sunlight.',
    'قم بقص أطراف السيقان بزاوية 45 درجة تحت ماء فاتر كل يومين، واحرص على تغيير الماء يومياً وإبعاد الباقة عن أشعة الشمس المباشرة ومصادر الحرارة.',
    'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455271/burble/hero_slide_two.jpg',
    'Master Florist',
    'خبير تنسيق الزهور',
    true,
    NOW()
  ),
  (
    'b1000000-0000-0000-0000-000000000003',
    'Perfect Flowers for Every Occasion',
    'الدليل الشامل لاختيار الزهور المثالية لكل مناسبة',
    'perfect-flowers-for-every-occasion',
    'A curated guide to choosing memorable blooms for birthdays, anniversaries and special moments.',
    'دليل منسق بعناية لمساعدتك في اختيار أجمل الباقات لأعياد الميلاد، الذكرى السنوية واللحظات السعيدة.',
    'Whether celebrating an milestone anniversary or expressing heartfelt gratitude, selecting the right floral arrangement elevates every moment.',
    'سواء كنت تحتفل بذكرى زواج مميزة أو ترغب في التعبير عن جزيل الشكر والامتنان، فإن اختيار التنسيق الزهري المناسب يضفي سحراً لا يُنسى على كل لحظة.',
    'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455198/burble/product_blush_bouquet.jpg',
    'Burble Stylist',
    'مصمم بيربل',
    true,
    NOW()
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  excerpt = EXCLUDED.excerpt,
  excerpt_ar = EXCLUDED.excerpt_ar,
  content = EXCLUDED.content,
  content_ar = EXCLUDED.content_ar,
  cover_image = EXCLUDED.cover_image,
  author = EXCLUDED.author,
  author_ar = EXCLUDED.author_ar,
  is_published = EXCLUDED.is_published,
  published_at = EXCLUDED.published_at;

-- 7. HOMEPAGE SECTIONS SEED
INSERT INTO public.homepage_sections (id, section_key, title, title_ar, subtitle, subtitle_ar, is_visible, sort_order, content_json)
VALUES
  (
    'e1000000-0000-0000-0000-000000000001',
    'announcement_bar',
    'Announcement Bar',
    'شريط الإعلانات العلوي',
    'Top store announcement banner',
    'شريط الإعلانات أعلى المتجر',
    true,
    1,
    '{"text": "Fresh Flowers Sourced Daily • Same-Day Delivery • Premium Quality • Beautifully Wrapped", "text_ar": "زهور نضرة يتم استيرادها يومياً • توصيل في نفس اليوم • جودة فاخرة • تغليف راقٍ ومميز"}'::jsonb
  ),
  (
    'e1000000-0000-0000-0000-000000000002',
    'hero_banner',
    'Main Hero Slider',
    'واجهة البانر الرئيسي',
    'Homepage top visual hero slides',
    'شرائح العرض البصري الرئيسية',
    true,
    2,
    '{"heading": "Handcrafted Floral Arrangements", "heading_ar": "تنسيقات زهور طبيعية منسقة يدوياً", "subheading": "Sourced daily for life''s most memorable moments", "subheading_ar": "مستوردة يومياً لتخليد أجمل لحظات العمر"}'::jsonb
  ),
  (
    'e1000000-0000-0000-0000-000000000003',
    'feature_bar',
    'Value Proposition Bar',
    'شريط مزايا وخدمات بيربل',
    'Guarantees & features bar',
    'شريط الضمانات والمزايا',
    true,
    3,
    '{"features": ["Same Day Delivery", "Fresh Daily Guarantee", "Bespoke Gift Wrapping"], "features_ar": ["توصيل بنفس اليوم", "ضمان النضارة اليومية", "تغليف هدايا راقٍ ومميز"]}'::jsonb
  )
ON CONFLICT (section_key) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  subtitle = EXCLUDED.subtitle,
  subtitle_ar = EXCLUDED.subtitle_ar,
  is_visible = EXCLUDED.is_visible,
  sort_order = EXCLUDED.sort_order,
  content_json = EXCLUDED.content_json,
  updated_at = NOW();

-- 8. MEDIA ASSETS SEED
INSERT INTO public.media_assets (public_id, url, width, height, format, folder, alt_text, alt_text_ar)
VALUES
  ('burble/product_blush_bouquet', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455198/burble/product_blush_bouquet.jpg', 1024, 1024, 'jpg', 'burble', 'Blush Elegance Bouquet', 'باقة بلش الأنيقة من الورد الجوري الوردي'),
  ('burble/product_red_roses', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455263/burble/product_red_roses.jpg', 1024, 1024, 'jpg', 'burble', 'Red Love Bouquet', 'باقة عشق الجوري الأحمر المخملي الفاخر'),
  ('burble/product_pastel_bouquet', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455264/burble/product_pastel_bouquet.jpg', 1024, 1024, 'jpg', 'burble', 'Pastel Dream Bouquet', 'باقة حلم الباستيل من الزهور الهادئة'),
  ('burble/product_white_lily', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455265/burble/product_white_lily.jpg', 1024, 1024, 'jpg', 'burble', 'White Lily Bouquet', 'باقة الزنبق الأبيض الفواح والراقي'),
  ('burble/product_sunshine_bouquet', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455266/burble/product_sunshine_bouquet.jpg', 1024, 1024, 'jpg', 'burble', 'Sunshine Mixed Bouquet', 'باقة إشراقة الشمس من دوار الشمس الذهبي'),
  ('burble/premium_banner', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455268/burble/premium_banner.jpg', 1376, 768, 'jpg', 'burble', 'Premium Collection Banner', 'بانر التشكيلة الملكية الفاخرة'),
  ('burble/hero_desktop', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455269/burble/hero_desktop.jpg', 1376, 768, 'jpg', 'burble', 'Main Hero Banner Desktop', 'بانر الواجهة الرئيسية لمتجر زهور بيربل'),
  ('burble/hero_slide_two', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455271/burble/hero_slide_two.jpg', 1376, 768, 'jpg', 'burble', 'Hero Slide Two', 'الشريحة الثانية للواجهة الرئيسية'),
  ('burble/delivery_banner', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455272/burble/delivery_banner.jpg', 1376, 768, 'jpg', 'burble', 'Same Day Delivery Banner', 'بانر التوصيل السريع في نفس اليوم بقطر'),
  ('burble/hero_mobile', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455274/burble/hero_mobile.jpg', 768, 1376, 'jpg', 'burble', 'Hero Mobile Banner', 'بانر الجوال للواجهة الرئيسية'),
  ('burble/hero_mobile_v2', 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455275/burble/hero_mobile_v2.jpg', 768, 1376, 'jpg', 'burble', 'Hero Mobile Banner V2', 'بانر الجوال الجديد لمتجر بيربل')
ON CONFLICT (public_id) DO UPDATE SET
  url = EXCLUDED.url,
  width = EXCLUDED.width,
  height = EXCLUDED.height,
  format = EXCLUDED.format,
  folder = EXCLUDED.folder,
  alt_text = EXCLUDED.alt_text,
  alt_text_ar = EXCLUDED.alt_text_ar;
