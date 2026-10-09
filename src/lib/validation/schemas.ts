import { z } from 'zod';

export const checkoutSchema = z.object({
  customer_name: z.string().min(2, 'Name must be at least 2 characters'),
  customer_email: z.string().email('Please enter a valid email address'),
  customer_phone: z.string().min(8, 'Please enter a valid contact phone number'),
  delivery_address: z.string().min(5, 'Delivery address is required'),
  city: z.string().min(2, 'City is required').default('Doha'),
  district: z.string().optional(),
  pincode: z.string().optional(),
  delivery_notes: z.string().optional(),
  payment_method: z.enum(['whatsapp', 'cod']),
  locale: z.enum(['en', 'ar']).optional().default('en'),
});

export const productSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  slug: z.string().min(2, 'Slug is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be greater than 0'),
  compare_at_price: z.number().nullable().optional(),
  category_id: z.string().nullable().optional(),
  is_featured: z.boolean().default(false),
  is_new_arrival: z.boolean().default(false),
  stock_status: z.enum(['in_stock', 'out_of_stock']).default('in_stock'),
  active: z.boolean().default(true),
  main_image_url: z.string().min(1, 'Main image URL is required'),
  hover_image_url: z.string().nullable().optional(),
  sort_order: z.number().default(0),
});

export const categorySchema = z.object({
  name: z.string().min(2, 'Category name is required'),
  slug: z.string().min(2, 'Slug is required'),
  description: z.string().optional(),
  image_url: z.string().optional(),
  sort_order: z.number().default(0),
  active: z.boolean().default(true),
});
