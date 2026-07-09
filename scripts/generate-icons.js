const sharp = require('sharp');
const path = require('path');

const SRC = path.join(__dirname, '..', 'public', 'favicon.png');
const OUT = path.join(__dirname, '..', 'public');
const BG = '#0a0a0a';

async function makeIcon(size, mark, outFile) {
  const markBuf = await sharp(SRC)
    .resize(mark, mark, { fit: 'inside' })
    .toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: BG,
    },
  })
    .composite([{ input: markBuf, gravity: 'center' }])
    .png()
    .toFile(path.join(OUT, outFile));
}

async function main() {
  // Standard icons: mark fills ~62% of canvas
  await makeIcon(192, Math.round(192 * 0.62), 'icon-192.png');
  await makeIcon(512, Math.round(512 * 0.62), 'icon-512.png');

  // Maskable icons: content must sit inside the safe-zone circle (~80% diameter),
  // so keep the mark smaller relative to canvas.
  await makeIcon(192, Math.round(192 * 0.45), 'icon-maskable-192.png');
  await makeIcon(512, Math.round(512 * 0.45), 'icon-maskable-512.png');

  // Apple touch icon (no transparency, iOS adds its own rounding)
  await makeIcon(180, Math.round(180 * 0.62), 'apple-touch-icon.png');

  console.log('Icons generated in public/');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
