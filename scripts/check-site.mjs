/**
 * Contrôle du site construit (dist/client) : liens internes, ancres, références d'accessibilité,
 * identifiants en double, un seul <h1> par page, textes alternatifs, espaces insécables des montants. Usage : npm run build && node scripts/check-site.mjs
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = 'dist/client';
const walk = (d) => readdirSync(d).flatMap((n) => (statSync(join(d, n)).isDirectory() ? walk(join(d, n)) : [join(d, n)]));
const files = walk(ROOT);
const pages = files.filter((f) => f.endsWith('.html'));
const routeOf = (f) => {
  const r = '/' + relative(ROOT, f).replace(/\\/g, '/').replace(/index\.html$/, '').replace(/\.html$/, '');
  return r.length > 1 ? r.replace(/\/$/, '') : '/';
};
const byRoute = new Map(pages.map((f) => [routeOf(f), readFileSync(f, 'utf8')]));
const idsOf = (html) => [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
const problems = [];

for (const [route, html] of byRoute) {
  const ids = idsOf(html);
  const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dup.length) problems.push(`${route} : identifiants en double ${[...new Set(dup)].join(', ')}`);
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (route !== '/404' && h1 !== 1) problems.push(`${route} : ${h1} balises <h1>`);
  for (const m of html.matchAll(/aria-(?:labelledby|describedby|controls)="([^"]+)"/g)) {
    for (const id of m[1].split(/\s+/)) if (!ids.includes(id)) problems.push(`${route} : aria vers #${id} introuvable`);
  }
  // Typographie des montants dans le texte visible : « 1 890 € » doit utiliser des espaces insécables.
  const text = html
    .replace(/<(script|style)[\s\S]*?<\/\1>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, '\u00a0');
  for (const m of text.matchAll(/\d \d{3}(?!\d)|\d €|\u00a0\u00a0/g)) {
    problems.push(`${route} : espace sécable ou double dans « ${text.slice(Math.max(0, m.index - 20), m.index + 12).trim()} »`);
  }
  // Attributs de dessin SVG : une espace insécable les rend illisibles par le navigateur.
  for (const m of html.matchAll(/\s(viewBox|d|points|transform)="([^"]*)"/g)) {
    if (/[\u00a0\u202f]/.test(m[2])) problems.push(`${route} : attribut de dessin SVG ${m[1]} contenant une espace insécable`);
  }
  for (const m of html.matchAll(/<img\b[^>]*>/g)) if (!/\salt(="|[\s/>])/.test(m[0])) problems.push(`${route} : image sans alt`);
  for (const m of html.matchAll(/<iframe\b[^>]*>/g)) if (!/\stitle="[^"]+"/.test(m[0])) problems.push(`${route} : iframe sans titre`);
  for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const url = m[1];
    if (/^(https?:|mailto:|tel:|data:|\/\/)/.test(url)) continue;
    const [pathPart, hash] = url.split('#');
    const path = pathPart.split('?')[0];
    let targetHtml = html;
    if (path) {
      if (!path.startsWith('/')) { problems.push(`${route} : lien relatif inattendu ${url}`); continue; }
      const clean = path.length > 1 ? path.replace(/\/$/, '') : '/';
      if (byRoute.has(clean)) targetHtml = byRoute.get(clean);
      else if (existsSync(join(ROOT, path))) targetHtml = null;
      else if (path.startsWith('/api/')) targetHtml = null;
      else { problems.push(`${route} : lien cassé ${url}`); continue; }
    }
    if (hash && targetHtml && !idsOf(targetHtml).includes(hash)) problems.push(`${route} : ancre #${hash} introuvable (${url})`);
  }
}
console.log(`${byRoute.size} pages contrôlées.`);
if (problems.length) {
  console.log(`${problems.length} problème(s) :`);
  for (const p of [...new Set(problems)]) console.log(' - ' + p);
  process.exitCode = 1;
} else console.log('Aucun problème : liens, ancres, aria, identifiants, h1, alt et titres d’iframe corrects.');
