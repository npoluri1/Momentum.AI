const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SIZES = [48, 72, 96, 128, 144, 152, 192, 384, 512, 1024];
const SVG_PATH = path.join(__dirname, '..', 'frontend', 'public', 'icons', 'icon.svg');
const OUTPUT_DIR = path.join(__dirname, '..', 'frontend', 'public', 'icons');
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'frontend', 'public', 'screenshots');

async function generateIcons() {
  console.log('🚀 Generating PWA icons...\n');

  // Ensure output directories exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }

  // Read the SVG
  const svgBuffer = fs.readFileSync(SVG_PATH);
  console.log(`✅ Read source SVG: ${SVG_PATH}`);

  // Generate each size
  for (const size of SIZES) {
    const outputPath = path.join(OUTPUT_DIR, `icon-${size}x${size}.png`);
    
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);

    const fileSize = fs.statSync(outputPath).size;
    const fileSizeKB = (fileSize / 1024).toFixed(1);
    console.log(`  ✅ ${size}x${size} → ${fileSizeKB} KB`);
  }

  // Generate maskable versions (192 and 512 with padding for safe zone)
  for (const size of [192, 512]) {
    const maskablePath = path.join(OUTPUT_DIR, `icon-${size}x${size}.png`);
    const outputPath = path.join(OUTPUT_DIR, `icon-${size}x${size}-maskable.png`);
    
    // Create maskable: resize to 70% of the target size, center on a bg canvas
    const innerSize = Math.round(size * 0.7);
    const offset = Math.round((size - innerSize) / 2);

    // For maskable, we need to create a composite
    // First create a background canvas
    const bg = await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 26, g: 26, b: 46, alpha: 1 }
      }
    }).png().toBuffer();

    // Resize the icon to 80% size for safe zone
    const resizedIcon = await sharp(svgBuffer)
      .resize(innerSize, innerSize)
      .png()
      .toBuffer();

    // Composite the icon centered on the background
    await sharp(bg)
      .composite([{
        input: resizedIcon,
        top: offset,
        left: offset,
      }])
      .png()
      .toFile(outputPath);

    const fileSize = fs.statSync(outputPath).size;
    const fileSizeKB = (fileSize / 1024).toFixed(1);
    console.log(`  ✅ ${size}x${size} (maskable) → ${fileSizeKB} KB`);
  }

  // Generate screenshots
  console.log('\n📸 Generating screenshots...');

  // Desktop screenshot (1920x1080) - dark workspace dashboard
  await generateDesktopScreenshot();
  
  // Mobile screenshot (390x844) - dark mobile dashboard
  await generateMobileScreenshot();

  console.log('\n✨ All PWA assets generated successfully!');
}

async function generateDesktopScreenshot() {
  const width = 1920;
  const height = 1080;

  // Create the screenshot by composing elements
  const bg = await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 10, g: 10, b: 15, alpha: 1 }
    }
  }).png().toBuffer();

  // Sidebar background (dark surface)
  const sidebarWidth = 280;
  const sidebar = await sharp({
    create: {
      width: sidebarWidth,
      height,
      channels: 4,
      background: { r: 14, g: 14, b: 20, alpha: 1 }
    }
  }).png().toBuffer();

  // Topbar
  const topbarHeight = 56;
  const topbar = await sharp({
    create: {
      width: width - sidebarWidth,
      height: topbarHeight,
      channels: 4,
      background: { r: 14, g: 14, b: 20, alpha: 0.95 }
    }
  }).png().toBuffer();

  // Stat card background
  const cardW = 320;
  const cardH = 140;
  const statCard = await sharp({
    create: {
      width: cardW,
      height: cardH,
      channels: 4,
      background: { r: 20, g: 20, b: 30, alpha: 0.6 }
    }
  }).png().toBuffer();

  // Compose everything
  const layers = [
    { input: bg, top: 0, left: 0 },
    { input: sidebar, top: 0, left: 0 },
    { input: topbar, top: 0, left: sidebarWidth },
  ];

  // Add stat cards in a row
  const cardPositions = [
    { top: 80, left: sidebarWidth + 32 },
    { top: 80, left: sidebarWidth + 32 + cardW + 16 },
    { top: 80, left: sidebarWidth + 32 + 2 * (cardW + 16) },
    { top: 80, left: sidebarWidth + 32 + 3 * (cardW + 16) },
  ];

  for (const pos of cardPositions) {
    layers.push({ input: statCard, top: pos.top, left: pos.left });
  }

  const outputPath = path.join(SCREENSHOTS_DIR, 'desktop-dashboard.png');
  await sharp(bg)
    .composite(layers)
    .png()
    .toFile(outputPath);

  const fileSize = fs.statSync(outputPath).size;
  console.log(`  ✅ Desktop screenshot (${width}x${height}) → ${(fileSize / 1024 / 1024).toFixed(1)} MB`);
}

async function generateMobileScreenshot() {
  const width = 390;
  const height = 844;

  const bg = await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 10, g: 10, b: 15, alpha: 1 }
    }
  }).png().toBuffer();

  // Status bar
  const statusBar = await sharp({
    create: {
      width,
      height: 48,
      channels: 4,
      background: { r: 10, g: 10, b: 15, alpha: 0.95 }
    }
  }).png().toBuffer();

  // Stat card
  const cardW = 160;
  const cardH = 100;
  const statCard = await sharp({
    create: {
      width: cardW,
      height: cardH,
      channels: 4,
      background: { r: 20, g: 20, b: 30, alpha: 0.6 }
    }
  }).png().toBuffer();

  // Bottom nav bar
  const navBar = await sharp({
    create: {
      width,
      height: 64,
      channels: 4,
      background: { r: 14, g: 14, b: 20, alpha: 0.95 }
    }
  }).png().toBuffer();

  const outputPath = path.join(SCREENSHOTS_DIR, 'mobile-dashboard.png');
  await sharp(bg)
    .composite([
      { input: statusBar, top: 0, left: 0 },
      { input: statCard, top: 72, left: 16 },
      { input: statCard, top: 72, left: 16 + cardW + 12 },
      { input: statCard, top: 72 + cardH + 12, left: 16 },
      { input: statCard, top: 72 + cardH + 12, left: 16 + cardW + 12 },
      { input: navBar, top: height - 64, left: 0 },
    ])
    .png()
    .toFile(outputPath);

  const fileSize = fs.statSync(outputPath).size;
  console.log(`  ✅ Mobile screenshot (${width}x${height}) → ${(fileSize / 1024).toFixed(1)} KB`);
}

generateIcons().catch(err => {
  console.error('❌ Error generating icons:', err);
  process.exit(1);
});
