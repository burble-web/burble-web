const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function generateAssets() {
  const root = path.resolve(__dirname, '..');
  const plumBg = { r: 56, g: 30, b: 40, alpha: 1 }; // #381E28

  const logoWhitePath = path.join(root, 'public', 'logo-white.png');

  // 1. icon.png (512x512)
  const logoWhiteResized = await sharp(logoWhitePath)
    .resize({ width: 380, fit: 'contain' })
    .toBuffer();

  const icon512 = await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: plumBg,
    },
  })
    .composite([{ input: logoWhiteResized, gravity: 'center' }])
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(root, 'public', 'icon.png'), icon512);
  console.log('Generated public/icon.png (512x512)');

  // 2. apple-icon.png (180x180)
  const appleLogoResized = await sharp(logoWhitePath)
    .resize({ width: 140, fit: 'contain' })
    .toBuffer();

  await sharp({
    create: {
      width: 180,
      height: 180,
      channels: 4,
      background: plumBg,
    },
  })
    .composite([{ input: appleLogoResized, gravity: 'center' }])
    .png()
    .toFile(path.join(root, 'public', 'apple-icon.png'));
  console.log('Generated public/apple-icon.png (180x180)');

  // 3. favicon.ico (32x32 png)
  const favicon32 = await sharp(icon512)
    .resize(32, 32)
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(root, 'public', 'favicon.ico'), favicon32);
  console.log('Generated public/favicon.ico (32x32)');

  // 4. opengraph-image.png (1200x630)
  const ogLogo = await sharp(logoWhitePath)
    .resize({ width: 500, fit: 'contain' })
    .toBuffer();

  const svgText = Buffer.from(`
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#2B131E" />
          <stop offset="50%" stop-color="#3E1E2D" />
          <stop offset="100%" stop-color="#1F0C15" />
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#grad)" />
      <rect x="30" y="30" width="1140" height="570" rx="24" fill="none" stroke="#8F5570" stroke-opacity="0.3" stroke-width="1.5" />
      <text x="600" y="410" font-family="serif" font-size="34" font-weight="bold" fill="#F9F4F0" text-anchor="middle" letter-spacing="2">
        LUXURY FRESH FLOWERS &amp; HANDCRAFTED BOUQUETS
      </text>
      <text x="600" y="460" font-family="sans-serif" font-size="22" fill="#E3B5C7" text-anchor="middle" letter-spacing="1">
        زهور طبيعية فاخرة • توصيل سريع في نفس اليوم في قطر
      </text>
      <text x="600" y="510" font-family="sans-serif" font-size="16" fill="#C59CAE" text-anchor="middle" letter-spacing="3">
        DOHA • LUSAIL • QATAR | BURBLEFLOWERS.COM
      </text>
    </svg>
  `);

  await sharp(svgText)
    .composite([{ input: ogLogo, top: 140, left: 350 }])
    .png()
    .toFile(path.join(root, 'public', 'opengraph-image.png'));
  console.log('Generated public/opengraph-image.png (1200x630)');

  // 5. manifest.webmanifest
  const manifest = {
    name: 'Burble Flowers Qatar | زهور بيربل قطر',
    short_name: 'Burble Flowers',
    description: 'Handcrafted luxury fresh flower bouquets and bespoke arrangements in Qatar.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FBF9F5',
    theme_color: '#381E28',
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
  fs.writeFileSync(path.join(root, 'public', 'manifest.webmanifest'), JSON.stringify(manifest, null, 2));
  console.log('Generated public/manifest.webmanifest');
}

generateAssets().catch((err) => {
  console.error(err);
  process.exit(1);
});
