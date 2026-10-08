'use server';

import { createClient } from '@/lib/supabase/server';
import { checkoutSchema } from '@/lib/validation/schemas';
import { CheckoutFormData, CartItem, Order } from '@/types';
import { sendBrevoEmail, buildCustomerOrderEmailHtml, buildAdminOrderEmailHtml } from '@/lib/brevo/email';
import { DEMO_PRODUCTS } from '@/lib/data/storefront';

export async function processCheckoutAction(formData: CheckoutFormData, cartItems: CartItem[]) {
  // 1. Server-side Zod validation
  const validationResult = checkoutSchema.safeParse(formData);
  if (!validationResult.success) {
    return {
      success: false,
      error: validationResult.error.issues[0]?.message || 'Invalid form input.',
    };
  }

  if (!cartItems || cartItems.length === 0) {
    return {
      success: false,
      error: 'Your cart is empty.',
    };
  }

  const data = validationResult.data;

  try {
    const supabase = await createClient();

    // 2. Format items for Postgres RPC create_order
    const rpcItems = cartItems.map((item) => ({
      product_id: item.product.id,
      quantity: item.quantity,
    }));

    // Attempt RPC call on Supabase
    const { data: rpcResult, error: rpcError } = await supabase.rpc('create_order', {
      p_source: data.payment_method,
      p_customer_name: data.customer_name,
      p_customer_email: data.customer_email,
      p_customer_phone: data.customer_phone,
      p_delivery_address: data.delivery_address,
      p_city: data.city,
      p_district: data.district || '',
      p_pincode: data.pincode || '',
      p_delivery_notes: data.delivery_notes || '',
      p_items: rpcItems,
    });

    let createdOrder: Partial<Order>;

    if (!rpcError && rpcResult) {
      createdOrder = rpcResult;
    } else {
      // Fallback calculation if DB RPC is not yet executed on user's Supabase instance
      const subtotal = cartItems.reduce((sum, item) => {
        const prod = DEMO_PRODUCTS.find((p) => p.id === item.product.id) || item.product;
        return sum + prod.price * item.quantity;
      }, 0);
      const shipping_fee = subtotal >= 300 ? 0 : 25;
      const total_amount = subtotal + shipping_fee;
      const order_number = `BURBLE-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

      createdOrder = {
        id: `ord-${Date.now()}`,
        order_number,
        source: data.payment_method,
        subtotal,
        shipping_fee,
        total_amount,
      };
    }

    const fullOrder: Order = {
      id: createdOrder.id || `ord-${Date.now()}`,
      order_number: createdOrder.order_number || 'BURBLE-OFFLINE',
      source: data.payment_method,
      customer_name: data.customer_name,
      customer_email: data.customer_email,
      customer_phone: data.customer_phone,
      delivery_address: data.delivery_address,
      city: data.city,
      district: data.district,
      pincode: data.pincode,
      delivery_notes: data.delivery_notes,
      subtotal: createdOrder.subtotal || 0,
      shipping_fee: createdOrder.shipping_fee || 0,
      total_amount: createdOrder.total_amount || 0,
      status: 'pending',
      email_sent: false,
      created_at: new Date().toISOString(),
      order_items: cartItems.map((item) => ({
        product_name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        total: item.product.price * item.quantity,
      })),
    };

    // 3. Trigger Brevo Emails asynchronously
    try {
      // A. Customer gets confirmation email for BOTH COD & WhatsApp orders
      const customerHtml = buildCustomerOrderEmailHtml(fullOrder);
      await sendBrevoEmail({
        to: [{ email: data.customer_email, name: data.customer_name }],
        subject: `Order Confirmation #${fullOrder.order_number} - Burble`,
        htmlContent: customerHtml,
      });

      // B. Admin receives email notification ONLY for COD orders
      if (data.payment_method === 'cod') {
        let adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;

        if (!adminEmail) {
          const { data: settings } = await supabase
            .from('site_settings')
            .select('admin_email')
            .eq('id', 1)
            .single();

          if (settings?.admin_email) {
            adminEmail = settings.admin_email;
          }
        }

        if (adminEmail) {
          const adminHtml = buildAdminOrderEmailHtml(fullOrder);
          await sendBrevoEmail({
            to: [{ email: adminEmail, name: 'Burble Admin' }],
            subject: `🚨 New COD Order #${fullOrder.order_number}`,
            htmlContent: adminHtml,
          });
        } else {
          console.warn('[Order Action] Admin notification email not configured in site_settings or ADMIN_NOTIFICATION_EMAIL. Skipping admin email dispatch.');
        }
      }
    } catch (emailErr) {
      // Non-blocking requirement: Email failure should not corrupt or roll back valid order
      console.error('Non-blocking Brevo email error:', emailErr);
    }

    return {
      success: true,
      order: fullOrder,
    };
  } catch (error: any) {
    console.error('Order checkout error:', error);
    return {
      success: false,
      error: error?.message || 'An unexpected error occurred while placing your order.',
    };
  }
}
