-- ============================================================
-- ARABIC CONTENT SEED: 20261009_arabic_content_seed.sql
-- DESCRIPTION: Non-destructive update script populating Arabic
--              translations for existing catalog records.
--
-- SAFETY RULES:
-- 1. Matches records by stable slugs, public_ids, or section_keys.
-- 2. Uses COALESCE / NULLIF to strictly PRESERVE any existing
--    manually entered Arabic translations.
-- 3. NEVER overwrites English fields, prices, images, stock status,
--    or admin configurations.
-- 4. Must be executed AFTER 20261009_arabic_localization.sql.
-- ============================================================

BEGIN;

-- ============================================================
-- 1. SITE SETTINGS (Singleton id = 1)
-- ============================================================
UPDATE public.site_settings
SET
  store_name_ar = COALESCE(NULLIF(TRIM(store_name_ar), ''), 'بيربل'),
  tagline_ar = COALESCE(NULLIF(TRIM(tagline_ar), ''), 'الزهور تضفي سحراً على أجمل اللحظات'),
  currency_symbol_ar = COALESCE(NULLIF(TRIM(currency_symbol_ar), ''), 'ر.ق'),
  announcement_text_ar = COALESCE(NULLIF(TRIM(announcement_text_ar), ''), 'زهور نضرة يتم استيرادها يومياً • توصيل في نفس اليوم • جودة فاخرة • تغليف راقٍ ومميز')
WHERE id = 1;

-- ============================================================
-- 2. CATEGORIES
-- ============================================================
UPDATE public.categories
SET
  name_ar = COALESCE(NULLIF(TRIM(name_ar), ''), 'باقات يد فاخرة'),
  description_ar = COALESCE(NULLIF(TRIM(description_ar), ''), 'باقات زهور طبيعية نضرة منسقة يدوياً ومغلفة بأرقى أوراق التغليف الفاخرة.')
WHERE slug = 'hand-bouquets';

UPDATE public.categories
SET
  name_ar = COALESCE(NULLIF(TRIM(name_ar), ''), 'زهور في فازة'),
  description_ar = COALESCE(NULLIF(TRIM(description_ar), ''), 'تنسيقات زهرية استثنائية معروضة في فازات كريستالية وسيراميك راقية.')
WHERE slug = 'flowers-in-vase';

UPDATE public.categories
SET
  name_ar = COALESCE(NULLIF(TRIM(name_ar), ''), 'التشكيلة الفاخرة'),
  description_ar = COALESCE(NULLIF(TRIM(description_ar), ''), 'تنسيقات زهور حصرية واستثنائية تضم ورود الإكوادور النادرة والزهور الهولندية الفاخرة.')
WHERE slug = 'premium-collections';

UPDATE public.categories
SET
  name_ar = COALESCE(NULLIF(TRIM(name_ar), ''), 'صناديق الهدايا والتوزيعات'),
  description_ar = COALESCE(NULLIF(TRIM(description_ar), ''), 'مجموعات هدايا راقية تجمع بين الشوكولاتة البلجيكية، الشموع المعطرة والزهور النضرة.')
WHERE slug = 'gift-hampers';

UPDATE public.categories
SET
  name_ar = COALESCE(NULLIF(TRIM(name_ar), ''), 'الباقات المدمجة'),
  description_ar = COALESCE(NULLIF(TRIM(description_ar), ''), 'توليفات مثالية تجمع بين باقاتنا المميزة مع الكيك الفاخر وبالونات الهيليوم.')
WHERE slug = 'combos';

UPDATE public.categories
SET
  name_ar = COALESCE(NULLIF(TRIM(name_ar), ''), 'التنسيق المنزلي (DIY)'),
  description_ar = COALESCE(NULLIF(TRIM(description_ar), ''), 'حزم سيقان زهور منفردة للإبداع والتنسيق المنزلي وورش العمل.')
WHERE slug = 'diy-flowers';

-- ============================================================
-- 3. COLLECTIONS & OCCASIONS
-- ============================================================
-- Occasions
UPDATE public.collections
SET
  title_ar = COALESCE(NULLIF(TRIM(title_ar), ''), 'أعياد الميلاد'),
  subtitle_ar = COALESCE(NULLIF(TRIM(subtitle_ar), ''), 'احتفل بأعياد الميلاد بأبهى باقات الزهور النضرة والمبهجة.')
WHERE slug = 'birthday';

UPDATE public.collections
SET
  title_ar = COALESCE(NULLIF(TRIM(title_ar), ''), 'الذكرى السنوية'),
  subtitle_ar = COALESCE(NULLIF(TRIM(subtitle_ar), ''), 'عبّر عن أسمى مشاعر المحبة بجمال الجوري الأحمر المخملي.')
WHERE slug = 'anniversary';

UPDATE public.collections
SET
  title_ar = COALESCE(NULLIF(TRIM(title_ar), ''), 'حب ورومانسية'),
  subtitle_ar = COALESCE(NULLIF(TRIM(subtitle_ar), ''), 'تنسيقات مفعمة بالشغف صُممت لتخليد اللحظات الرومانسية.')
WHERE slug = 'love-romance';

UPDATE public.collections
SET
  title_ar = COALESCE(NULLIF(TRIM(title_ar), ''), 'التخرج والنجاح'),
  subtitle_ar = COALESCE(NULLIF(TRIM(subtitle_ar), ''), 'كافئ النجاح والإنجاز بباقات احتفالية مشرقة تليق بالفرحة.')
WHERE slug = 'graduation';

UPDATE public.collections
SET
  title_ar = COALESCE(NULLIF(TRIM(title_ar), ''), 'سلامتك وشفاء عاجل'),
  subtitle_ar = COALESCE(NULLIF(TRIM(subtitle_ar), ''), 'انشر التفاؤل وأمنيات الشفاء بألوان الباستيل الزهرية الهادئة.')
WHERE slug = 'get-well-soon';

UPDATE public.collections
SET
  title_ar = COALESCE(NULLIF(TRIM(title_ar), ''), 'شكر وتقدير'),
  subtitle_ar = COALESCE(NULLIF(TRIM(subtitle_ar), ''), 'عبّر عن الامتنان والتقدير بأرقى باقات الزهور الملكية.')
WHERE slug = 'thank-you';

UPDATE public.collections
SET
  title_ar = COALESCE(NULLIF(TRIM(title_ar), ''), 'محبة وامتنان'),
  subtitle_ar = COALESCE(NULLIF(TRIM(subtitle_ar), ''), 'عبّر عن محبتك الصادقة بباقات زهور كلاسيكية خالدة.')
WHERE slug = 'love-you';

-- Flower Types
UPDATE public.collections
SET
  title_ar = COALESCE(NULLIF(TRIM(title_ar), ''), 'الجوري والورد'),
  subtitle_ar = COALESCE(NULLIF(TRIM(subtitle_ar), ''), 'الجوري الكلاسيكي، المخملي، بيبي جوري وجوري الحديقة.')
WHERE slug = 'roses';

UPDATE public.collections
SET
  title_ar = COALESCE(NULLIF(TRIM(title_ar), ''), 'التوليب'),
  subtitle_ar = COALESCE(NULLIF(TRIM(subtitle_ar), ''), 'زهور التوليب الهولندية الفاخرة ذات النضارة الفائقة.')
WHERE slug = 'tulips';

UPDATE public.collections
SET
  title_ar = COALESCE(NULLIF(TRIM(title_ar), ''), 'الزنبق (الليلي)'),
  subtitle_ar = COALESCE(NULLIF(TRIM(subtitle_ar), ''), 'زهور الزنبق الأبيض الفواحة وزنبق الستارجايزر الشرقي.')
WHERE slug = 'lilies';

UPDATE public.collections
SET
  title_ar = COALESCE(NULLIF(TRIM(title_ar), ''), 'الفاونيا (البيوني)'),
  subtitle_ar = COALESCE(NULLIF(TRIM(subtitle_ar), ''), 'زهور الفاونيا الوردية والبيضاء الغنية بالبتلات الفاخرة.')
WHERE slug = 'peonies';

UPDATE public.collections
SET
  title_ar = COALESCE(NULLIF(TRIM(title_ar), ''), 'القرنفل'),
  subtitle_ar = COALESCE(NULLIF(TRIM(subtitle_ar), ''), 'زهور القرنفل المتألقة بألوانها الزاهية وتدوم طويلاً.')
WHERE slug = 'carnations';

UPDATE public.collections
SET
  title_ar = COALESCE(NULLIF(TRIM(title_ar), ''), 'الأوركيد'),
  subtitle_ar = COALESCE(NULLIF(TRIM(subtitle_ar), ''), 'زهور أوركيد الفالينوبسيس والسيمبيديوم النادرة والملكية.')
WHERE slug = 'orchids';

UPDATE public.collections
SET
  title_ar = COALESCE(NULLIF(TRIM(title_ar), ''), 'الهيدرانجيا'),
  subtitle_ar = COALESCE(NULLIF(TRIM(subtitle_ar), ''), 'زهور الهيدرانجيا الممتلئة بألوان الباستيل الساحرة.')
WHERE slug = 'hydrangeas';

UPDATE public.collections
SET
  title_ar = COALESCE(NULLIF(TRIM(title_ar), ''), 'زهور مشكلة'),
  subtitle_ar = COALESCE(NULLIF(TRIM(subtitle_ar), ''), 'توليفات زهرية موسمية منوعة تجمع أجمل أنواع الزهور.')
WHERE slug = 'mixed-flowers';

-- Curated Collections
UPDATE public.collections
SET
  title_ar = COALESCE(NULLIF(TRIM(title_ar), ''), 'الأكثر مبيعاً'),
  subtitle_ar = COALESCE(NULLIF(TRIM(subtitle_ar), ''), 'التنسيقات الأكثر طلباً ومحبة لدى عملاء بيربل.')
WHERE slug = 'best-sellers';

UPDATE public.collections
SET
  title_ar = COALESCE(NULLIF(TRIM(title_ar), ''), 'المجموعة الفاخرة'),
  subtitle_ar = COALESCE(NULLIF(TRIM(subtitle_ar), ''), 'تنسيقات زهرية ضخمة تليق بالمناسبات الكبرى.')
WHERE slug = 'luxury-collection';

UPDATE public.collections
SET
  title_ar = COALESCE(NULLIF(TRIM(title_ar), ''), 'مجموعة أعياد الميلاد'),
  subtitle_ar = COALESCE(NULLIF(TRIM(subtitle_ar), ''), 'زهور أعياد ميلاد مبهجة تشع بالفرح والسرور.')
WHERE slug = 'birthday-collection';

UPDATE public.collections
SET
  title_ar = COALESCE(NULLIF(TRIM(title_ar), ''), 'المجموعة الرومانسية'),
  subtitle_ar = COALESCE(NULLIF(TRIM(subtitle_ar), ''), 'تشكيلة الجوري الأحمر المخملي والوردي الرومانسي.')
WHERE slug = 'romantic-collection';

UPDATE public.collections
SET
  title_ar = COALESCE(NULLIF(TRIM(title_ar), ''), 'البياض الملكي'),
  subtitle_ar = COALESCE(NULLIF(TRIM(subtitle_ar), ''), 'نقاء الزنبق الأبيض، الجوري والهيدرانجيا الملكية.')
WHERE slug = 'elegant-whites';

UPDATE public.collections
SET
  title_ar = COALESCE(NULLIF(TRIM(title_ar), ''), 'ألوان البهجة'),
  subtitle_ar = COALESCE(NULLIF(TRIM(subtitle_ar), ''), 'زهور احتفالية متعددة الألوان تضفي بهجة استثنائية.')
WHERE slug = 'colorful-blooms';

-- ============================================================
-- 4. PRODUCTS
-- ============================================================
UPDATE public.products
SET
  name_ar = COALESCE(NULLIF(TRIM(name_ar), ''), 'باقة بلش الأنيقة'),
  description_ar = COALESCE(NULLIF(TRIM(description_ar), ''), 'باقة يد ساحرة منسقة بعناية من ورود جوري الحديقة الوردية الناعمة والبيبي جوري مع أوراق الكينا العطرة، مغلفة بأوراق كريمية فاخرة.'),
  short_description_ar = COALESCE(NULLIF(TRIM(short_description_ar), ''), 'ورود جوري وردية ناعمة مع أوراق الكينا العطرة بتغليف كريمي أنيق.'),
  arabic_translation_source = COALESCE(NULLIF(TRIM(arabic_translation_source), ''), 'manual')
WHERE slug = 'blush-elegance-bouquet';

UPDATE public.products
SET
  name_ar = COALESCE(NULLIF(TRIM(name_ar), ''), 'باقة عشق الجوري الأحمر'),
  description_ar = COALESCE(NULLIF(TRIM(description_ar), ''), 'تنسيق كلاسيكي آسر من أفخر ورود الجوري المخملي الأحمر الداكن، مغلفة بأناقة في ورق أسود فاخر مع شريط ستان حريري.'),
  short_description_ar = COALESCE(NULLIF(TRIM(short_description_ar), ''), 'جوري أحمر مخملي داكن بتغليف أسود ملكي وشريط ستان.'),
  arabic_translation_source = COALESCE(NULLIF(TRIM(arabic_translation_source), ''), 'manual')
WHERE slug = 'red-love-bouquet';

UPDATE public.products
SET
  name_ar = COALESCE(NULLIF(TRIM(name_ar), ''), 'باقة حلم الباستيل'),
  description_ar = COALESCE(NULLIF(TRIM(description_ar), ''), 'مزيج حالم وفاتن يجمع بين الجوري الخوخي الناعم، زهور الحوذان الكريمية والليزانثس البنفسجي، مغلفة بأوراق اللافندر الراقية.'),
  short_description_ar = COALESCE(NULLIF(TRIM(short_description_ar), ''), 'تناغم ألوان الباستيل الهادئة بين الجوري الخوخي والليزانثس البنفسجي.'),
  arabic_translation_source = COALESCE(NULLIF(TRIM(arabic_translation_source), ''), 'manual')
WHERE slug = 'pastel-dream-bouquet';

UPDATE public.products
SET
  name_ar = COALESCE(NULLIF(TRIM(name_ar), ''), 'باقة الزنبق الأبيض الملكي'),
  description_ar = COALESCE(NULLIF(TRIM(description_ar), ''), 'زهور الزنبق الأبيض (الليلي) الفواحة مع زهور البيبي جوري البيضاء وأغصان الخضرة النضرة، بتغليف أنيق بدرجات الأخضر المريمي.'),
  short_description_ar = COALESCE(NULLIF(TRIM(short_description_ar), ''), 'زنبق أبيض ناصع فواح متناغم مع البيبي جوري الأبيض وخضرة نضرة.'),
  arabic_translation_source = COALESCE(NULLIF(TRIM(arabic_translation_source), ''), 'manual')
WHERE slug = 'white-lily-bouquet';

UPDATE public.products
SET
  name_ar = COALESCE(NULLIF(TRIM(name_ar), ''), 'باقة إشراقة الشمس المشكلة'),
  description_ar = COALESCE(NULLIF(TRIM(description_ar), ''), 'تنسيق مبهج ونابض بالحياة يضم دوار الشمس الذهبي والورود الصفراء مع زهور الأقحوان المتألقة في تغليف كرافت راقٍ وصديق للبيئة.'),
  short_description_ar = COALESCE(NULLIF(TRIM(short_description_ar), ''), 'دوار الشمس الذهبي مع الجوري الأصفر في تغليف كرافت طبيعي.'),
  arabic_translation_source = COALESCE(NULLIF(TRIM(arabic_translation_source), ''), 'manual')
WHERE slug = 'sunshine-mixed-bouquet';

UPDATE public.products
SET
  name_ar = COALESCE(NULLIF(TRIM(name_ar), ''), 'فازة الجوري الأحمر الكلاسيكية'),
  description_ar = COALESCE(NULLIF(TRIM(description_ar), ''), 'أفخم ورود الجوري الأحمر طويل الساق منسقة بحرفية في فازة كريستال نقية وفاخرة تضفي بهاءً على أي مساحة.'),
  short_description_ar = COALESCE(NULLIF(TRIM(short_description_ar), ''), 'ورود جوري أحمر طويل الساق في فازة كريستال نقية.'),
  arabic_translation_source = COALESCE(NULLIF(TRIM(arabic_translation_source), ''), 'manual')
WHERE slug = 'classic-red-roses-vase';

UPDATE public.products
SET
  name_ar = COALESCE(NULLIF(TRIM(name_ar), ''), 'فازة الحديقة الزهرية المشكلة'),
  description_ar = COALESCE(NULLIF(TRIM(description_ar), ''), 'تنسيق زهور موسمية غني بألوان الطبيعة المبهجة، مقدم في فازة سيراميك مصنوعة ومزخرفة يدوياً.'),
  short_description_ar = COALESCE(NULLIF(TRIM(short_description_ar), ''), 'زهور موسمية مبهجة منسقة في فازة سيراميك يدوية الصنع.'),
  arabic_translation_source = COALESCE(NULLIF(TRIM(arabic_translation_source), ''), 'manual')
WHERE slug = 'mixed-floral-vase';

UPDATE public.products
SET
  name_ar = COALESCE(NULLIF(TRIM(name_ar), ''), 'فازة البياض الملكي الفاخرة'),
  description_ar = COALESCE(NULLIF(TRIM(description_ar), ''), 'زهور الزنبق الأبيض الناصع مع ورود الجوري الأبيض في فازة سيراميك بيضاء مضلعة تعكس أعلى معايير النقاء والرقي.'),
  short_description_ar = COALESCE(NULLIF(TRIM(short_description_ar), ''), 'زنبق أبيض وجوري في فازة سيراميك بيضاء أنيقة.'),
  arabic_translation_source = COALESCE(NULLIF(TRIM(arabic_translation_source), ''), 'manual')
WHERE slug = 'elegant-white-vase';

-- ============================================================
-- 5. BLOG POSTS
-- ============================================================
UPDATE public.blog_posts
SET
  title_ar = COALESCE(NULLIF(TRIM(title_ar), ''), 'معاني ودلالات ألوان وأنواع الزهور المختلفة'),
  excerpt_ar = COALESCE(NULLIF(TRIM(excerpt_ar), ''), 'اكتشف ما ترمز إليه ورود الجوري الأحمر، الفاونيا الوردية وزهور الزنبق الأبيض عند إهدائها لأحبائك.'),
  content_ar = COALESCE(NULLIF(TRIM(content_ar), ''), 'تحمل الزهور دلالات رومانسية وثقافية عميقة عبر العصور. فالجوري الأحمر يعبر عن الحب الصادق والشغف، بينما يجسد الزنبق الأبيض النقاء والأناقة الملكية.'),
  author_ar = COALESCE(NULLIF(TRIM(author_ar), ''), 'منسق زهور بيربل')
WHERE slug = 'meaning-behind-different-flowers';

UPDATE public.blog_posts
SET
  title_ar = COALESCE(NULLIF(TRIM(title_ar), ''), 'كيف تحافظ على نضارة باقة الزهور لفترة أطول في المنزل'),
  excerpt_ar = COALESCE(NULLIF(TRIM(excerpt_ar), ''), 'نصائح وإرشادات بسيطة من خبراء بيربل لإطالة عمر باقات الزهور الطبيعية داخل منزلك.'),
  content_ar = COALESCE(NULLIF(TRIM(content_ar), ''), 'قم بقص أطراف السيقان بزاوية 45 درجة تحت ماء فاتر كل يومين، واحرص على تغيير الماء يومياً وإبعاد الباقة عن أشعة الشمس المباشرة ومصادر الحرارة.'),
  author_ar = COALESCE(NULLIF(TRIM(author_ar), ''), 'خبير تنسيق الزهور')
WHERE slug = 'keep-flowers-fresh-longer';

UPDATE public.blog_posts
SET
  title_ar = COALESCE(NULLIF(TRIM(title_ar), ''), 'الدليل الشامل لاختيار الزهور المثالية لكل مناسبة'),
  excerpt_ar = COALESCE(NULLIF(TRIM(excerpt_ar), ''), 'دليل منسق بعناية لمساعدتك في اختيار أجمل الباقات لأعياد الميلاد، الذكرى السنوية واللحظات السعيدة.'),
  content_ar = COALESCE(NULLIF(TRIM(content_ar), ''), 'سواء كنت تحتفل بذكرى زواج مميزة أو ترغب في التعبير عن جزيل الشكر والامتنان، فإن اختيار التنسيق الزهري المناسب يضفي سحراً لا يُنسى على كل لحظة.'),
  author_ar = COALESCE(NULLIF(TRIM(author_ar), ''), 'مصمم بيربل')
WHERE slug = 'perfect-flowers-for-every-occasion';

-- ============================================================
-- 6. HOMEPAGE SECTIONS (CMS Layout)
-- ============================================================
UPDATE public.homepage_sections
SET
  title_ar = COALESCE(NULLIF(TRIM(title_ar), ''), 'شريط الإعلانات العلوي'),
  subtitle_ar = COALESCE(NULLIF(TRIM(subtitle_ar), ''), 'شريط الإعلانات أعلى المتجر'),
  content_json = COALESCE(content_json, '{}'::jsonb)
    || CASE
         WHEN NOT (COALESCE(content_json, '{}'::jsonb) ? 'text_ar')
              OR TRIM(COALESCE(content_json->>'text_ar', '')) = ''
         THEN '{"text_ar": "زهور نضرة يتم استيرادها يومياً • توصيل في نفس اليوم • جودة فاخرة • تغليف راقٍ ومميز"}'::jsonb
         ELSE '{}'::jsonb
       END
WHERE section_key = 'announcement_bar';

UPDATE public.homepage_sections
SET
  title_ar = COALESCE(NULLIF(TRIM(title_ar), ''), 'واجهة البانر الرئيسي'),
  subtitle_ar = COALESCE(NULLIF(TRIM(subtitle_ar), ''), 'شرائح العرض البصري الرئيسية'),
  content_json = COALESCE(content_json, '{}'::jsonb)
    || CASE
         WHEN NOT (COALESCE(content_json, '{}'::jsonb) ? 'heading_ar')
              OR TRIM(COALESCE(content_json->>'heading_ar', '')) = ''
         THEN '{"heading_ar": "تنسيقات زهور طبيعية منسقة يدوياً"}'::jsonb
         ELSE '{}'::jsonb
       END
    || CASE
         WHEN NOT (COALESCE(content_json, '{}'::jsonb) ? 'subheading_ar')
              OR TRIM(COALESCE(content_json->>'subheading_ar', '')) = ''
         THEN '{"subheading_ar": "مستوردة يومياً لتخليد أجمل لحظات العمر"}'::jsonb
         ELSE '{}'::jsonb
       END
WHERE section_key = 'hero_banner';

UPDATE public.homepage_sections
SET
  title_ar = COALESCE(NULLIF(TRIM(title_ar), ''), 'شريط مزايا وخدمات بيربل'),
  subtitle_ar = COALESCE(NULLIF(TRIM(subtitle_ar), ''), 'شريط الضمانات والمزايا'),
  content_json = COALESCE(content_json, '{}'::jsonb)
    || CASE
         WHEN NOT (COALESCE(content_json, '{}'::jsonb) ? 'features_ar')
         THEN '{"features_ar": ["توصيل بنفس اليوم", "ضمان النضارة اليومية", "تغليف هدايا راقٍ ومميز"]}'::jsonb
         ELSE '{}'::jsonb
       END
WHERE section_key = 'feature_bar';

-- ============================================================
-- 7. MEDIA ASSETS (Cloudinary Asset Alt Text)
-- ============================================================
UPDATE public.media_assets
SET alt_text_ar = COALESCE(NULLIF(TRIM(alt_text_ar), ''), 'باقة بلش الأنيقة من الورد الجوري الوردي')
WHERE public_id = 'burble/product_blush_bouquet';

UPDATE public.media_assets
SET alt_text_ar = COALESCE(NULLIF(TRIM(alt_text_ar), ''), 'باقة عشق الجوري الأحمر المخملي الفاخر')
WHERE public_id = 'burble/product_red_roses';

UPDATE public.media_assets
SET alt_text_ar = COALESCE(NULLIF(TRIM(alt_text_ar), ''), 'باقة حلم الباستيل من الزهور الهادئة')
WHERE public_id = 'burble/product_pastel_bouquet';

UPDATE public.media_assets
SET alt_text_ar = COALESCE(NULLIF(TRIM(alt_text_ar), ''), 'باقة الزنبق الأبيض الفواح والراقي')
WHERE public_id = 'burble/product_white_lily';

UPDATE public.media_assets
SET alt_text_ar = COALESCE(NULLIF(TRIM(alt_text_ar), ''), 'باقة إشراقة الشمس من دوار الشمس الذهبي')
WHERE public_id = 'burble/product_sunshine_bouquet';

UPDATE public.media_assets
SET alt_text_ar = COALESCE(NULLIF(TRIM(alt_text_ar), ''), 'بانر التشكيلة الملكية الفاخرة')
WHERE public_id = 'burble/premium_banner';

UPDATE public.media_assets
SET alt_text_ar = COALESCE(NULLIF(TRIM(alt_text_ar), ''), 'بانر الواجهة الرئيسية لمتجر زهور بيربل')
WHERE public_id = 'burble/hero_desktop';

UPDATE public.media_assets
SET alt_text_ar = COALESCE(NULLIF(TRIM(alt_text_ar), ''), 'الشريحة الثانية للواجهة الرئيسية')
WHERE public_id = 'burble/hero_slide_two';

UPDATE public.media_assets
SET alt_text_ar = COALESCE(NULLIF(TRIM(alt_text_ar), ''), 'بانر التوصيل السريع في نفس اليوم بقطر')
WHERE public_id = 'burble/delivery_banner';

UPDATE public.media_assets
SET alt_text_ar = COALESCE(NULLIF(TRIM(alt_text_ar), ''), 'بانر الجوال للواجهة الرئيسية')
WHERE public_id = 'burble/hero_mobile';

UPDATE public.media_assets
SET alt_text_ar = COALESCE(NULLIF(TRIM(alt_text_ar), ''), 'بانر الجوال الجديد لمتجر بيربل')
WHERE public_id = 'burble/hero_mobile_v2';

COMMIT;
