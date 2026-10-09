import { CartItem, CheckoutFormData, Locale } from '@/types';
import { getLocalizedValue } from '@/lib/i18n/utils';

/**
 * Formats a clean, human-readable WhatsApp order message (in English or Arabic) and returns a WhatsApp URL.
 */
export function createWhatsAppOrderLink({
  whatsappNumber,
  orderNumber,
  formData,
  items,
  subtotal,
  shippingFee,
  totalAmount,
  currencySymbol = 'QAR',
  locale = 'en',
}: {
  whatsappNumber: string;
  orderNumber: string;
  formData: CheckoutFormData;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  currencySymbol?: string;
  locale?: Locale;
}): string {
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');

  if (locale === 'ar') {
    const currSym = currencySymbol === 'QAR' ? 'ر.ق' : currencySymbol;
    const itemsList = items
      .map((item) => {
        const name = getLocalizedValue({
          locale: 'ar',
          english: item.product.name,
          arabic: item.product.name_ar,
        });
        return `• ${name} × ${item.quantity} (${(item.product.price * item.quantity).toFixed(2)} ${currSym})`;
      })
      .join('\n');

    const text = `🌸 *طلب شراء جديد - متجر زهور بيربل*

*رقم الطلب المرجعي:* #${orderNumber}

*تفاصيل الباقات:*
${itemsList}

------------------------------
*المجموع الفرعي:* ${subtotal.toFixed(2)} ${currSym}
*رسوم التوصيل:* ${shippingFee > 0 ? `${shippingFee.toFixed(2)} ${currSym}` : 'توصيل مجاني 🎉'}
*المبلغ الإجمالي:* ${totalAmount.toFixed(2)} ${currSym}

------------------------------
*بيانات العميل والتوصيل:*
• الاسم: ${formData.customer_name}
• رقم الهاتف: ${formData.customer_phone}
• البريد الإلكتروني: ${formData.customer_email}
• العنوان: ${formData.delivery_address}، ${formData.city}${formData.pincode ? ` (${formData.pincode})` : ''}
${formData.delivery_notes ? `• ملاحظات التوصيل / كارت الإهداء: ${formData.delivery_notes}` : ''}

شكراً لكم! أود تأكيد هذا الطلب ومتابعته عبر الواتساب.`;

    const encodedText = encodeURIComponent(text);
    return `https://wa.me/${cleanNumber}?text=${encodedText}`;
  }

  // English message
  const itemsList = items
    .map((item) => `• ${item.product.name} × ${item.quantity} (${currencySymbol} ${(item.product.price * item.quantity).toFixed(2)})`)
    .join('\n');

  const text = `🌸 *New Order Request - Burble Flowers*

*Order Ref:* #${orderNumber}

*Items:*
${itemsList}

------------------------------
*Subtotal:* ${currencySymbol} ${subtotal.toFixed(2)}
*Delivery:* ${shippingFee > 0 ? `${currencySymbol} ${shippingFee.toFixed(2)}` : 'FREE'}
*Total Amount:* ${currencySymbol} ${totalAmount.toFixed(2)}

------------------------------
*Customer Details:*
• Name: ${formData.customer_name}
• Phone: ${formData.customer_phone}
• Email: ${formData.customer_email}
• Address: ${formData.delivery_address}, ${formData.city}${formData.pincode ? ` (${formData.pincode})` : ''}
${formData.delivery_notes ? `• Delivery Note: ${formData.delivery_notes}` : ''}

Thank you! I would like to confirm this order via WhatsApp.`;

  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanNumber}?text=${encodedText}`;
}
