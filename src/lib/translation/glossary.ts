/**
 * Specialized Floristry & Gifting Domain Glossary for Burble Flowers Qatar.
 * Maps English commercial floral terminology to elegant, natural Modern Standard Arabic.
 */
export const FLORISTRY_GLOSSARY: Record<string, string> = {
  // Brand
  'burble': 'بيربل',
  'burble flowers': 'زهور بيربل',
  'burble florist': 'منسق زهور بيربل',
  'burble stylist': 'مصمم بيربل',
  'master florist': 'خبير تنسيق الزهور',

  // Flower Varieties
  'roses': 'جوري',
  'rose': 'وردة جوري',
  'red roses': 'جوري أحمر',
  'pink roses': 'جوري وردي',
  'yellow roses': 'جوري أصفر',
  'white roses': 'جوري أبيض',
  'garden roses': 'جوري الحديقة الفاخر',
  'spray roses': 'بيبي جوري (جوري ميني)',
  'velvet roses': 'جوري مخملي داكن',
  'tulips': 'توليب',
  'tulip': 'توليب',
  'lilies': 'زنبق (ليلي)',
  'lily': 'زنبق',
  'white lilies': 'زنبق أبيض ناصع',
  'white lily': 'زنبق أبيض',
  'peonies': 'فاونيا (بيوني)',
  'peony': 'فاونيا',
  'blush peonies': 'فاونيا وردية ناعمة',
  'carnations': 'قرنفل',
  'carnation': 'قرنفل',
  'orchids': 'أوركيد',
  'orchid': 'أوركيد',
  'phalaenopsis': 'أوركيد الفالينوبسيس الملكي',
  'hydrangeas': 'هيدرانجيا',
  'hydrangea': 'هيدرانجيا',
  'sunflowers': 'دوار الشمس الذهبي',
  'sunflower': 'دوار الشمس',
  'ranunculus': 'حوذان (رانينكولس)',
  'lisianthus': 'ليزانثس ناعم',
  'eucalyptus': 'أوراق الكينا (الكافور)',
  'chrysanthemums': 'أقحوان',
  'mixed flowers': 'زهور مشكلة',
  'seasonal blooms': 'زهور موسمية نضرة',

  // Arrangements & Categories
  'hand bouquets': 'باقات يد فاخرة',
  'hand bouquet': 'باقة يد فاخرة',
  'bouquet': 'باقة ورد',
  'flowers in vase': 'زهور في فازة',
  'vase': 'فازة',
  'premium collections': 'التشكيلة الفاخرة',
  'gift hampers': 'صناديق الهدايا والتوزيعات',
  'combos': 'الباقات المدمجة',
  'diy flowers': 'التنسيق المنزلي (DIY)',
  'flower subscription': 'اشتراك الزهور الدوري',
  'best sellers': 'الأكثر مبيعاً',
  'luxury collection': 'المجموعة الفاخرة',
  'birthday collection': 'مجموعة أعياد الميلاد',
  'romantic collection': 'المجموعة الرومانسية',
  'elegant whites': 'البياض الملكي',
  'colorful blooms': 'ألوان البهجة',

  // Occasions
  'birthday': 'أعياد الميلاد',
  'anniversary': 'الذكرى السنوية',
  'love & romance': 'حب ورومانسية',
  'graduation': 'التخرج والنجاح',
  'get well soon': 'سلامتك وشفاء عاجل',
  'thank you': 'شكر وتقدير',
  'love you': 'محبة وامتنان',
  'congratulations': 'تهاني ومباركات',
  'new baby': 'مواليد جدد',
  'wedding': 'أفراح ومناسبات',

  // Packaging & Presentation
  'crystal vase': 'فازة كريستال فاخرة',
  'ceramic vase': 'فازة سيراميك أنيقة',
  'ribbon': 'شريط ستان راقٍ',
  'satin ribbon': 'شريط ستان حريري',
  'kraft paper': 'ورق كرافت صديق للبيئة',
  'luxury wrapping': 'تغليف فاخر ومميز',
  'belgian chocolates': 'شوكولاتة بلجيكية فاخرة',
  'scented candles': 'شموع معطرة راقية',

  // Delivery & Service
  'same-day delivery': 'توصيل في نفس اليوم',
  'same day delivery': 'توصيل في نفس اليوم',
  'free delivery': 'توصيل مجاني',
  'express delivery': 'توصيل سريع',
  'handcrafted': 'منسقة يدوياً',
  'sourced daily': 'مستوردة وطازجة يومياً',
  'fresh flowers': 'زهور طبيعية نضرة',
  'cash on delivery': 'الدفع عند الاستلام',
};

/**
 * Common product and marketing translations table for catalog products
 */
export const CATALOG_TRANSLATION_TABLE: Record<string, {
  name_ar: string;
  description_ar: string;
  short_description_ar?: string;
}> = {
  'Blush Elegance Bouquet': {
    name_ar: 'باقة بلش الأنيقة',
    description_ar: 'باقة يد ساحرة منسقة بعناية من ورود جوري الحديقة الوردية الناعمة والبيبي جوري مع أوراق الكينا العطرة، مغلفة بأوراق كريمية فاخرة.',
    short_description_ar: 'ورود جوري وردية ناعمة مع أوراق الكينا العطرة بتغليف كريمي أنيق.',
  },
  'Red Love Bouquet': {
    name_ar: 'باقة عشق الجوري الأحمر',
    description_ar: 'تنسيق كلاسيكي آسر من أفخر ورود الجوري المخملي الأحمر الداكن، مغلفة بأناقة في ورق أسود فاخر مع شريط ستان حريري.',
    short_description_ar: 'جوري أحمر مخملي داكن بتغليف أسود ملكي وشريط ستان.',
  },
  'Pastel Dream Bouquet': {
    name_ar: 'باقة حلم الباستيل',
    description_ar: 'مزيج حالم وفاتن يجمع بين الجوري الخوخي الناعم، زهور الحوذان الكريمية والليزانثس البنفسجي، مغلفة بأوراق اللافندر الراقية.',
    short_description_ar: 'تناغم ألوان الباستيل الهادئة بين الجوري الخوخي والليزانثس البنفسجي.',
  },
  'White Lily Bouquet': {
    name_ar: 'باقة الزنبق الأبيض الملكي',
    description_ar: 'زهور الزنبق الأبيض (الليلي) الفواحة مع زهور البيبي جوري البيضاء وأغصان الخضرة النضرة، بتغليف أنيق بدرجات الأخضر المريمي.',
    short_description_ar: 'زنبق أبيض ناصع فواح متناغم مع البيبي جوري الأبيض وخضرة نضرة.',
  },
  'Sunshine Mixed Bouquet': {
    name_ar: 'باقة إشراقة الشمس المشكلة',
    description_ar: 'تنسيق مبهج ونابض بالحياة يضم دوار الشمس الذهبي والورود الصفراء مع زهور الأقحوان المتألقة في تغليف كرافت راقٍ وصديق للبيئة.',
    short_description_ar: 'دوار الشمس الذهبي مع الجوري الأصفر في تغليف كرافت طبيعي.',
  },
  'Classic Red Roses Vase': {
    name_ar: 'فازة الجوري الأحمر الكلاسيكية',
    description_ar: 'أفخم ورود الجوري الأحمر طويل الساق منسقة بحرفية في فازة كريستال نقية وفاخرة تضفي بهاءً على أي مساحة.',
    short_description_ar: 'ورود جوري أحمر طويل الساق في فازة كريستال نقية.',
  },
  'Mixed Floral Vase': {
    name_ar: 'فازة الحديقة الزهرية المشكلة',
    description_ar: 'تنسيق زهور موسمية غني بألوان الطبيعة المبهجة، مقدم في فازة سيراميك مصنوعة ومزخرفة يدوياً.',
    short_description_ar: 'زهور موسمية مبهجة منسقة في فازة سيراميك يدوية الصنع.',
  },
  'Elegant White Vase': {
    name_ar: 'فازة البياض الملكي الفاخرة',
    description_ar: 'زهور الزنبق الأبيض الناصع مع ورود الجوري الأبيض في فازة سيراميك بيضاء مضلعة تعكس أعلى معايير النقاء والرقي.',
    short_description_ar: 'زنبق أبيض وجوري في فازة سيراميك بيضاء أنيقة.',
  },
};
