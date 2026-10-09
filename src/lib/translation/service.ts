import { FLORISTRY_GLOSSARY, CATALOG_TRANSLATION_TABLE } from './glossary';

export type TranslationContext =
  | 'product_name'
  | 'product_description'
  | 'product_short_description'
  | 'category_name'
  | 'category_description'
  | 'collection_name'
  | 'collection_subtitle'
  | 'blog_title'
  | 'blog_excerpt'
  | 'blog_content'
  | 'homepage_heading'
  | 'homepage_subheading'
  | 'homepage_cta'
  | 'announcement'
  | 'general'
  | 'alt_text';

/**
 * Intelligent Server-Side Arabic Translation Service.
 * Respects commercial floristry standards, never crashes, and adheres to the priority system.
 */
export async function translateToArabic(
  text: string,
  context: TranslationContext = 'product_name'
): Promise<string> {
  if (!text || text.trim().length === 0) return '';
  const trimmed = text.trim();

  // 1. Direct Catalog Match
  if (context === 'product_name' && CATALOG_TRANSLATION_TABLE[trimmed]?.name_ar) {
    return CATALOG_TRANSLATION_TABLE[trimmed].name_ar;
  }
  if (context === 'product_description' && CATALOG_TRANSLATION_TABLE[trimmed]?.description_ar) {
    return CATALOG_TRANSLATION_TABLE[trimmed].description_ar;
  }

  // Check if text exists as exact key in glossary
  const lower = trimmed.toLowerCase();
  if (FLORISTRY_GLOSSARY[lower]) {
    return FLORISTRY_GLOSSARY[lower];
  }

  // 2. Check for External Translation API (Optional, if TRANSLATION_API_KEY / GEMINI_API_KEY is configured)
  const apiKey = process.env.TRANSLATION_API_KEY || process.env.GEMINI_API_KEY;
  if (apiKey && !apiKey.includes('placeholder')) {
    try {
      const prompt = `You are a professional luxury florist and e-commerce copywriter in Qatar. Translate the following English text to natural, elegant Modern Standard Arabic for a luxury flower shop named Burble (بيربل). Preserve commercial tone, elegance, and floristry conventions. Do not transliterate blindly. Output ONLY the Arabic translation without explanation or quotes.\n\nContext: ${context}\nEnglish: "${trimmed}"`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 250 },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidate && candidate.trim().length > 0) {
          return candidate.trim().replace(/^["']|["']$/g, '');
        }
      }
    } catch (err) {
      console.warn('[Translation Service] External API call failed, using domain rule fallback:', err);
    }
  }

  // 3. High-Quality Domain Rule-Based Fallback
  return fallbackDomainTranslation(trimmed, context);
}

export const translateTextServer = translateToArabic;

/**
 * Domain-specific rule-based fallback translation for florist terms and phrases.
 */
function fallbackDomainTranslation(text: string, context: TranslationContext): string {
  // Check known category names
  const catMap: Record<string, string> = {
    'hand bouquets': 'باقات يد فاخرة',
    'flowers in vase': 'زهور في فازة',
    'premium collections': 'التشكيلة الفاخرة',
    'gift hampers': 'صناديق الهدايا والتوزيعات',
    'combos': 'الباقات المدمجة',
    'diy flowers': 'التنسيق المنزلي (DIY)',
    'all products': 'كافة المنتجات',
  };
  if (catMap[text.toLowerCase()]) {
    return catMap[text.toLowerCase()];
  }

  // Check known collection & occasion titles
  const collMap: Record<string, string> = {
    'birthday': 'أعياد الميلاد',
    'anniversary': 'الذكرى السنوية',
    'love & romance': 'حب ورومانسية',
    'graduation': 'التخرج والنجاح',
    'get well soon': 'سلامتك وشفاء عاجل',
    'thank you': 'شكر وتقدير',
    'love you': 'محبة وامتنان',
    'roses': 'الجوري والورد',
    'tulips': 'التوليب',
    'lilies': 'الزنبق (الليلي)',
    'peonies': 'الفاونيا (البيوني)',
    'carnations': 'القرنفل',
    'orchids': 'الأوركيد',
    'hydrangeas': 'الهيدرانجيا',
    'mixed flowers': 'زهور مشكلة',
    'best sellers': 'الأكثر مبيعاً',
    'luxury collection': 'المجموعة الفاخرة',
    'birthday collection': 'مجموعة أعياد الميلاد',
    'romantic collection': 'المجموعة الرومانسية',
    'elegant whites': 'البياض الملكي',
    'colorful blooms': 'ألوان البهجة',
  };
  if (collMap[text.toLowerCase()]) {
    return collMap[text.toLowerCase()];
  }

  // Check known blog posts
  const blogMap: Record<string, { title: string; excerpt: string; content: string }> = {
    'The Meaning Behind Different Flowers': {
      title: 'معاني ودلالات ألوان وأنواع الزهور المختلفة',
      excerpt: 'اكتشف ما ترمز إليه ورود الجوري الأحمر، الفاونيا الوردية وزهور الزنبق الأبيض عند إهدائها لأحبائك.',
      content: 'تحمل الزهور دلالات رومانسية وثقافية عميقة عبر العصور. فالجوري الأحمر يعبر عن الحب الصادق والشغف، بينما يجسد الزنبق الأبيض النقاء والأناقة الملكية.',
    },
    'How to Keep Your Flowers Fresh Longer': {
      title: 'كيف تحافظ على نضارة باقة الزهور لفترة أطول في المنزل',
      excerpt: 'نصائح وإرشادات بسيطة من خبراء بيربل لإطالة عمر باقات الزهور الطبيعية داخل منزلك.',
      content: 'قم بقص أطراف السيقان بزاوية 45 درجة تحت ماء فاتر كل يومين، واحرص على تغيير الماء يومياً وإبعاد الباقة عن أشعة الشمس المباشرة ومصادر الحرارة.',
    },
    'Perfect Flowers for Every Occasion': {
      title: 'الدليل الشامل لاختيار الزهور المثالية لكل مناسبة',
      excerpt: 'دليل منسق بعناية لمساعدتك في اختيار أجمل الباقات لأعياد الميلاد، الذكرى السنوية واللحظات السعيدة.',
      content: 'سواء كنت تحتفل بذكرى زواج مميزة أو ترغب في التعبير عن جزيل الشكر والامتنان، فإن اختيار التنسيق الزهري المناسب يضفي سحراً لا يُنسى على كل لحظة.',
    },
  };

  if (blogMap[text]) {
    if (context === 'blog_title') return blogMap[text].title;
    if (context === 'blog_excerpt') return blogMap[text].excerpt;
    if (context === 'blog_content') return blogMap[text].content;
  }

  // Term replacement for product names
  let translated = text;
  for (const [enTerm, arTerm] of Object.entries(FLORISTRY_GLOSSARY)) {
    const regex = new RegExp(`\\b${enTerm}\\b`, 'gi');
    translated = translated.replace(regex, arTerm);
  }

  return translated !== text ? translated : text;
}

/**
 * Generates Arabic fields for a product record while strictly preserving any existing manual Arabic.
 */
export async function generateProductArabicFields({
  name,
  description,
  shortDescription,
  existingNameAr,
  existingDescriptionAr,
  existingShortDescriptionAr,
}: {
  name: string;
  description?: string | null;
  shortDescription?: string | null;
  existingNameAr?: string | null;
  existingDescriptionAr?: string | null;
  existingShortDescriptionAr?: string | null;
}): Promise<{
  name_ar: string;
  description_ar: string;
  short_description_ar: string;
  arabic_translation_source: 'manual' | 'automatic' | 'auto';
}> {
  const isManualName = Boolean(existingNameAr && existingNameAr.trim().length > 0);
  const isManualDesc = Boolean(existingDescriptionAr && existingDescriptionAr.trim().length > 0);
  const isManualShortDesc = Boolean(existingShortDescriptionAr && existingShortDescriptionAr.trim().length > 0);

  const name_ar = isManualName
    ? existingNameAr!.trim()
    : await translateToArabic(name, 'product_name');

  const description_ar = isManualDesc
    ? existingDescriptionAr!.trim()
    : description
    ? await translateToArabic(description, 'product_description')
    : 'تنسيق زهور طبيعية نضرة مُعد بعناية وحرفية بأيدي أمهر منسقي الزهور لدينا.';

  const short_description_ar = isManualShortDesc
    ? existingShortDescriptionAr!.trim()
    : shortDescription
    ? await translateToArabic(shortDescription, 'product_short_description')
    : await translateToArabic(name, 'product_short_description');

  const arabic_translation_source = isManualName || isManualDesc || isManualShortDesc ? 'manual' : 'automatic';

  return {
    name_ar,
    description_ar,
    short_description_ar,
    arabic_translation_source,
  };
}
