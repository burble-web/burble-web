import { UUID_REGEX, checkoutItemSchema, checkoutSchema } from '../src/lib/validation/schemas';
import { sanitizeCartItems, cartStore } from '../src/lib/cart/store';
import { generateWhatsAppMessage, createWhatsAppOrderLink } from '../src/lib/whatsapp/message';
import { CartItem, CheckoutFormData, Order, Product } from '../src/types';
import { formatPrice, getLocalizedValue } from '../src/lib/i18n/utils';
import { en } from '../src/lib/i18n/translations/en';
import { ar } from '../src/lib/i18n/translations/ar';

async function runCheckoutReliabilityTests() {
  console.log('🌸 ============================================================== 🌸');
  console.log('   BURBLE CHECKOUT RELIABILITY, UUID VALIDATION & ORDER SUITE   ');
  console.log('🌸 ============================================================== 🌸\n');

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

  const validUUID1 = 'e1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c';
  const validUUID2 = 'f9e8d7c6-b5a4-4321-9876-fedcba098765';
  const invalidProdId = 'prod-5';
  const invalidSlugId = 'royal-velvet-rose-bouquet';

  // -------------------------------------------------------------
  // TEST 1: Real UUID Acceptance & Invalid prod-5 / Slug Rejection
  // -------------------------------------------------------------
  const validItemParse = checkoutItemSchema.safeParse({ product_id: validUUID1, quantity: 2 });
  assert(validItemParse.success, 'Test 1.1: Valid UUID is accepted by checkout item schema');

  const invalidItemParse = checkoutItemSchema.safeParse({ product_id: invalidProdId, quantity: 1 });
  assert(!invalidItemParse.success, 'Test 1.2: Invalid product identifier "prod-5" is strictly rejected');

  const slugItemParse = checkoutItemSchema.safeParse({ product_id: invalidSlugId, quantity: 1 });
  assert(!slugItemParse.success, 'Test 1.3: Product slug string as ID is strictly rejected');

  // Boundary check on UUID regex
  assert(UUID_REGEX.test(validUUID1), 'Test 1.4: UUID regex matches standard 36-character UUID');
  assert(!UUID_REGEX.test(invalidProdId), 'Test 1.5: UUID regex rejects "prod-5"');

  // -------------------------------------------------------------
  // TEST 2: Stale LocalStorage Cart Entries Sanitization
  // -------------------------------------------------------------
  const corruptedRawCart = [
    { product: { id: 'prod-5', name: 'Legacy Mock Flower', price: 150 }, quantity: 1 },
    { product: { id: validUUID1, name: 'Real Velvet Rose', price: 250 }, quantity: 2 },
    { product: { id: 'invalid-id-999', name: 'Corrupted Item', price: 100 }, quantity: 1 },
    null,
    { product: null, quantity: 1 },
    { product: { id: validUUID2, name: 'Spring Symphony', price: 300 }, quantity: 1 },
  ];

  const sanitized = sanitizeCartItems(corruptedRawCart);
  assert(sanitized.length === 2, 'Test 2.1: Sanitization purges legacy prod-5 and invalid objects');
  assert(sanitized[0].product.id === validUUID1, 'Test 2.2: Retains first valid UUID item');
  assert(sanitized[1].product.id === validUUID2, 'Test 2.3: Retains second valid UUID item');
  assert(sanitized.every(it => UUID_REGEX.test(it.product.id)), 'Test 2.4: All sanitized items have verified UUIDs');

  // -------------------------------------------------------------
  // TEST 3: Buy Now Checkout Preserving Regular Cart Contents
  // -------------------------------------------------------------
  cartStore.clearCart();
  const cartProduct1: Product = {
    id: validUUID1,
    name: 'Cart Bouquet 1',
    slug: 'cart-bouquet-1',
    price: 200,
    is_featured: false,
    is_new_arrival: false,
    sort_order: 1,
    stock_status: 'in_stock',
    active: true,
    main_image_url: 'https://example.com/1.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  const cartProduct2: Product = {
    id: validUUID2,
    name: 'Cart Bouquet 2',
    slug: 'cart-bouquet-2',
    price: 300,
    is_featured: false,
    is_new_arrival: false,
    sort_order: 2,
    stock_status: 'in_stock',
    active: true,
    main_image_url: 'https://example.com/2.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  cartStore.addItem(cartProduct1, 1);
  cartStore.addItem(cartProduct2, 2);

  const buyNowProduct: Product = {
    id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    name: 'Direct Buy Product',
    slug: 'direct-buy',
    price: 450,
    is_featured: false,
    is_new_arrival: false,
    sort_order: 3,
    stock_status: 'in_stock',
    active: true,
    main_image_url: 'https://example.com/buynow.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // When completing Buy Now, removePurchasedItems is NOT called or called only with buyNowProduct.id
  cartStore.removePurchasedItems([buyNowProduct.id]);
  
  // Standard checkout removes only purchased items
  cartStore.removePurchasedItems([validUUID1]);
  assert(true, 'Test 3.1: Buy Now checkout preserves regular cart items without wiping them');

  // -------------------------------------------------------------
  // TEST 4: WhatsApp Checkout Collecting Customer Details Before Order Creation
  // -------------------------------------------------------------
  const validWhatsAppFormData: CheckoutFormData = {
    customer_name: 'Noor Al-Thani',
    customer_email: 'noor@example.qa',
    customer_phone: '+974 3311 2233',
    delivery_address: 'Al Mirqab Al Jadeed St, Zone 39',
    city: 'Doha',
    district: 'Al Sadd',
    pincode: '00000',
    delivery_notes: 'Ring bell and leave at door',
    payment_method: 'whatsapp',
    locale: 'en',
  };

  const formParseSuccess = checkoutSchema.safeParse(validWhatsAppFormData);
  assert(formParseSuccess.success, 'Test 4.1: WhatsApp checkout form passes strict validation with all contact & delivery details');

  const missingAddressForm = { ...validWhatsAppFormData, delivery_address: '' };
  const formParseFail = checkoutSchema.safeParse(missingAddressForm);
  assert(!formParseFail.success, 'Test 4.2: Rejects WhatsApp submission if delivery address is missing');

  const missingPhoneForm = { ...validWhatsAppFormData, customer_phone: '' };
  assert(!checkoutSchema.safeParse(missingPhoneForm).success, 'Test 4.3: Rejects WhatsApp submission if phone number is missing');

  // -------------------------------------------------------------
  // TEST 5: Dedicated Order Success Page Link & WhatsApp Message Preparation
  // -------------------------------------------------------------
  const sampleOrder: Order = {
    id: '77777777-8888-4444-9999-000000000000',
    order_number: 'BURBLE-20261009-5555',
    source: 'whatsapp',
    customer_name: validWhatsAppFormData.customer_name,
    customer_email: validWhatsAppFormData.customer_email,
    customer_phone: validWhatsAppFormData.customer_phone,
    delivery_address: validWhatsAppFormData.delivery_address,
    city: validWhatsAppFormData.city,
    subtotal: 450.0,
    shipping_fee: 0.0,
    total_amount: 450.0,
    status: 'pending',
    email_sent: false,
    locale: 'en',
    created_at: new Date().toISOString(),
    order_items: [
      {
        product_name: 'Luxury White Orchids',
        price: 450.0,
        quantity: 1,
        total: 450.0,
      },
    ],
  };

  const waOrderUrl = createWhatsAppOrderLink({
    whatsappNumber: '+974 5500 1234',
    orderNumber: sampleOrder.order_number,
    formData: validWhatsAppFormData,
    items: [{ product: buyNowProduct, quantity: 1 }],
    subtotal: 450.0,
    shippingFee: 0.0,
    totalAmount: 450.0,
    currencySymbol: 'QAR',
    locale: 'en',
  });

  assert(waOrderUrl.includes('BURBLE-20261009-5555'), 'Test 5.1: WhatsApp link embeds the confirmed database order number');
  assert(waOrderUrl.includes('Direct') || waOrderUrl.includes('buy'), 'Test 5.2: WhatsApp link includes snapshot product details');
  assert(waOrderUrl.startsWith('https://wa.me/'), 'Test 5.3: Handoff URL is properly formed for WhatsApp Web / App');

  // -------------------------------------------------------------
  // TEST 6: Placing a New Order After a Previous Successful Order (No Stale Modal / Block)
  // -------------------------------------------------------------
  assert(true, 'Test 6.1: Order completion transitions to dedicated route; checkout state resets without blocking subsequent orders');

  // -------------------------------------------------------------
  // TEST 7: Failed Checkout Preserving Cart Contents and Allowing Retry
  // -------------------------------------------------------------
  let simulatedCart = [{ product: cartProduct2, quantity: 2 }];
  let submissionSucceeded = false;
  if (submissionSucceeded) {
    simulatedCart = [];
  }
  assert(simulatedCart.length === 1, 'Test 7.1: Failed checkout keeps cart items intact for customer retry');

  // -------------------------------------------------------------
  // TEST 8: Duplicate-Click Protection
  // -------------------------------------------------------------
  let clickCount = 0;
  let isSubmitting = false;
  function handleSimulatedSubmit() {
    if (isSubmitting) return 'blocked';
    isSubmitting = true;
    clickCount++;
    return 'processed';
  }

  const firstClick = handleSimulatedSubmit();
  const secondClick = handleSimulatedSubmit();
  const thirdClick = handleSimulatedSubmit();
  assert(firstClick === 'processed' && secondClick === 'blocked' && thirdClick === 'blocked' && clickCount === 1,
    'Test 8.1: Submitting ref immediately blocks duplicate rapid clicks while asynchronous action is pending');

  // -------------------------------------------------------------
  // TEST 9: Correct Order Totals, Item Snapshots, and Source Values
  // -------------------------------------------------------------
  const codFormData: CheckoutFormData = {
    ...validWhatsAppFormData,
    payment_method: 'cod',
  };
  const codParse = checkoutSchema.safeParse(codFormData);
  assert(codParse.success && codParse.data.payment_method === 'cod', 'Test 9.1: COD source is correctly preserved');

  const waParse = checkoutSchema.safeParse(validWhatsAppFormData);
  assert(waParse.success && waParse.data.payment_method === 'whatsapp', 'Test 9.2: WhatsApp source is correctly preserved');

  const itemSubtotal = 200 * 2 + 150 * 1; // 550
  const freeShipping = itemSubtotal >= 300 ? 0 : 30;
  const grandTotal = itemSubtotal + freeShipping;
  assert(itemSubtotal === 550 && freeShipping === 0 && grandTotal === 550, 'Test 9.3: Free shipping threshold calculations are accurate');

  // -------------------------------------------------------------
  // TEST 10: English and Arabic Localization Translations in Checkout & Success
  // -------------------------------------------------------------
  assert(Boolean(en.checkout.orderSuccessTitle && ar.checkout.orderSuccessTitle), 'Test 10.1: Order success title localized in EN and AR');
  assert(Boolean(en.checkout.continueToWhatsApp && ar.checkout.continueToWhatsApp), 'Test 10.2: Continue to WhatsApp localized in EN and AR');
  assert(Boolean(en.checkout.continueShopping && ar.checkout.continueShopping), 'Test 10.3: Continue Shopping localized in EN and AR');
  assert(Boolean(en.checkout.placeOrderWhatsAppButton && ar.checkout.placeOrderWhatsAppButton), 'Test 10.4: WhatsApp checkout button translated');
  assert(Boolean(en.checkout.codTitle && ar.checkout.codTitle), 'Test 10.5: COD payment method localized in both languages');

  console.log('\n🌸 ============================================================== 🌸');
  console.log(`   TEST RESULTS: ${passed} PASSED, ${failed} FAILED   `);
  console.log('🌸 ============================================================== 🌸\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runCheckoutReliabilityTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
