/** Isolated static UX sandbox. Never deploy this output to rahalxp.com. */
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, writeFileSync, cpSync, rmSync } from 'node:fs';
import { join } from 'node:path';

execFileSync(process.execPath, ['scripts/build-preview-artifact.mjs'], { stdio: 'inherit' });
const root = 'dist-staging';
rmSync(root, { recursive: true, force: true });
cpSync('dist-preview/artifact', root, { recursive: true });
const walk = dir => readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)]);
const guard = `<meta name="robots" content="noindex, nofollow, noarchive">
<meta http-equiv="Content-Security-Policy" content="connect-src 'none'; form-action 'none'; frame-src 'none'; object-src 'none'; base-uri 'self'">
<script>
window.fetch = async function(input, options) {
  const url = new URL(typeof input === 'string' ? input : input.url, location.href);
  if (options && options.method === 'POST' && url.hash === '#staging') {
    document.getElementById('test-notice').textContent = 'TEST : envoi simulé réussi. Aucune donnée transmise et aucune place réservée.';
    return new Response(JSON.stringify({ok:true}), {status:200, headers:{'Content-Type':'application/json'}});
  }
  throw new Error('Réseau désactivé dans la copie de test RAHAL.');
};
document.addEventListener('submit', function(event) { event.preventDefault(); }, true);
</script>
<style>.apercu-bandeau{display:none!important}#test-notice{background:#ffe3a8;color:#25231f;padding:12px 20px;text-align:center;font:600 14px/1.5 system-ui;position:relative;z-index:1000}</style>`;
const banner = '<div id="test-notice" role="status">RAHAL · ENVIRONNEMENT DE TEST — formulaires simulés, aucun email envoyé. Utiliser des données fictives.</div>';
let pages = 0;
for (const path of walk(root)) {
  if (!path.endsWith('.html')) continue;
  let html = readFileSync(path, 'utf8');
  html = html.replace(/<meta\b[^>]*name="robots"[^>]*>/gi, '')
    .replace(/<head>/i, '<head>' + guard)
    .replace(/(<body[^>]*>)/i, '$1' + banner)
    .replace(/\s(action|data-endpoint)="[^"]*"/g, ' $1="#staging"')
    .replace(/href="https:\/\/(?:tally\.so|buy\.stripe\.com|checkout\.stripe\.com)[^"]*"/g, 'href="#test-notice"');
  writeFileSync(path, html);
  pages++;
}
writeFileSync(join(root, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
writeFileSync(join(root, '_headers'), '/*\n  X-Robots-Tag: noindex, nofollow, noarchive\n  Content-Security-Policy: connect-src \'none\'; form-action \'none\'; frame-src \'none\'; object-src \'none\'; base-uri \'self\'\n');
console.log(`Staging sécurisé : ${pages} pages dans ${root}. Aucun serveur API inclus.`);
