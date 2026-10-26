/**
 * Génère l'image de partage par défaut (public/og/rahal.png, 1200×630)
 * et l'icône Apple (public/apple-touch-icon.png) à partir des couleurs et polices de la marque.
 * Usage : npm run og
 */
import { readFileSync, mkdirSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import sharp from 'sharp';

const require = createRequire(import.meta.url);
const opentype = require('opentype.js');

const toArrayBuffer = (buf) => buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
const loadFont = (pkgPath) => opentype.parse(toArrayBuffer(readFileSync(require.resolve(pkgPath))));

const manrope800 = loadFont('@fontsource/manrope/files/manrope-latin-800-normal.woff');
const manrope700 = loadFont('@fontsource/manrope/files/manrope-latin-700-normal.woff');
const cormorantItalic = loadFont('@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-italic.woff');

const COLORS = { ivoire: '#F7F3EB', encre: '#22211F', or: '#D3AB60', brun: '#806039', gris: '#686159' };

function textPath(font, text, x, y, size, options = {}) {
  const path = font.getPath(text, x, y, size, { kerning: true, ...options });
  return path.toPathData(2);
}

function contour(k, cx, cy, base, n = 28, seed = 1) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2;
    const r =
      base + k * 46 + Math.sin(3 * t + k * 0.9 + seed) * (14 + k * 3) + Math.sin(5 * t - k * 0.5 + seed * 2) * (7 + k * 1.5) + Math.cos(2 * t + k) * (10 + k * 2);
    pts.push([cx + Math.cos(t) * r * 1.35, cy + Math.sin(t) * r * 0.85]);
  }
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d + 'Z';
}

const W = 1200;
const H = 630;
const topo = Array.from({ length: 9 }, (_, k) => `<path d="${contour(k, 980, 380, 40, 28, 1.3)}"/>`).join('');

const LOGO = 'src/assets/brand/logo.png';
const hasLogo = existsSync(LOGO);
const wordmark = hasLogo ? '' : textPath(manrope800, 'RAHAL', 96, 330, 168, { letterSpacing: 0.06 });
const tagline = textPath(cormorantItalic, 'Apprendre. Essayer. Se dépasser.', 100, hasLogo ? 486 : 420, hasLogo ? 56 : 60);
const label = textPath(manrope700, 'VOYAGES EN PETIT GROUPE', 100, hasLogo ? 556 : 520, 22, { letterSpacing: 0.18 });

const sun = (cx, cy, r, color) => `
  <circle cx="${cx}" cy="${cy}" r="${r * 0.42}" fill="${color}"/>
  <g stroke="${color}" stroke-width="${r * 0.14}" stroke-linecap="round">
    ${Array.from({ length: 8 }, (_, i) => {
      const a = (i / 8) * Math.PI * 2;
      const x1 = cx + Math.cos(a) * r * 0.62, y1 = cy + Math.sin(a) * r * 0.62;
      const x2 = cx + Math.cos(a) * r, y2 = cy + Math.sin(a) * r;
      return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
    }).join('')}
  </g>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#F9F6F0"/>
      <stop offset="1" stop-color="#EFE7D8"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <g fill="none" stroke="${COLORS.brun}" stroke-width="1.2" opacity="0.16">${topo}</g>
  ${hasLogo ? '' : sun(120, 160, 34, COLORS.or) + `<path d="${wordmark}" fill="${COLORS.encre}"/>`}
  <rect x="100" y="${hasLogo ? 424 : 360}" width="64" height="3" rx="1.5" fill="${COLORS.or}"/>
  <path d="${tagline}" fill="${COLORS.encre}"/>
  <path d="${label}" fill="${COLORS.brun}"/>
</svg>`;

mkdirSync('public/og', { recursive: true });
const base = sharp(Buffer.from(svg));
if (hasLogo) {
  const logo = await sharp(LOGO).resize({ width: 600 }).toBuffer();
  await base.composite([{ input: logo, left: 88, top: 60 }]).png({ compressionLevel: 9 }).toFile('public/og/rahal.png');
} else {
  await base.png({ compressionLevel: 9 }).toFile('public/og/rahal.png');
}
await sharp(readFileSync('public/favicon.svg'), { density: 300 }).resize(180, 180).png().toFile('public/apple-touch-icon.png');
console.log(`Généré : public/og/rahal.png (${hasLogo ? 'avec le logo' : 'mot-symbole de secours'}) et public/apple-touch-icon.png`);
