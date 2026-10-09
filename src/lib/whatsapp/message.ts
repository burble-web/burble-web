import { CartItem, CheckoutFormData, Locale, Order, OrderItem } from '@/types';
import { getLocalizedValue } from '@/lib/i18n/utils';

export interface WhatsAppMessageParams {
  whatsappNumber: string;
  orderNumber: string;
  formData: CheckoutFormData;
  items: (CartItem | OrderItem)[];
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  currencySymbol?: string;
  locale?: Locale;
  siteUrl?: string;
  createdAt?: string | Date;
  paymentMethod?: string;
}

/**
 * Normalizes phone number to international digits without '+', '00', spaces, dashes, or punctuation.
 */
export function normalizeWhatsAppNumber(phone: string): string {
  if (!phone || typeof phone !== 'string') return '';
  let clean = phone.replace(/[^0-9]/g, '');
  if (clean.startsWith('00')) {
    clean = clean.substring(2);
  }
  return clean;
}

/**
 * Formats order creation timestamp in a locale-aware readable format.
 */
function formatOrderDateTime(createdAt?: string | Date, locale: Locale = 'en'): string {
  try {
    const dateObj = createdAt ? new Date(createdAt) : new Date();
    if (isNaN(dateObj.getTime())) return '';
    return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-QA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(dateObj);
  } catch {
    return '';
  }
}

interface NormalizedItemDetail {
  name: string;
  category?: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  slug?: string;
  url: string;
}

function isCartItem(item: CartItem | OrderItem): item is CartItem {
  return 'product' in item && item.product !== null && typeof item.product === 'object' && 'price' in (item.product as any);
}

function extractItemDetails(
  items: (CartItem | OrderItem)[],
  locale: Locale,
  siteUrl: string
): NormalizedItemDetail[] {
  const cleanSiteUrl = siteUrl.replace(/\/+$/, '');

  return items.map((item) => {
    if (isCartItem(item)) {
      const prod = item.product;
      const name = getLocalizedValue({
        locale,
        english: prod.name,
        arabic: prod.name_ar,
      }) || prod.name || 'Floral Arrangement';

      const categoryName = prod.category
        ? getLocalizedValue({
            locale,
            english: prod.category.name,
            arabic: prod.category.name_ar,
          }) || prod.category.name
        : undefined;

      const unitPrice = prod.price;
      const quantity = item.quantity || 1;
      const lineTotal = unitPrice * quantity;
      const slug = prod.slug || '';
      const url = slug ? `${cleanSiteUrl}/products/${slug}` : cleanSiteUrl;

      return {
        name,
        category: categoryName,
        unitPrice,
        quantity,
        lineTotal,
        slug,
        url,
      };
    }

    const orderIt = item as OrderItem;
    const name = getLocalizedValue({
      locale,
      english: orderIt.product_name,
      arabic: orderIt.product_name_ar,
    }) || orderIt.product_name || 'Floral Arrangement';

    const unitPrice = orderIt.price ?? 0;
    const quantity = orderIt.quantity || 1;
    const lineTotal = typeof orderIt.total === 'number' ? orderIt.total : unitPrice * quantity;
    const slug = orderIt.product?.slug || '';
    const url = slug ? `${cleanSiteUrl}/products/${slug}` : cleanSiteUrl;

    return {
      name,
      category: undefined,
      unitPrice,
      quantity,
      lineTotal,
      slug,
      url,
    };
  });
}

/**
 * Generates a professional, structured WhatsApp order notification
 * with Burble branding, complete itemized product breakdown, customer & delivery
 * details, validated financials, direct product links, and locale-tailored labels.
 */
export function generateWhatsAppMessage({
  orderNumber,
  formData,
  items,
  subtotal,
  shippingFee,
  totalAmount,
  currencySymbol = 'QAR',
  locale = 'en',
  siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://burbleflowers.com',
  createdAt,
  paymentMethod,
}: WhatsAppMessageParams): string {
  const isAr = locale === 'ar';
  const currSym = isAr ? (currencySymbol === 'QAR' ? 'ر.ق' : currencySymbol) : (currencySymbol || 'QAR');
  const normalizedItems = extractItemDetails(items, locale, siteUrl);
  const formattedDateTime = formatOrderDateTime(createdAt, locale);

  const effectivePaymentMethod = paymentMethod || formData.payment_method || 'whatsapp';
  const methodLabel = isAr
    ? (effectivePaymentMethod === 'whatsapp' ? 'طلب عبر واتساب (WhatsApp Order)' : 'الدفع عند الاستلام (Cash on Delivery)')
    : (effectivePaymentMethod === 'whatsapp' ? 'Order via WhatsApp' : 'Cash on Delivery (COD)');

  if (isAr) {
    // 1. Branding and Order Heading
    let msg = `🌸 *متجر زهور بيربل — طلب شراء جديد* 🌸\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `*رقم الطلب المرجعي:* #${orderNumber}\n`;
    if (formattedDateTime) {
      msg += `*تاريخ الطلب:* ${formattedDateTime}\n`;
    }
    msg += `*طريقة الطلب:* ${methodLabel}\n\n`;

    // 2. Product details
    msg += `🛍️ *تفاصيل الباقات والمنتجات:*\n`;
    normalizedItems.forEach((item, idx) => {
      msg += `${idx + 1}. *${item.name}*\n`;
      if (item.category) {
        msg += `   • الفئة: ${item.category}\n`;
      }
      msg += `   • السعر: ${item.unitPrice.toFixed(2)} ${currSym} × ${item.quantity}\n`;
      msg += `   • المجموع: ${item.lineTotal.toFixed(2)} ${currSym}\n`;
    });

    // 3. Shipping & Pricing details
    msg += `\n📦 *تفاصيل الشحن والتوصيل:*\n`;
    msg += `• المجموع الفرعي: ${subtotal.toFixed(2)} ${currSym}\n`;
    msg += `• رسوم التوصيل: ${shippingFee > 0 ? `${shippingFee.toFixed(2)} ${currSym}` : 'توصيل مجاني 🎉'}\n`;
    msg += `• *المبلغ الإجمالي:* ${totalAmount.toFixed(2)} ${currSym}\n\n`;

    // 4. Customer & Delivery Address details
    msg += `📍 *بيانات العميل والتوصيل:*\n`;
    msg += `• الاسم: ${formData.customer_name}\n`;
    msg += `• رقم الهاتف: ${formData.customer_phone}\n`;
    if (formData.customer_email) {
      msg += `• البريد الإلكتروني: ${formData.customer_email}\n`;
    }
    msg += `• العنوان: ${formData.delivery_address}، ${formData.city}${formData.district ? `، ${formData.district}` : ''}${formData.pincode ? ` (${formData.pincode})` : ''}\n`;
    if (formData.delivery_notes) {
      msg += `• ملاحظات التوصيل / كارت الإهداء: ${formData.delivery_notes}\n`;
    }

    // 5. Product Links (Prioritize first product for crawler previews)
    msg += `\n🔗 *روابط المنتجات:*\n`;
    normalizedItems.forEach((item) => {
      msg += `• ${item.name}: ${item.url}\n`;
    });

    // 6. Closing message
    msg += `\n✨ _شكراً لاختياركم بيربل! يرجى إرسال هذه الرسالة لفريقنا لمباشرة تجهيز باقتكم وتأكيد موعد التوصيل._`;

    return msg;
  }

  // English structured message
  // 1. Branding and Order Heading
  let msg = `🌸 *New Order Request - Burble Flowers*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `*Order Reference:* #${orderNumber}\n`;
  if (formattedDateTime) {
    msg += `*Date & Time:* ${formattedDateTime}\n`;
  }
  msg += `*Payment / Method:* ${methodLabel}\n\n`;

  // 2. Product details
  msg += `🛍️ *Order Items:*\n`;
  normalizedItems.forEach((item, idx) => {
    msg += `${idx + 1}. *${item.name}*\n`;
    if (item.category) {
      msg += `   • Category: ${item.category}\n`;
    }
    msg += `   • Price: ${currSym} ${item.unitPrice.toFixed(2)} × ${item.quantity}\n`;
    msg += `   • Line Total: ${currSym} ${item.lineTotal.toFixed(2)}\n`;
  });

  // 3. Shipping & Pricing details
  msg += `\n📦 *Shipping & Delivery:*\n`;
  msg += `• Subtotal: ${currSym} ${subtotal.toFixed(2)}\n`;
  msg += `• Delivery Fee: ${shippingFee > 0 ? `${currSym} ${shippingFee.toFixed(2)}` : 'FREE'}\n`;
  msg += `• *Grand Total:* ${currSym} ${totalAmount.toFixed(2)}\n\n`;

  // 4. Customer & Delivery Address details
  msg += `📍 *Customer & Delivery Details:*\n`;
  msg += `• Name: ${formData.customer_name}\n`;
  msg += `• Phone: ${formData.customer_phone}\n`;
  if (formData.customer_email) {
    msg += `• Email: ${formData.customer_email}\n`;
  }
  msg += `• Address: ${formData.delivery_address}, ${formData.city}${formData.district ? `, ${formData.district}` : ''}${formData.pincode ? ` (${formData.pincode})` : ''}\n`;
  if (formData.delivery_notes) {
    msg += `• Delivery Instructions / Note: ${formData.delivery_notes}\n`;
  }

  // 5. Product Links (Prioritize first product for crawler previews)
  msg += `\n🔗 *Product Links:*\n`;
  normalizedItems.forEach((item) => {
    msg += `• ${item.name}: ${item.url}\n`;
  });

  // 6. Closing message
  msg += `\n✨ _Thank you for choosing Burble! Please send this message to our team to confirm delivery details._`;

  return msg;
}

/**
 * Encodes the structured message into a verified WhatsApp destination URL
 * following the standard API format: https://api.whatsapp.com/send?phone=...&text=...
 */
export function createWhatsAppOrderLink(params: WhatsAppMessageParams): string {
  const cleanNumber = normalizeWhatsAppNumber(params.whatsappNumber);
  const message = generateWhatsAppMessage(params);
  const encodedText = encodeURIComponent(message);
  return `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${encodedText}`;
}

/**
 * Opens WhatsApp composer in a new window/tab on client devices.
 */
export function openWhatsApp(params: WhatsAppMessageParams): void {
  const url = createWhatsAppOrderLink(params);
  if (typeof window !== 'undefined') {
    window.open(url, '_blank');
  }
}

