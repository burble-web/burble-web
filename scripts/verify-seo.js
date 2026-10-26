// scripts/verify-seo.js
const http = require('http');

function testUrl(path, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: 'localhost',
        port: 3000,
        path: path,
        method: options.method || 'GET',
        headers: options.headers || {},
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body,
          });
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

async function runTests() {
  console.log('--- STARTING SEO VERIFICATION SUITE ---\n');
  const results = [];

  // 1. Root /
  try {
    const res = await testUrl('/');
    const hasFloristSchema = res.body.includes('"@type":"Florist"');
    const hasWebSiteSchema = res.body.includes('"@type":"WebSite"');
    const hasCanonical = res.body.includes('rel="canonical"') && res.body.includes('https://burbleflowers.com/en');
    const hasHreflangEn = /hreflang="en"/i.test(res.body);
    const hasHreflangAr = /hreflang="ar"/i.test(res.body);
    const pass = res.statusCode === 200 && hasFloristSchema && hasWebSiteSchema && hasCanonical && hasHreflangEn && hasHreflangAr;
    results.push({
      test: '1. Root Homepage (/)',
      status: pass ? 'PASS' : 'FAIL',
      details: `Status ${res.statusCode}, Florist: ${hasFloristSchema}, WebSite: ${hasWebSiteSchema}, Canonical: ${hasCanonical}, Hreflang: ${hasHreflangEn && hasHreflangAr}`,
    });
  } catch (err) {
    results.push({ test: '1. Root Homepage (/)', status: 'ERROR', details: err.message });
  }

  // 2. Trailing slash normalization: /categories/hand-bouquets/ -> /categories/hand-bouquets
  try {
    const res = await testUrl('/categories/hand-bouquets/');
    const pass = res.statusCode === 308 && res.headers.location === '/categories/hand-bouquets';
    results.push({
      test: '2. Trailing slash 308 redirect (/categories/hand-bouquets/)',
      status: pass ? 'PASS' : 'FAIL',
      details: `Status ${res.statusCode}, Location: ${res.headers.location}`,
    });
  } catch (err) {
    results.push({ test: '2. Trailing slash 308 redirect', status: 'ERROR', details: err.message });
  }

  // 3. Legacy query redirect: /products?category=hand-bouquets -> /categories/hand-bouquets
  try {
    const res = await testUrl('/products?category=hand-bouquets');
    const pass = res.statusCode === 308 && res.headers.location === '/categories/hand-bouquets';
    results.push({
      test: '3. Legacy query category 308 redirect (/products?category=hand-bouquets)',
      status: pass ? 'PASS' : 'FAIL',
      details: `Status ${res.statusCode}, Location: ${res.headers.location}`,
    });
  } catch (err) {
    results.push({ test: '3. Legacy query category redirect', status: 'ERROR', details: err.message });
  }

  // 4. Redirect /categories -> /products
  try {
    const res = await testUrl('/categories');
    const pass = (res.statusCode === 308 || res.statusCode === 307) && res.headers.location === '/products';
    results.push({
      test: '4. /categories index redirect to /products',
      status: pass ? 'PASS' : 'FAIL',
      details: `Status ${res.statusCode}, Location: ${res.headers.location}`,
    });
  } catch (err) {
    results.push({ test: '4. /categories index redirect', status: 'ERROR', details: err.message });
  }

  // 5. Valid category page: /categories/hand-bouquets
  try {
    const res = await testUrl('/categories/hand-bouquets');
    const hasCollectionSchema = res.body.includes('"@type":"CollectionPage"');
    const hasBreadcrumbSchema = res.body.includes('"@type":"BreadcrumbList"');
    const hasCanonical = res.body.includes('https://burbleflowers.com/en/categories/hand-bouquets');
    const pass = res.statusCode === 200 && hasCollectionSchema && hasBreadcrumbSchema && hasCanonical;
    results.push({
      test: '5. Clean category route (/categories/hand-bouquets)',
      status: pass ? 'PASS' : 'FAIL',
      details: `Status ${res.statusCode}, CollectionSchema: ${hasCollectionSchema}, Breadcrumb: ${hasBreadcrumbSchema}, Canonical: ${hasCanonical}`,
    });
  } catch (err) {
    results.push({ test: '5. Clean category route', status: 'ERROR', details: err.message });
  }

  // 6. Valid nested subcategory: /categories/hand-bouquets/roses
  try {
    const res = await testUrl('/categories/hand-bouquets/roses');
    const hasBreadcrumbSchema = res.body.includes('"@type":"BreadcrumbList"');
    const hasSubcategoryBreadcrumb = res.body.includes('Roses') || res.body.includes('roses');
    const pass = res.statusCode === 200 && hasBreadcrumbSchema && hasSubcategoryBreadcrumb;
    results.push({
      test: '6. Clean subcategory route (/categories/hand-bouquets/roses)',
      status: pass ? 'PASS' : 'FAIL',
      details: `Status ${res.statusCode}, Breadcrumb: ${hasBreadcrumbSchema}`,
    });
  } catch (err) {
    results.push({ test: '6. Clean subcategory route', status: 'ERROR', details: err.message });
  }

  // 7. Non-existent category: /categories/this-does-not-exist -> 404 (NOT 200, NOT redirect to home)
  try {
    const res = await testUrl('/categories/this-does-not-exist');
    const pass = res.statusCode === 404;
    results.push({
      test: '7. Genuine 404 for nonexistent category slug',
      status: pass ? 'PASS' : 'FAIL',
      details: `Status ${res.statusCode} (Expected 404)`,
    });
  } catch (err) {
    results.push({ test: '7. Genuine 404 for nonexistent category', status: 'ERROR', details: err.message });
  }

  // 8. Arabic category page: /ar/categories/hand-bouquets
  try {
    const res = await testUrl('/ar/categories/hand-bouquets');
    const hasArabicCanonical = res.body.includes('https://burbleflowers.com/ar/categories/hand-bouquets');
    const hasArabicText = res.body.includes('باقات اليد') || res.body.includes('rtl');
    const pass = res.statusCode === 200 && hasArabicCanonical;
    results.push({
      test: '8. Arabic localized category page (/ar/categories/hand-bouquets)',
      status: pass ? 'PASS' : 'FAIL',
      details: `Status ${res.statusCode}, Arabic Canonical: ${hasArabicCanonical}, Arabic Text/RTL: ${hasArabicText}`,
    });
  } catch (err) {
    results.push({ test: '8. Arabic localized category page', status: 'ERROR', details: err.message });
  }

  // 9. Robots.txt
  try {
    const res = await testUrl('/robots.txt');
    const hasSitemap = res.body.includes('Sitemap: https://burbleflowers.com/sitemap.xml');
    const disallowsAdmin = res.body.includes('Disallow: /admin');
    const pass = res.statusCode === 200 && hasSitemap && disallowsAdmin;
    results.push({
      test: '9. Robots.txt validation',
      status: pass ? 'PASS' : 'FAIL',
      details: `Status ${res.statusCode}, Sitemap directive: ${hasSitemap}, Disallow admin: ${disallowsAdmin}`,
    });
  } catch (err) {
    results.push({ test: '9. Robots.txt', status: 'ERROR', details: err.message });
  }

  // 10. Sitemap.xml
  try {
    const res = await testUrl('/sitemap.xml');
    const hasXmlDeclaration = res.body.includes('<?xml version="1.0" encoding="UTF-8"?>') || res.body.includes('<urlset');
    const hasEnUrls = res.body.includes('https://burbleflowers.com/en');
    const hasArUrls = res.body.includes('https://burbleflowers.com/ar');
    const hasCategoryUrls = res.body.includes('/categories/hand-bouquets');
    const pass = res.statusCode === 200 && hasXmlDeclaration && hasEnUrls && hasArUrls && hasCategoryUrls;
    results.push({
      test: '10. Multilingual XML Sitemap (/sitemap.xml)',
      status: pass ? 'PASS' : 'FAIL',
      details: `Status ${res.statusCode}, XML: ${hasXmlDeclaration}, EN URLs: ${hasEnUrls}, AR URLs: ${hasArUrls}, Categories in sitemap: ${hasCategoryUrls}`,
    });
  } catch (err) {
    results.push({ test: '10. Multilingual XML Sitemap', status: 'ERROR', details: err.message });
  }

  // 11. Brand Assets
  try {
    const resIco = await testUrl('/favicon.ico');
    const resOg = await testUrl('/opengraph-image.png');
    const resManifest = await testUrl('/manifest.webmanifest');
    const pass = resIco.statusCode === 200 && resOg.statusCode === 200 && resManifest.statusCode === 200;
    results.push({
      test: '11. Brand Assets (/favicon.ico, /opengraph-image.png, /manifest.webmanifest)',
      status: pass ? 'PASS' : 'FAIL',
      details: `Favicon: ${resIco.statusCode}, OG: ${resOg.statusCode}, Manifest: ${resManifest.statusCode}`,
    });
  } catch (err) {
    results.push({ test: '11. Brand Assets', status: 'ERROR', details: err.message });
  }

  // 12. Product Detail Page Structured Data (Product + Offer in QAR)
  try {
    const sitemapRes = await testUrl('/sitemap.xml');
    const match = sitemapRes.body.match(/\/products\/([a-z0-9-]+)/);
    if (match) {
      const prodSlug = match[1];
      const prodRes = await testUrl(`/products/${prodSlug}`);
      const hasProductSchema = prodRes.body.includes('"@type":"Product"');
      const hasOfferSchema = prodRes.body.includes('"@type":"Offer"');
      const hasQar = prodRes.body.includes('"priceCurrency":"QAR"');
      const hasBreadcrumb = prodRes.body.includes('"@type":"BreadcrumbList"');
      const pass = prodRes.statusCode === 200 && hasProductSchema && hasOfferSchema && hasQar && hasBreadcrumb;
      results.push({
        test: `12. Product Detail Page (/products/${prodSlug})`,
        status: pass ? 'PASS' : 'FAIL',
        details: `Status ${prodRes.statusCode}, ProductSchema: ${hasProductSchema}, OfferSchema: ${hasOfferSchema}, Currency QAR: ${hasQar}, Breadcrumb: ${hasBreadcrumb}`,
      });
    } else {
      results.push({ test: '12. Product Detail Page', status: 'SKIP', details: 'No product slug found in sitemap' });
    }
  } catch (err) {
    results.push({ test: '12. Product Detail Page', status: 'ERROR', details: err.message });
  }

  console.log('\n--- VERIFICATION RESULTS TABLE ---');
  results.forEach((r) => {
    console.log(`[${r.status}] ${r.test} -> ${r.details}`);
  });

  const allPassed = results.every((r) => r.status === 'PASS');
  console.log(`\nOverall Result: ${allPassed ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}`);
  process.exit(allPassed ? 0 : 1);
}

runTests();
