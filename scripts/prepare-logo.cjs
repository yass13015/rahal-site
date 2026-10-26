// Usage : node scripts/prepare-logo.cjs <logo-source.png> src/assets/brand
// Détourage du logo RAHAL (fond blanc -> transparent), variante claire, disque doré isolé.
const sharp = require('sharp');
const path = require('path');
const src = process.argv[2];
const outDir = process.argv[3];

(async () => {
  const { data, info } = await sharp(src).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const px = (x, y) => { const i = (y * W + x) * 3; return [data[i], data[i + 1], data[i + 2]]; };

  // 1) Disque doré : boîte englobante des pixels dorés.
  let gx0 = W, gy0 = H, gx1 = 0, gy1 = 0, gn = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const [r, g, b] = px(x, y);
    if (r > 150 && r - b > 50 && r >= g && g >= b) { gn++; if (x < gx0) gx0 = x; if (x > gx1) gx1 = x; if (y < gy0) gy0 = y; if (y > gy1) gy1 = y; }
  }
  const cx = (gx0 + gx1) / 2, cy = (gy0 + gy1) / 2, R = Math.max(gx1 - gx0, gy1 - gy0) / 2;
  console.log(`disque doré : centre (${cx.toFixed(0)}, ${cy.toFixed(0)}), rayon ${R.toFixed(0)}, ${gn} px dorés`);

  // 2) Alpha = distance au blanc (canal min) ; couleurs dé-multipliées ; intérieur du disque opaque.
  const rgba = Buffer.alloc(W * H * 4);
  const light = Buffer.alloc(W * H * 4);
  let bx0 = W, by0 = H, bx1 = 0, by1 = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const [r, g, b] = px(x, y);
    const d = Math.hypot(x - cx, y - cy);
    const o = (y * W + x) * 4;
    let a, rr, gg, bb;
    if (d <= R - 1.5) { a = 255; rr = r; gg = g; bb = b; }
    else {
      a = 255 - Math.min(r, g, b);
      if (a < 6) a = 0;
      const un = (c) => Math.max(0, Math.min(255, Math.round(((c - (255 - a)) * 255) / a)));
      rr = a ? un(r) : 0; gg = a ? un(g) : 0; bb = a ? un(b) : 0;
    }
    rgba[o] = rr; rgba[o + 1] = gg; rgba[o + 2] = bb; rgba[o + 3] = a;
    // Variante claire : traits en ivoire, disque inchangé.
    const inDisk = d <= R + 1;
    light[o] = inDisk ? rr : 247; light[o + 1] = inDisk ? gg : 243; light[o + 2] = inDisk ? bb : 235; light[o + 3] = a;
    if (a > 10) { if (x < bx0) bx0 = x; if (x > bx1) bx1 = x; if (y < by0) by0 = y; if (y > by1) by1 = y; }
  }
  const pad = Math.round((bx1 - bx0) * 0.03);
  const crop = { left: Math.max(0, bx0 - pad), top: Math.max(0, by0 - pad), width: Math.min(W, bx1 + pad) - Math.max(0, bx0 - pad), height: Math.min(H, by1 + pad) - Math.max(0, by0 - pad) };
  console.log('recadrage :', crop, `ratio ${(crop.width / crop.height).toFixed(2)}`);

  const mk = (buf) => sharp(buf, { raw: { width: W, height: H, channels: 4 } });
  await mk(rgba).extract(crop).png({ compressionLevel: 9 }).toFile(path.join(outDir, 'logo.png'));
  await mk(light).extract(crop).png({ compressionLevel: 9 }).toFile(path.join(outDir, 'logo-clair.png'));
  // Disque doré seul (motif / icône).
  const m = 4;
  await mk(rgba).extract({ left: Math.round(cx - R - m), top: Math.round(cy - R - m), width: Math.round(2 * R + 2 * m), height: Math.round(2 * R + 2 * m) }).png().toFile(path.join(outDir, 'soleil.png'));
  console.log('écrit : logo.png, logo-clair.png, soleil.png');
})();
