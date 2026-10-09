import { getLocalizedValue, formatPrice, formatDate } from '../src/lib/i18n/utils';
import { getDirectionForLocale, isValidLocale } from '../src/lib/i18n/config';
import { translateTextServer, generateProductArabicFields } from '../src/lib/translation/service';
import { en } from '../src/lib/i18n/translations/en';
import { ar } from '../src/lib/i18n/translations/ar';



async function runLocalizationTests() {
  console.log('🌸 ===================================== 🌸');
  console.log('   BURBLE ARABIC / RTL LOCALIZATION TEST SUITE   ');
  console.log('🌸 ===================================== 🌸\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName} ${detail ? `-> ${detail}` : ''}`);
      failed++;
    }
  }

  // 1. Locale validation
  assert(isValidLocale('en'), 'Validates English locale');
  assert(isValidLocale('ar'), 'Validates Arabic locale');
  assert(!isValidLocale('fr'), 'Rejects unsupported locales');

  // 2. RTL Direction calculation
  assert(getDirectionForLocale('en') === 'ltr', 'English is LTR');
  assert(getDirectionForLocale('ar') === 'rtl', 'Arabic is RTL');

  // 3. CASE 1: Manual Arabic precedence
  const manualAr = getLocalizedValue({
    locale: 'ar',
    english: 'Premium Rose Bouquet',
    arabic: 'باقة ورود فاخرة',
  });
  assert(manualAr === 'باقة ورود فاخرة', 'CASE 1: Manual Arabic takes top priority', `Got: ${manualAr}`);

  // 4. CASE 1 (English view): Returns English
  const englishVal = getLocalizedValue({
    locale: 'en',
    english: 'Premium Rose Bouquet',
    arabic: 'باقة ورود فاخرة',
  });
  assert(englishVal === 'Premium Rose Bouquet', 'English locale displays English value', `Got: ${englishVal}`);

  // 5. CASE 2: Auto-translation when Arabic is missing or null
  const autoAr = getLocalizedValue({
    locale: 'ar',
    english: 'Red Roses Vase',
    arabic: null,
    generatedFallback: 'فازة جوري أحمر فاخرة',
  });
  assert(autoAr === 'فازة جوري أحمر فاخرة', 'CASE 2: Uses generated Arabic when manual is null', `Got: ${autoAr}`);

  // 6. CASE 3: Manual Arabic preservation when English changes
  const preservedAr = getLocalizedValue({
    locale: 'ar',
    english: 'Premium Rose Bouquet - Updated Edition 2026',
    arabic: 'باقة ورود فاخرة مخصصة',
  });
  assert(preservedAr === 'باقة ورود فاخرة مخصصة', 'CASE 3: Manual Arabic is never overwritten', `Got: ${preservedAr}`);

  // 7. CASE 4: Safe Emergency English fallback when no Arabic and translation fails
  const emergencyFallback = getLocalizedValue({
    locale: 'ar',
    english: 'Exquisite Hydrangea Mix',
    arabic: undefined,
    generatedFallback: undefined,
  });
  assert(emergencyFallback === 'Exquisite Hydrangea Mix', 'CASE 4: Safe emergency fallback to English when Arabic unavailable', `Got: ${emergencyFallback}`);

  // 8. Translation Service Glossary & Domain Rules
  const translatedFlower = await translateTextServer('Pink Tulips Bouquet', 'product_name');
  assert(translatedFlower.includes('توليب') || translatedFlower.includes('زهور'), 'Translation service accurately handles flower names', `Got: ${translatedFlower}`);

  const brandName = await translateTextServer('Burble Gift Collection', 'collection_name');
  assert(brandName.includes('بيربل') || brandName.includes('بربل') || brandName.includes('Burble'), 'Brand name "Burble" is preserved / transliterated properly', `Got: ${brandName}`);

  // 9. Product Arabic generation
  const generatedFields = await generateProductArabicFields({
    name: 'Blush Elegance Bouquet',
    description: 'A delicate arrangement of premium blush roses, white hydrangeas and eucalyptus.',
    shortDescription: 'Fresh pink blooms for gifting.',
  });
  assert(Boolean(generatedFields.name_ar && generatedFields.name_ar.length > 0), 'Generates product name_ar', `Got: ${generatedFields.name_ar}`);
  assert(Boolean(generatedFields.description_ar && generatedFields.description_ar.length > 0), 'Generates product description_ar', `Got: ${generatedFields.description_ar}`);

  // 10. Price Formatting (English vs Arabic)
  const priceEn = formatPrice(250, 'en', 'QAR');
  const priceAr = formatPrice(250, 'ar', 'QAR');
  assert(priceEn === 'QAR 250.00', 'Formats English price correctly', `Got: ${priceEn}`);
  assert(priceAr.includes('250.00') && priceAr.includes('ر.ق'), 'Formats Arabic QAR currency properly', `Got: ${priceAr}`);

  // 11. Date Formatting (Locale-aware)
  const dateEn = formatDate('2026-10-08T12:00:00Z', 'en');
  const dateAr = formatDate('2026-10-08T12:00:00Z', 'ar');
  assert(dateEn.length > 0, 'Formats English date', `Got: ${dateEn}`);
  assert(dateAr.length > 0, 'Formats Arabic date', `Got: ${dateAr}`);

  // 12. Complete Dictionary Parity
  assert(Boolean(en.common.home && ar.common.home), 'Navigation home translated in both');
  assert(Boolean(en.cart.proceedToCheckout && ar.cart.proceedToCheckout), 'Cart checkout CTA translated in both');
  assert(Boolean(en.checkout.placeOrderButton && ar.checkout.placeOrderButton), 'Checkout button translated in both');
  assert(Boolean(en.admin.addProduct && ar.admin.addProduct), 'Admin add product translated in both');

  console.log('\n🌸 ===================================== 🌸');
  console.log(`   TEST RESULTS: ${passed} PASSED, ${failed} FAILED   `);
  console.log('🌸 ===================================== 🌸\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runLocalizationTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
