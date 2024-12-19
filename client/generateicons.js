const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputImage = path.join(__dirname, 'public/images/hero-section1.png');
const outputDir = path.join(__dirname, 'public/hero/optimized');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateCircularIcon(size) {
  try {
    const circleShape = Buffer.from(`
      <svg width="${size}" height="${size}">
        <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="black"/>
      </svg>
    `);

    await sharp(inputImage)
      .resize(size, size, {
        fit: 'cover',
        position: 'center'
      })
      .composite([{
        input: circleShape,
        blend: 'dest-in'
      }])
      .png()
      .toFile(path.join(outputDir, `icon-${size}x${size}.webp`));

    console.log(`✓ Generated ${size}x${size} icon`);
  } catch (error) {
    console.error(`✗ Error generating ${size}x${size} icon:`, error);
  }
}

async function generateAllIcons() {
  console.log('Mulai generate icons...');
  console.log('Input image:', inputImage);
  console.log('Output directory:', outputDir);

  try {
    if (!fs.existsSync(inputImage)) {
      throw new Error(`File input tidak ditemukan: ${inputImage}`);
    }

    await Promise.all(sizes.map((size) => generateCircularIcon(size)));
    console.log('\nSemua icon berhasil di-generate! 🎉');
    console.log(`Icons tersimpan di: ${outputDir}`);
  } catch (error) {
    console.error('Terjadi error:', error);
  }
}

generateAllIcons();