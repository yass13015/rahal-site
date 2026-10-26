/**
 * Prépare une photo pour le site : orientation corrigée, recadrage au ratio de son emplacement,
 * redimensionnement, métadonnées (dont GPS) supprimées.
 * Usage : node scripts/prepare-photo.cjs <source.jpg> <destination.jpg> <ratio ex. 4:3 | native> <position verticale en %> [largeur]
 * Avec `native`, la photo garde son cadrage d'origine (le cadrage se règle ensuite avec `position`).
 */
const sharp = require('sharp');
async function prepare(src, dest, ratio, posY = 50, width = 1600) {
  const [rw, rh] = ratio === 'native' ? [0, 0] : ratio.split(':').map(Number);
  const base = sharp(src).rotate();
  const { data, info } = await base.toBuffer({ resolveWithObject: true });
  if (ratio === 'native') {
    return sharp(data).resize({ width: Math.min(width, info.width) }).jpeg({ quality: 82, mozjpeg: true }).toFile(dest);
  }
  let cw = info.width, ch = Math.round((info.width * rh) / rw);
  if (ch > info.height) { ch = info.height; cw = Math.round((info.height * rw) / rh); }
  const left = Math.round((info.width - cw) / 2);
  const top = Math.round(((info.height - ch) * posY) / 100);
  const out = await sharp(data).extract({ left, top, width: cw, height: ch }).resize({ width: Math.min(width, cw) }).jpeg({ quality: 82, mozjpeg: true }).toFile(dest);
  return out;
}
module.exports = { prepare };
if (require.main === module) {
  const [src, dest, ratio, posY, width] = process.argv.slice(2);
  prepare(src, dest, ratio, Number(posY ?? 50), Number(width ?? 1600)).then((o) => console.log(`${dest} : ${o.width}x${o.height}, ${(o.size / 1024).toFixed(0)} Ko`));
}
