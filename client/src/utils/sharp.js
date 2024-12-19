const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sourceDir = path.resolve(__dirname, '../../public/images/');
const targetDir = path.resolve(__dirname, '../../public/images/hero/optimized');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const optimizeImage = async (imagePath) => {
  try {
    const filename = path.basename(imagePath, path.extname(imagePath));
    const ext = path.extname(imagePath).toLowerCase();

    if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
      return;
    }

    console.log(`\nOptimizing ${filename}${ext}...`);

    await sharp(imagePath)
      .resize(1200, null, {
        withoutEnlargement: true
      })
      .toFormat('png', { quality: 80 })
      .toFile(path.resolve(targetDir, `${filename}-large.webp`));

    await sharp(imagePath)
      .resize(800, null, {
        withoutEnlargement: true
      })
      .toFormat('png', { quality: 75 })
      .toFile(path.resolve(targetDir, `${filename}-medium.webp`));

    await sharp(imagePath)
      .resize(400, null, {
        withoutEnlargement: true
      })
      .toFormat('png', { quality: 70 })
      .toFile(path.resolve(targetDir, `${filename}-small.webp`));

    console.log(`✓ Successfully optimized ${filename}${ext}`);

  } catch (err) {
    console.error(`× Error optimizing ${imagePath}:`, err.message);
  }
};

const optimizeAllImages = async () => {
  try {
    console.log('Starting image optimization...');

    const files = fs.readdirSync(sourceDir);

    const imageFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
    });

    for (const file of imageFiles) {
      await optimizeImage(path.join(sourceDir, file));
    }

    console.log('\n✨ All images have been optimized!');

  } catch (err) {
    console.error('\n× Error during optimization:', err.message);
    process.exit(1);
  }
};

optimizeAllImages();