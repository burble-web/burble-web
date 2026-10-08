import { Order } from '@/types';

interface SendBrevoEmailParams {
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
}

/**
 * Sends a transactional email using Brevo REST API v3 via standard fetch.
 * Runs strictly server-side.
 */
export async function sendBrevoEmail({ to, subject, htmlContent }: SendBrevoEmailParams): Promise<boolean> {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'orders@burbleflowers.com';
  const senderName = process.env.BREVO_SENDER_NAME || 'Burble Flowers';

  if (!apiKey) {
    console.warn('[Brevo] BREVO_API_KEY not configured. Email notification skipped.');
    return false;
  }

  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail },
        to,
        subject,
        htmlContent,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('[Brevo Email Error]', res.status, errorText);
      return false;
    }

    return true;
  } catch (err) {
    console.error('[Brevo Network Error]', err);
    return false;
  }
}

/**
 * Builds HTML template for Order Confirmation (COD Order)
 */
export function buildCustomerOrderEmailHtml(order: Order): string {
  const itemsHtml = (order.order_items || [])
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #EFE6F1; font-family: sans-serif;">${item.product_name} x ${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #EFE6F1; text-align: right; font-family: sans-serif;">${order.currency_symbol || 'QAR'} ${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `
    )
    .join('');

  return `
    <div style="max-width: 600px; margin: 0 auto; background: #FBF8F4; padding: 24px; font-family: sans-serif; color: #2B2230;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #4A1D4F; font-size: 28px; margin: 0;">Burble</h1>
        <p style="color: #7D7280; font-size: 14px; margin-top: 4px;">Flowers make moments special</p>
      </div>

      <div style="background: #FFFFFF; border-radius: 12px; padding: 24px; border: 1px solid #EFE6F1;">
        <h2 style="color: #4A1D4F; margin-top: 0; font-size: 20px;">Order Received!</h2>
        <p>Hi <strong>${order.customer_name}</strong>,</p>
        <p>Thank you for choosing Burble. Your order <strong>#${order.order_number}</strong> has been successfully placed via <strong>Cash on Delivery</strong>.</p>
        
        <h3 style="color: #4A1D4F; margin-top: 24px; font-size: 16px;">Order Summary</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
          ${itemsHtml}
          <tr>
            <td style="padding: 10px; font-weight: bold;">Subtotal</td>
            <td style="padding: 10px; text-align: right;">${order.subtotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold;">Delivery Fee</td>
            <td style="padding: 10px; text-align: right;">${order.shipping_fee > 0 ? order.shipping_fee.toFixed(2) : 'FREE'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; font-size: 18px; color: #4A1D4F;">Total Amount</td>
            <td style="padding: 10px; text-align: right; font-weight: bold; font-size: 18px; color: #4A1D4F;">${order.total_amount.toFixed(2)}</td>
          </tr>
        </table>

        <h3 style="color: #4A1D4F; margin-top: 24px; font-size: 16px;">Delivery Details</h3>
        <p style="margin: 4px 0; color: #4B4150;"><strong>Address:</strong> ${order.delivery_address}, ${order.city}</p>
        <p style="margin: 4px 0; color: #4B4150;"><strong>Phone:</strong> ${order.customer_phone}</p>
        ${order.delivery_notes ? `<p style="margin: 4px 0; color: #4B4150;"><strong>Notes:</strong> ${order.delivery_notes}</p>` : ''}
      </div>

      <p style="text-align: center; color: #7D7280; font-size: 12px; margin-top: 24px;">
        Need help with your order? Reply directly to this email or contact us on WhatsApp.
      </p>
    </div>
  `;
}

/**
 * Builds HTML template for Admin Order Notification (COD Order)
 */
export function buildAdminOrderEmailHtml(order: Order): string {
  return `
    <div style="max-width: 600px; margin: 0 auto; background: #FFFFFF; padding: 24px; font-family: sans-serif; color: #2B2230;">
      <h2 style="color: #4A1D4F;">🚨 New COD Order Received (#${order.order_number})</h2>
      <p>A new order has been submitted via Cash on Delivery.</p>
      
      <ul>
        <li><strong>Customer:</strong> ${order.customer_name} (${order.customer_phone})</li>
        <li><strong>Email:</strong> ${order.customer_email}</li>
        <li><strong>Address:</strong> ${order.delivery_address}, ${order.city}</li>
        <li><strong>Total Amount:</strong> QAR ${order.total_amount.toFixed(2)}</li>
      </ul>

      <p>Log in to the Burble admin dashboard to process and update the delivery status.</p>
    </div>
  `;
}
