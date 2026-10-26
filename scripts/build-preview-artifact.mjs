/**
 * Construit une version « aperçu » du site, publiable comme Artifact Claude (hébergement statique,
 * chemins relatifs, pas de serveur) : `node scripts/build-preview-artifact.mjs`.
 * Résultat dans dist-preview/artifact/ (index.html + fichiers d'appui) et dist-preview/files.json.
 */
import { execSync } from 'node:child_process';
import { readdirSync, statSync, readFileSync, writeFileSync, mkdirSync, copyFileSync, rmSync } from 'node:fs';
import { join, relative, dirname, posix } from 'node:path';

const OUT = 'dist-preview';
// Avec --artifact, la page d'accueil est réduite à son contenu (format Artifact Claude). Par défaut (GitHub Pages) : page complète.
const ARTIFACT_MODE = process.argv.includes('--artifact');
const CLIENT = join(OUT, 'client');
const ART = join(OUT, 'artifact');

execSync('npx astro build --config astro.preview.config.mjs', { stdio: 'inherit' });
rmSync(ART, { recursive: true, force: true });
mkdirSync(ART, { recursive: true });

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

const files = walk(CLIENT).map((p) => relative(CLIENT, p).split('\\').join('/'));
const pages = files.filter((f) => f.endsWith('.html') && f !== '404.html');

// Route -> fichier (ex. "/experiences/chine" -> "experiences/chine.html")
const routes = new Map();
for (const page of pages) {
  const route = page === 'index.html' ? '/' : '/' + page.replace(/\.html$/, '');
  routes.set(route, page);
}

const BANNER =
  '<div class="apercu-bandeau" role="note">Aperçu du site RAHAL — version de travail.</div>';
const BANNER_CSS =
  '<style>.apercu-bandeau{background:#22211f;color:#f7f3eb;font:600 .8rem/1.4 "Manrope Variable",Manrope,system-ui,sans-serif;text-align:center;padding:.55rem 1rem;letter-spacing:.01em}</style>';
const INTERCEPT =
  '<script>document.addEventListener("submit",function(e){var f=e.target;if(!f||!f.matches||!f.matches("form"))return;var a=f.getAttribute("action")||"";if(a.indexOf("api/")===-1&&a!=="#apercu")return;e.preventDefault();e.stopImmediatePropagation();var s=f.querySelector("[data-status]");if(s){s.textContent="Aperçu : ce formulaire sera actif sur le site en ligne.";s.className="form-status form-status--info";}},true);</script>';

function rewriteUrl(value, prefix) {
  if (!value.startsWith('/') || value.startsWith('//')) return value;
  const m = value.match(/^([^?#]*)(\?[^#]*)?(#.*)?$/);
  const path = m[1];
  const hash = m[3] ?? '';
  if (path.startsWith('/api/')) return '#apercu';
  const clean = path.length > 1 ? path.replace(/\/$/, '') : path;
  if (routes.has(clean)) return prefix + routes.get(clean) + hash;
  return prefix + path.slice(1) + hash;
}

function rewriteHtml(html, prefix) {
  html = html.replace(/\s(href|src|action)="([^"]*)"/g, (all, attr, val) => ` ${attr}="${rewriteUrl(val, prefix)}"`);
  html = html.replace(/\ssrcset="([^"]*)"/g, (all, val) => {
    const out = val
      .split(',')
      .map((entry) => {
        const [url, ...rest] = entry.trim().split(/\s+/);
        return [rewriteUrl(url, prefix), ...rest].join(' ');
      })
      .join(', ');
    return ` srcset="${out}"`;
  });
  html = html.replace(/<link rel="(canonical|sitemap)"[^>]*>/g, '');
  return html;
}

for (const page of pages) {
  const depth = page.split('/').length - 1;
  const prefix = depth === 0 ? '' : '../'.repeat(depth);
  let html = rewriteHtml(readFileSync(join(CLIENT, page), 'utf8'), prefix);
  const target = join(ART, page);
  mkdirSync(dirname(target), { recursive: true });

  if (page === 'index.html' && ARTIFACT_MODE) {
    // Page principale de l'artifact : sans <html>/<head>/<body> (ajoutés à la publication).
    const head = html.match(/<head>([\s\S]*?)<\/head>/i)?.[1] ?? '';
    const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? '';
    const keep = [];
    const tagRe = /<(link|script|style)\b[^>]*>(?:[\s\S]*?<\/\1>)?|<title>[\s\S]*?<\/title>/gi;
    for (const tag of head.match(tagRe) ?? []) {
      if (/^<title/i.test(tag)) continue;
      if (/rel="(canonical|sitemap)"/i.test(tag)) continue;
      keep.push(tag);
    }
    html = `<title>RAHAL</title>\n${keep.join('\n')}\n${BANNER_CSS}\n${INTERCEPT}\n${BANNER}\n${body}`;
  } else {
    html = html
      .replace(/<\/head>/i, `${BANNER_CSS}\n${INTERCEPT}\n</head>`)
      .replace(/(<body[^>]*>)/i, `$1\n${BANNER}`);
  }
  writeFileSync(target, html);
}

// Fichiers d'appui : CSS (chemins relatifs), JS, images, polices.
const supporting = {};
for (const f of files) {
  if (f.endsWith('.html')) {
    if (f !== 'index.html' && f !== '404.html') supporting[f] = f;
    continue;
  }
  if (/\.(xml|txt)$/.test(f)) continue; // sitemap / robots inutiles pour l'aperçu
  const target = join(ART, f);
  mkdirSync(dirname(target), { recursive: true });
  if (f.endsWith('.css')) {
    const css = readFileSync(join(CLIENT, f), 'utf8').replace(/\/(_astro|assets)\//g, '');
    writeFileSync(target, css);
  } else {
    copyFileSync(join(CLIENT, f), target);
  }
  supporting[f] = f;
}
writeFileSync(join(ART, '.nojekyll'), '');
writeFileSync(join(OUT, 'files.json'), JSON.stringify(supporting, null, 1));
const total = Object.keys(supporting).length;
const size = Object.keys(supporting).reduce((s, f) => s + statSync(join(ART, f)).size, 0);
console.log(`Aperçu prêt : index.html + ${total} fichiers d'appui (${(size / 1024 / 1024).toFixed(1)} Mo) dans ${ART}`);
