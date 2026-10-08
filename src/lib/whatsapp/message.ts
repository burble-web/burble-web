import { CartItem, CheckoutFormData } from '@/types';

/**
 * Formats a clean, human-readable WhatsApp order message and returns a WhatsApp URL.
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
}: {
  whatsappNumber: string;
  orderNumber: string;
  formData: CheckoutFormData;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  currencySymbol?: string;
}): string {
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');

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
