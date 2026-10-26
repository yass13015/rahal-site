/**
 * Extrait le symbole « h + soleil » du logo (lettre h et disque doré), sans le redessiner :
 * on garde uniquement les pixels des deux formes concernées (composantes connexes).
 * Usage : node scripts/extract-brand-mark.cjs  → src/assets/brand/h-soleil.png et h-soleil-clair.png
 */
const sharp = require('sharp');

async function components(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const label = new Int32Array(W * H).fill(-1);
  const comps = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (data[(y * W + x) * 4 + 3] < 40 || label[y * W + x] !== -1) continue;
    const id = comps.length, stack = [[x, y]];
    let n = 0, x0 = x, x1 = x, y0 = y, y1 = y;
    label[y * W + x] = id;
    while (stack.length) {
      const [cx, cy] = stack.pop(); n++;
      x0 = Math.min(x0, cx); x1 = Math.max(x1, cx); y0 = Math.min(y0, cy); y1 = Math.max(y1, cy);
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const nx = cx + dx, ny = cy + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const k = ny * W + nx;
        if (label[k] === -1 && data[k * 4 + 3] >= 40) { label[k] = id; stack.push([nx, ny]); }
      }
    }
    comps.push({ id, n, x0, x1, y0, y1 });
  }
  return { data, W, H, label, comps };
}

(async () => {
  // La géométrie est identique dans logo.png et logo-clair.png : on repère les formes sur logo.png.
  const ref = await components('src/assets/brand/logo.png');
  const big = ref.comps.filter((c) => c.n > 150);
  // Le soleil : la plus haute forme (dans la moitié supérieure). Le h : la forme la plus haute en hauteur totale.
  const sun = big.filter((c) => c.y1 < ref.H / 2).sort((a, b) => b.n - a.n)[0];
  const h = big.slice().sort((a, b) => (b.y1 - b.y0) - (a.y1 - a.y0))[0];
  const keep = new Set([sun.id, h.id]);
  const box = { x0: Math.min(sun.x0, h.x0), x1: Math.max(sun.x1, h.x1), y0: Math.min(sun.y0, h.y0), y1: Math.max(sun.y1, h.y1) };
  // Petites taches de pinceau situées dans le cadre du h (hors des autres lettres).
  const others = big.filter((c) => !keep.has(c.id));
  for (const c of ref.comps) {
    if (c.n > 150 || keep.has(c.id)) continue;
    const cx = (c.x0 + c.x1) / 2, cy = (c.y0 + c.y1) / 2;
    const inBox = cx >= h.x0 - 4 && cx <= h.x1 + 4 && cy >= h.y0 - 4 && cy <= h.y1 + 4;
    const nearOther = others.some((o) => cx >= o.x0 - 6 && cx <= o.x1 + 6 && cy >= o.y0 - 6 && cy <= o.y1 + 6);
    if (inBox && !nearOther) keep.add(c.id);
  }
  const pad = 6;
  const crop = { left: Math.max(0, box.x0 - pad), top: Math.max(0, box.y0 - pad) };
  crop.width = Math.min(ref.W, box.x1 + pad + 1) - crop.left;
  crop.height = Math.min(ref.H, box.y1 + pad + 1) - crop.top;

  for (const [src, out] of [['src/assets/brand/logo.png', 'src/assets/brand/h-soleil.png'], ['src/assets/brand/logo-clair.png', 'src/assets/brand/h-soleil-clair.png']]) {
    const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const pixels = Buffer.from(data);
    for (let i = 0; i < info.width * info.height; i++) if (!keep.has(ref.label[i])) pixels[i * 4 + 3] = 0;
    await sharp(pixels, { raw: { width: info.width, height: info.height, channels: 4 } }).extract(crop).png({ compressionLevel: 9 }).toFile(out);
    console.log(`${out} : ${crop.width}x${crop.height}`);
  }
})();
