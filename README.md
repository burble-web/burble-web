# Burble — Small-Scale Flower E-Commerce Application

A luxury flower e-commerce application inspired by high-end floral boutique design systems, built with **Next.js 16 App Router**, **TypeScript**, **Tailwind CSS v4**, **Supabase**, **Cloudinary**, and **Brevo**.

---

## 🌟 Key Features

- 🎨 **Visual Design**: Faithful implementation of the provided luxury design reference, featuring warm ivory/plum tones, elegant serif display typography (`Cormorant Garamond`), rounded card geometry, and generous whitespace.
- 📱 **Mobile-First & Responsive Layout**: Intentionally designed responsive states for 320px–1600px screens. Features mobile drawer menu, portrait mobile hero composition, and horizontal swipeable product rails.
- 🛒 **Streamlined Customer Ordering**:
  - Browse Products & Category Filters
  - Instant Cart Drawer & Local Wishlist (localStorage)
  - **Option A**: Order via WhatsApp (human-readable pre-filled deep-link)
  - **Option B**: Cash on Delivery (COD) with server-side price validation
- ⚙️ **Postgres Database & RLS**: Single foundational SQL schema (`supabase/schema.sql`) with atomic stored procedure `create_order` to eliminate price manipulation.
- 📧 **Brevo Email Notifications**: Lightweight transactional emails for customer COD order confirmation and admin alerts.
- 🖼️ **Cloudinary Media Optimization**: Direct browser upload, width-aware image loader, and zero wasteful image transformations.
- 🛡️ **Admin Portal & CMS**:
  - Protected Admin Dashboard (`/admin`) with orders, products, categories, CMS layout, and settings management.
  - Public admin signup disabled (manual Supabase Auth creation).
- ⚡ **Free-Tier Optimized**: Zero polling, static/ISR storefront, server component rendering, cookie-less storefront data fetching.

---

## 🛠️ Technology Stack

| Tier | Technology |
|---|---|
| **Framework** | Next.js 16.4 (App Router, Turbopack, React 19) |
| **Styling** | Tailwind CSS v4 |
| **Language** | TypeScript (Strict Mode) |
| **Database & Auth** | Supabase PostgreSQL & Supabase Auth |
| **Media Delivery** | Cloudinary CDN |
| **Transactional Email** | Brevo REST API v3 |
| **Deployment** | Vercel |

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 20.9.0 or higher
- npm 10+

### 2. Environment Setup
Copy `.env.example` to `.env.local` and populate your credentials:

```bash
cp .env.example .env.local
```

Example credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=1234567890
CLOUDINARY_API_SECRET=your_secret

BREVO_API_KEY=xkeysib-...
BREVO_SENDER_EMAIL=orders@burbleflowers.com
BREVO_SENDER_NAME="Burble Flowers"

NEXT_PUBLIC_WHATSAPP_NUMBER=97400000000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_NOTIFICATION_EMAIL=admin@burbleflowers.com
ORDER_RPC_SECRET=burble_secure_order_secret_2026
```

### 3. Database Initial Setup (Supabase)
1. Open your Supabase project dashboard.
2. Go to the **SQL Editor**.
3. Copy the contents of `supabase/schema.sql` and execute the query.
4. To create your Admin user:
   - Go to **Authentication -> Users** in Supabase dashboard.
   - Click **Add User -> Create User** (e.g. `admin@burbleflowers.com`).
   - Run this SQL statement to grant admin role:
     ```sql
     INSERT INTO public.profiles (id, email, role, full_name)
     VALUES ('<YOUR_SUPABASE_USER_UUID>', 'admin@burbleflowers.com', 'admin', 'Store Admin');
     ```

### 4. Local Development
Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Free-Tier Optimization Strategy

1. **Static Storefront Data**: Storefront pages render as static/ISR components. Unauthenticated users do not create Supabase auth sessions or invoke client-side database listeners.
2. **Atomic Postgres Order RPC**: Order creation runs inside Postgres procedure `create_order`, preventing price tampering while performing validation in a single database round-trip.
3. **Brevo REST API**: Emails are dispatched asynchronously via lightweight HTTP `fetch` calls without heavy Node SDK dependencies. Failures are logged without interrupting customer order creation.
4. **Cloudinary Custom Loader**: Bypasses Vercel Image Optimization quota by delivering images directly through Cloudinary (`f_auto,q_auto,w_*`).

---

## 🔒 Security Summary

- RLS enabled on all Supabase tables.
- Public users have read-only access to active products, categories, and published CMS content.
- Admin routes (`/admin/*`) require authenticated Supabase session with `role = 'admin'` verified server-side.
- Service role key is **NEVER** exposed on the client bundle.

---

## 📄 License
Privately developed for Burble Flowers. All rights reserved.
