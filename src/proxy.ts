import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { isValidLocale, DEFAULT_LOCALE, LOCALE_COOKIE_NAME } from '@/lib/i18n/config';

const VALID_CATEGORY_SLUGS = [
  'hand-bouquets',
  'flowers-in-vase',
  'premium-collections',
  'gift-hampers',
  'combos',
  'diy-flowers',
];

const VALID_FLOWER_SLUGS = [
  'roses',
  'lilies',
  'tulips',
  'peonies',
  'carnations',
  'orchids',
  'hydrangeas',
  'mixed-flowers',
];

export async function proxy(request: NextRequest) {
  const { pathname, search, searchParams } = request.nextUrl;

  // 1. URL Trailing Slash Normalization (Choose no trailing slash convention)
  if (pathname.length > 1 && pathname.endsWith('/')) {
    const normalizedUrl = request.nextUrl.clone();
    normalizedUrl.pathname = pathname.slice(0, -1);
    return NextResponse.redirect(normalizedUrl, { status: 308 });
  }

  // 2. Admin Route Protection (Supabase Auth)
  if (pathname.startsWith('/admin')) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (url && !url.includes('placeholder.supabase.co') && pathname !== '/admin/login') {
      let response = NextResponse.next({
        request: {
          headers: request.headers,
        },
      });

      const supabase = createServerClient(url, anonKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      });

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = '/admin/login';
        return NextResponse.redirect(redirectUrl);
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = '/admin/login';
        return NextResponse.redirect(redirectUrl);
      }

      return response;
    }

    return NextResponse.next();
  }

  // Determine user cookie locale if present
  const cookieLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value;
  const preferredLocale = isValidLocale(cookieLocale) ? cookieLocale : DEFAULT_LOCALE;

  // 3. Legacy Query-based Category URL Redirects
  // e.g. /products?category=hand-bouquets -> /categories/hand-bouquets
  // or /en/products?category=hand-bouquets -> /en/categories/hand-bouquets
  const isProductsListing =
    pathname === '/products' ||
    pathname === '/en/products' ||
    pathname === '/ar/products';

  if (isProductsListing && searchParams.has('category')) {
    const catSlug = searchParams.get('category')?.trim().toLowerCase();
    if (catSlug && VALID_CATEGORY_SLUGS.includes(catSlug)) {
      const isAr = pathname.startsWith('/ar');
      const isEn = pathname.startsWith('/en');
      const prefix = isAr ? '/ar' : isEn ? '/en' : '';

      const remainingParams = new URLSearchParams(searchParams);
      remainingParams.delete('category');

      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = `${prefix}/categories/${catSlug}`;
      redirectUrl.search = remainingParams.toString() ? `?${remainingParams.toString()}` : '';

      return NextResponse.redirect(redirectUrl, { status: 308 });
    }
  }

  // 3b. Validate Category and Subcategory Slugs (Genuine 404 for invalid category landing pages)
  const catSingleMatch = pathname.match(/^(?:\/(?:en|ar))?\/categories\/([^\/]+)$/);
  if (catSingleMatch) {
    const slug = catSingleMatch[1];
    if (!VALID_CATEGORY_SLUGS.includes(slug)) {
      return new NextResponse(
        '<!DOCTYPE html><html><head><title>404 - Category Not Found</title><meta name="robots" content="noindex, nofollow"/></head><body style="font-family:sans-serif;text-align:center;padding:50px;"><h1>404 - Category Not Found</h1><p>The requested category does not exist.</p><a href="/products">View All Flowers</a></body></html>',
        {
          status: 404,
          headers: {
            'content-type': 'text/html; charset=utf-8',
            'x-robots-tag': 'noindex, nofollow',
          },
        }
      );
    }
  }

  const catNestedMatch = pathname.match(/^(?:\/(?:en|ar))?\/categories\/([^\/]+)\/([^\/]+)$/);
  if (catNestedMatch) {
    const parentSlug = catNestedMatch[1];
    const subSlug = catNestedMatch[2];
    if (!VALID_CATEGORY_SLUGS.includes(parentSlug) || !VALID_FLOWER_SLUGS.includes(subSlug)) {
      return new NextResponse(
        '<!DOCTYPE html><html><head><title>404 - Subcategory Not Found</title><meta name="robots" content="noindex, nofollow"/></head><body style="font-family:sans-serif;text-align:center;padding:50px;"><h1>404 - Subcategory Not Found</h1><p>The requested subcategory does not exist.</p><a href="/products">View All Flowers</a></body></html>',
        {
          status: 404,
          headers: {
            'content-type': 'text/html; charset=utf-8',
            'x-robots-tag': 'noindex, nofollow',
          },
        }
      );
    }
  }

  // 4. Handle Localized URLs: /en/... or /ar/...
  const isEnRoute = pathname === '/en' || pathname.startsWith('/en/');
  const isArRoute = pathname === '/ar' || pathname.startsWith('/ar/');

  if (isEnRoute || isArRoute) {
    const locale = isArRoute ? 'ar' : 'en';
    const rawPath = pathname.replace(/^\/(en|ar)/, '') || '/';

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-burble-locale', locale);
    requestHeaders.set('x-burble-pathname', pathname);

    const rewriteUrl = new URL(rawPath, request.url);
    rewriteUrl.search = search;

    const response = NextResponse.rewrite(rewriteUrl, {
      request: {
        headers: requestHeaders,
      },
    });

    // Sync cookie with URL locale
    response.cookies.set(LOCALE_COOKIE_NAME, locale, {
      path: '/',
      sameSite: 'lax',
      maxAge: 31536000,
    });

    return response;
  }

  // 5. Root Homepage '/'
  if (pathname === '/') {
    // If the visitor specifically has Arabic saved in cookie, direct to Arabic homepage
    if (preferredLocale === 'ar') {
      const arUrl = request.nextUrl.clone();
      arUrl.pathname = '/ar';
      return NextResponse.redirect(arUrl, { status: 307 });
    }

    // Default homepage serves English
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-burble-locale', 'en');
    requestHeaders.set('x-burble-pathname', '/');

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // 6. Direct Unprefixed Public Storefront Routes
  // e.g. /categories/..., /products/..., /about, /blog/..., /cart, /checkout
  // Serve directly with language headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-burble-locale', preferredLocale);
  requestHeaders.set('x-burble-pathname', pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static build assets)
     * - _next/image (image optimization endpoints)
     * - api routes
     * - static files: favicon, icon, images, manifest, robots, sitemap
     */
    '/((?!_next/static|_next/image|api|favicon\\.ico|icon\\.png|apple-icon\\.png|opengraph-image\\.png|manifest\\.webmanifest|robots\\.txt|sitemap\\.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp4|webm|woff2?|css|js)$).*)',
  ],
};
