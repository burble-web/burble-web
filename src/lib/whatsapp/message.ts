import { CartItem, CheckoutFormData, Locale } from '@/types';
import { getLocalizedValue } from '@/lib/i18n/utils';

export interface WhatsAppMessageParams {
  whatsappNumber: string;
  orderNumber: string;
  formData: CheckoutFormData;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  currencySymbol?: string;
  locale?: Locale;
  siteUrl?: string;
}

/**
 * Generates the clean, structured WhatsApp message following Burble's verified order schema.
 * Visual organization:
 * 1. Order heading
 * 2. Product details (item name, category, unit price, quantity, line subtotal)
 * 3. Shipping details
 * 4. Grand total (in QAR)
 * 5. Customer & delivery details
 * 6. Product link(s)
 * 7. Closing message
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
}: WhatsAppMessageParams): string {
  const isAr = locale === 'ar';
  const currSym = isAr ? (currencySymbol === 'QAR' ? 'ر.ق' : currencySymbol) : (currencySymbol || 'QAR');

  if (isAr) {
    // 1. Order heading
    let msg = `🌸 *طلب شراء جديد - متجر زهور بيربل*\n`;
    msg += `*رقم الطلب المرجعي:* #${orderNumber}\n\n`;

    // 2. Product details
    msg += `🛍️ *تفاصيل الباقات والمنتجات:*\n`;
    items.forEach((item, idx) => {
      const productName = getLocalizedValue({
        locale: 'ar',
        english: item.product.name,
        arabic: item.product.name_ar,
      });
      const categoryName = getLocalizedValue({
        locale: 'ar',
        english: item.product.category?.name,
        arabic: item.product.category?.name_ar,
      });
      const unitPrice = item.product.price.toFixed(2);
      const lineTotal = (item.product.price * item.quantity).toFixed(2);

      msg += `${idx + 1}. *${productName}*\n`;
      if (categoryName) {
        msg += `   • الفئة: ${categoryName}\n`;
      }
      msg += `   • السعر: ${unitPrice} ${currSym} × ${item.quantity}\n`;
      msg += `   • المجموع: ${lineTotal} ${currSym}\n`;
    });

    // 3. Shipping details & 4. Grand total
    msg += `\n📦 *تفاصيل الشحن والتوصيل:*\n`;
    msg += `• المجموع الفرعي: ${subtotal.toFixed(2)} ${currSym}\n`;
    msg += `• رسوم التوصيل: ${shippingFee > 0 ? `${shippingFee.toFixed(2)} ${currSym}` : 'توصيل مجاني 🎉'}\n`;
    msg += `• *المبلغ الإجمالي:* ${totalAmount.toFixed(2)} ${currSym}\n\n`;

    // 5. Customer details
    msg += `📍 *بيانات العميل والتوصيل:*\n`;
    msg += `• الاسم: ${formData.customer_name}\n`;
    msg += `• رقم الهاتف: ${formData.customer_phone}\n`;
    msg += `• البريد الإلكتروني: ${formData.customer_email}\n`;
    msg += `• العنوان: ${formData.delivery_address}، ${formData.city}${formData.district ? `، ${formData.district}` : ''}${formData.pincode ? ` (${formData.pincode})` : ''}\n`;
    if (formData.delivery_notes) {
      msg += `• ملاحظات التوصيل / كارت الإهداء: ${formData.delivery_notes}\n`;
    }

    // 6. Product links
    msg += `\n🔗 *روابط المنتجات:*\n`;
    items.forEach((item) => {
      const productName = getLocalizedValue({
        locale: 'ar',
        english: item.product.name,
        arabic: item.product.name_ar,
      });
      msg += `• ${productName}: ${siteUrl}/products/${item.product.slug}\n`;
    });

    // 7. Closing message
    msg += `\n✨ _شكراً لاختياركم بيربل! يرجى إرسال هذه الرسالة لفريقنا لتأكيد موعد وتفاصيل التوصيل._`;

    return msg;
  }

  // English message
  // 1. Order heading
  let msg = `🌸 *New Order Request - Burble Flowers*\n`;
  msg += `*Order Reference:* #${orderNumber}\n\n`;

  // 2. Product details
  msg += `🛍️ *Order Items:*\n`;
  items.forEach((item, idx) => {
    const unitPrice = item.product.price.toFixed(2);
    const lineTotal = (item.product.price * item.quantity).toFixed(2);
    const categoryName = item.product.category?.name;

    msg += `${idx + 1}. *${item.product.name}*\n`;
    if (categoryName) {
      msg += `   • Category: ${categoryName}\n`;
    }
    msg += `   • Price: ${currSym} ${unitPrice} × ${item.quantity}\n`;
    msg += `   • Line Total: ${currSym} ${lineTotal}\n`;
  });

  // 3. Shipping details & 4. Grand total
  msg += `\n📦 *Shipping & Delivery:*\n`;
  msg += `• Subtotal: ${currSym} ${subtotal.toFixed(2)}\n`;
  msg += `• Delivery Fee: ${shippingFee > 0 ? `${currSym} ${shippingFee.toFixed(2)}` : 'FREE'}\n`;
  msg += `• *Grand Total:* ${currSym} ${totalAmount.toFixed(2)}\n\n`;

  // 5. Customer details
  msg += `📍 *Customer & Delivery Details:*\n`;
  msg += `• Name: ${formData.customer_name}\n`;
  msg += `• Phone: ${formData.customer_phone}\n`;
  msg += `• Email: ${formData.customer_email}\n`;
  msg += `• Address: ${formData.delivery_address}, ${formData.city}${formData.district ? `, ${formData.district}` : ''}${formData.pincode ? ` (${formData.pincode})` : ''}\n`;
  if (formData.delivery_notes) {
    msg += `• Delivery Instructions / Note: ${formData.delivery_notes}\n`;
  }

  // 6. Product links
  msg += `\n🔗 *Product Links:*\n`;
  items.forEach((item) => {
    msg += `• ${item.product.name}: ${siteUrl}/products/${item.product.slug}\n`;
  });

  // 7. Closing message
  msg += `\n✨ _Thank you for choosing Burble! Please send this message to our team to confirm delivery details._`;

  return msg;
}

/**
 * Encodes the structured message into a verified WhatsApp destination URL.
 */
export function createWhatsAppOrderLink(params: WhatsAppMessageParams): string {
  const cleanNumber = params.whatsappNumber.replace(/[^0-9]/g, '');
  const message = generateWhatsAppMessage(params);
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encodedText}`;
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
