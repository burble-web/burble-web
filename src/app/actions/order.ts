'use server';

import { createClient, verifyAdminServer } from '@/lib/supabase/server';
import { checkoutSchema } from '@/lib/validation/schemas';
import { CheckoutFormData, CartItem, Order, OrderStatus } from '@/types';
import { sendBrevoEmail, buildCustomerOrderEmailHtml, buildAdminOrderEmailHtml } from '@/lib/brevo/email';
import { revalidatePath } from 'next/cache';

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

    // Call create_order RPC on Supabase (Atomic transaction, verifies price, availability & active state)
    const { data: rpcResult, error: rpcError } = await supabase.rpc('create_order', {
      p_source: data.payment_method,
      p_customer_name: data.customer_name.trim(),
      p_customer_email: data.customer_email.trim().toLowerCase(),
      p_customer_phone: data.customer_phone.trim(),
      p_delivery_address: data.delivery_address.trim(),
      p_city: data.city.trim() || 'Doha',
      p_district: data.district ? data.district.trim() : '',
      p_pincode: data.pincode ? data.pincode.trim() : '',
      p_delivery_notes: data.delivery_notes ? data.delivery_notes.trim() : '',
      p_items: rpcItems,
      p_locale: data.locale || 'en',
    });

    if (rpcError) {
      console.error('[Order Action] Database create_order RPC error:', rpcError.message);
      return {
        success: false,
        error: rpcError.message || 'Failed to place order in database.',
      };
    }

    if (!rpcResult || !rpcResult.id) {
      return {
        success: false,
        error: 'Order could not be verified by the database.',
      };
    }

    const fullOrder: Order = {
      id: rpcResult.id,
      order_number: rpcResult.order_number,
      source: data.payment_method,
      customer_name: data.customer_name,
      customer_email: data.customer_email,
      customer_phone: data.customer_phone,
      delivery_address: data.delivery_address,
      city: data.city,
      district: data.district,
      pincode: data.pincode,
      delivery_notes: data.delivery_notes,
      subtotal: rpcResult.subtotal ?? 0,
      shipping_fee: rpcResult.shipping_fee ?? 0,
      total_amount: rpcResult.total_amount ?? 0,
      status: 'pending',
      email_sent: false,
      locale: (data.locale || 'en') as 'en' | 'ar',
      created_at: new Date().toISOString(),
      order_items: cartItems.map((item) => ({
        product_name: item.product.name,
        product_name_ar: item.product.name_ar,
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
        }
      }
    } catch (emailErr) {
      // Non-blocking: Email delivery error does not disrupt order completion
      console.error('[Order Action] Non-blocking email dispatch error:', emailErr);
    }

    return {
      success: true,
      order: fullOrder,
    };
  } catch (error: any) {
    console.error('[Order Action] Unexpected checkout error:', error);
    return {
      success: false,
      error: error?.message || 'An unexpected error occurred while placing your order.',
    };
  }
}

export async function getAdminOrdersAction(): Promise<{ success: boolean; data?: Order[]; error?: string }> {
  const isAdmin = await verifyAdminServer();
  if (!isAdmin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    if (!url.includes('placeholder.supabase.co')) {
      return { success: false, error: 'Unauthorized: Admin authentication required.' };
    }
  }

  try {
    const supabase = await createClient();
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id, order_number, source, customer_name, customer_email, customer_phone, delivery_address, city, district, pincode, delivery_notes, subtotal, shipping_fee, total_amount, status, email_sent, locale, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (ordersError) {
      return { success: false, error: ordersError.message };
    }

    if (!orders || orders.length === 0) {
      return { success: true, data: [] };
    }

    // Fetch associated order_items
    const orderIds = orders.map((o) => o.id);
    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select('id, order_id, product_id, product_name, product_name_ar, price, quantity, total')
      .in('order_id', orderIds);

    if (itemsError) {
      console.warn('[Order Action] Warning fetching order_items:', itemsError.message);
    }

    const fullOrders: Order[] = orders.map((o) => ({
      ...o,
      order_items: (items || []).filter((it) => it.order_id === o.id),
    }));

    return { success: true, data: fullOrders };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to fetch orders from database.' };
  }
}

export async function updateOrderStatusAction(orderId: string, status: OrderStatus): Promise<{ success: boolean; error?: string }> {
  const isAdmin = await verifyAdminServer();
  if (!isAdmin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    if (!url.includes('placeholder.supabase.co')) {
      return { success: false, error: 'Unauthorized: Admin authentication required.' };
    }
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/orders');
    revalidatePath('/admin');

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to update order status.' };
  }
}

export async function getAdminDashboardMetricsAction(): Promise<{
  success: boolean;
  totalSales: number;
  ordersCount: number;
  productsCount: number;
  categoriesCount: number;
  recentOrders: Order[];
  error?: string;
}> {
  const isAdmin = await verifyAdminServer();
  if (!isAdmin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    if (!url.includes('placeholder.supabase.co')) {
      return {
        success: false,
        totalSales: 0,
        ordersCount: 0,
        productsCount: 0,
        categoriesCount: 0,
        recentOrders: [],
        error: 'Unauthorized: Admin authentication required.',
      };
    }
  }

  try {
    const supabase = await createClient();

    // 1. Orders and sales
    const { data: orders, error: ordersErr } = await supabase
      .from('orders')
      .select('id, order_number, source, customer_name, customer_email, customer_phone, delivery_address, city, subtotal, shipping_fee, total_amount, status, created_at')
      .order('created_at', { ascending: false });

    // 2. Products count
    const { count: productsCount, error: prodErr } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('active', true);

    // 3. Categories count
    const { count: categoriesCount, error: catErr } = await supabase
      .from('categories')
      .select('id', { count: 'exact', head: true })
      .eq('active', true);

    const allOrders = orders || [];
    const totalSales = allOrders.reduce((acc, curr) => acc + (Number(curr.total_amount) || 0), 0);
    const recentOrders: Order[] = allOrders.slice(0, 5) as Order[];

    return {
      success: true,
      totalSales,
      ordersCount: allOrders.length,
      productsCount: productsCount || 0,
      categoriesCount: categoriesCount || 0,
      recentOrders,
    };
  } catch (err: any) {
    return {
      success: false,
      totalSales: 0,
      ordersCount: 0,
      productsCount: 0,
      categoriesCount: 0,
      recentOrders: [],
      error: err?.message || 'Failed to fetch dashboard metrics.',
    };
  }
}
