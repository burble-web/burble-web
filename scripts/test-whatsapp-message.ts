import { generateWhatsAppMessage, createWhatsAppOrderLink } from '../src/lib/whatsapp/message';
import { CartItem, CheckoutFormData } from '../src/types';

function runWhatsAppFormattingTests() {
  console.log('🌸 ===================================== 🌸');
  console.log('   BURBLE WHATSAPP MESSAGE FORMAT SUITE   ');
  console.log('🌸 ===================================== 🌸\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, name: string) {
    if (condition) {
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${name}`);
      failed++;
    }
  }

  const sampleFormData: CheckoutFormData = {
    customer_name: 'Fatima Al-Kuwari',
    customer_email: 'fatima@example.qa',
    customer_phone: '+974 5512 3456',
    delivery_address: 'Villa 14, Street 980, Zone 66',
    city: 'Doha',
    district: 'West Bay Lagoon',
    pincode: '00000',
    delivery_notes: 'Please ring the front gate bell. Gift card: "Happy Anniversary!"',
    payment_method: 'whatsapp',
    locale: 'en',
  };

  const item1: CartItem = {
    product: {
      id: 'p-1',
      name: 'Royal Velvet Rose Bouquet',
      name_ar: 'باقة الورد المخملي الملكي',
      slug: 'royal-velvet-rose-bouquet',
      price: 350.0,
      stock_status: 'in_stock',
      active: true,
      main_image_url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      is_featured: true,
      is_new_arrival: false,
      sort_order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      category: {
        id: 'c-1',
        name: 'Hand Bouquets',
        name_ar: 'باقات اليد',
        slug: 'hand-bouquets',
        sort_order: 1,
        active: true,
        created_at: new Date().toISOString(),
      },
    },
    quantity: 1,
  };

  const item2: CartItem = {
    product: {
      id: 'p-2',
      name: 'Spring Tulip Symphony in Vase',
      name_ar: 'سيمفونية التيوليب الربيعي في فازة',
      slug: 'spring-tulip-symphony-in-vase',
      price: 220.0,
      stock_status: 'in_stock',
      active: true,
      main_image_url: 'https://res.cloudinary.com/demo/image/upload/sample2.jpg',
      is_featured: false,
      is_new_arrival: true,
      sort_order: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      category: {
        id: 'c-2',
        name: 'Flowers in Vase',
        name_ar: 'زهور في فازة',
        slug: 'flowers-in-vase',
        sort_order: 2,
        active: true,
        created_at: new Date().toISOString(),
      },
    },
    quantity: 2,
  };

  // Test 1: Single Item English Message
  const singleEnMsg = generateWhatsAppMessage({
    whatsappNumber: '+974 5500 1234',
    orderNumber: 'BURBLE-20261009-1001',
    formData: sampleFormData,
    items: [item1],
    subtotal: 350.0,
    shippingFee: 0.0,
    totalAmount: 350.0,
    currencySymbol: 'QAR',
    locale: 'en',
    siteUrl: 'https://burbleflowers.com',
  });

  assert(singleEnMsg.includes('*Order Reference:* #BURBLE-20261009-1001'), 'Single Item EN: Order reference matches');
  assert(singleEnMsg.includes('1. *Royal Velvet Rose Bouquet*'), 'Single Item EN: Product name included');
  assert(singleEnMsg.includes('• Category: Hand Bouquets'), 'Single Item EN: Category included');
  assert(singleEnMsg.includes('• Price: QAR 350.00 × 1'), 'Single Item EN: Unit price formatted with QAR');
  assert(singleEnMsg.includes('• Delivery Fee: FREE'), 'Single Item EN: Free delivery indicated when 0');
  assert(singleEnMsg.includes('• *Grand Total:* QAR 350.00'), 'Single Item EN: Grand total formatted with QAR');
  assert(singleEnMsg.includes('• Name: Fatima Al-Kuwari'), 'Single Item EN: Customer name included');
  assert(singleEnMsg.includes('https://burbleflowers.com/products/royal-velvet-rose-bouquet'), 'Single Item EN: Product URL link included');

  // Test 2: Multi-Item English Message
  const multiEnMsg = generateWhatsAppMessage({
    whatsappNumber: '+974 5500 1234',
    orderNumber: 'BURBLE-20261009-1002',
    formData: sampleFormData,
    items: [item1, item2],
    subtotal: 790.0,
    shippingFee: 0.0,
    totalAmount: 790.0,
    currencySymbol: 'QAR',
    locale: 'en',
    siteUrl: 'https://burbleflowers.com',
  });

  assert(multiEnMsg.includes('1. *Royal Velvet Rose Bouquet*'), 'Multi-Item EN: First item listed');
  assert(multiEnMsg.includes('2. *Spring Tulip Symphony in Vase*'), 'Multi-Item EN: Second item listed');
  assert(multiEnMsg.includes('• Price: QAR 220.00 × 2'), 'Multi-Item EN: Multi-quantity formatted');
  assert(multiEnMsg.includes('• Line Total: QAR 440.00'), 'Multi-Item EN: Line total calculated');
  assert(multiEnMsg.includes('• Subtotal: QAR 790.00'), 'Multi-Item EN: Subtotal displayed');

  // Test 3: Multi-Item Arabic Message
  const multiArMsg = generateWhatsAppMessage({
    whatsappNumber: '+974 5500 1234',
    orderNumber: 'BURBLE-20261009-1003',
    formData: { ...sampleFormData, locale: 'ar' },
    items: [item1, item2],
    subtotal: 790.0,
    shippingFee: 25.0,
    totalAmount: 815.0,
    currencySymbol: 'QAR',
    locale: 'ar',
    siteUrl: 'https://burbleflowers.com',
  });

  assert(multiArMsg.includes('*رقم الطلب المرجعي:* #BURBLE-20261009-1003'), 'Multi-Item AR: Arabic order reference');
  assert(multiArMsg.includes('1. *باقة الورد المخملي الملكي*'), 'Multi-Item AR: Arabic product 1 name');
  assert(multiArMsg.includes('• الفئة: باقات اليد'), 'Multi-Item AR: Arabic category 1');
  assert(multiArMsg.includes('2. *سيمفونية التيوليب الربيعي في فازة*'), 'Multi-Item AR: Arabic product 2 name');
  assert(multiArMsg.includes('• الفئة: زهور في فازة'), 'Multi-Item AR: Arabic category 2');
  assert(multiArMsg.includes('• السعر: 220.00 ر.ق × 2'), 'Multi-Item AR: Arabic unit price with ر.ق');
  assert(multiArMsg.includes('• المجموع: 440.00 ر.ق'), 'Multi-Item AR: Arabic line total with ر.ق');
  assert(multiArMsg.includes('• رسوم التوصيل: 25.00 ر.ق'), 'Multi-Item AR: Arabic shipping fee formatted');
  assert(multiArMsg.includes('• *المبلغ الإجمالي:* 815.00 ر.ق'), 'Multi-Item AR: Arabic grand total formatted');
  assert(multiArMsg.includes('• الاسم: Fatima Al-Kuwari'), 'Multi-Item AR: Arabic customer name');
  assert(multiArMsg.includes('• ملاحظات التوصيل / كارت الإهداء: Please ring the front gate bell. Gift card: "Happy Anniversary!"'), 'Multi-Item AR: Delivery instructions');

  // Test 4: WA URL Generation & Sanitization
  const waUrl = createWhatsAppOrderLink({
    whatsappNumber: '+974 (5500) 1234',
    orderNumber: 'BURBLE-20261009-1004',
    formData: sampleFormData,
    items: [item1],
    subtotal: 350.0,
    shippingFee: 0.0,
    totalAmount: 350.0,
    currencySymbol: 'QAR',
    locale: 'en',
  });

  assert(waUrl.startsWith('https://api.whatsapp.com/send?phone=97455001234&text='), 'WA URL: Uses api.whatsapp.com/send and sanitizes phone number');
  assert(!waUrl.includes('wa.me'), 'WA URL: Does not use wa.me');
  assert(waUrl.includes(encodeURIComponent('*Order Reference:* #BURBLE-20261009-1004')), 'WA URL: Properly URL-encodes message content');

  console.log('\n🌸 ===================================== 🌸');
  console.log(`   TEST RESULTS: ${passed} PASSED, ${failed} FAILED   `);
  console.log('🌸 ===================================== 🌸\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runWhatsAppFormattingTests();
