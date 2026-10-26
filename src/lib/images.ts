/**
 * Registre des images locales.
 * Les contenus référencent une image par son chemin relatif à `src/assets/images/`.
 * Si le fichier existe, il est optimisé par Astro ; sinon, un visuel de substitution est affiché.
 */
import type { ImageMetadata } from 'astro';

const modules = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/images/**/*.{jpg,jpeg,png,webp,avif}',
  { eager: true },
);

const registry = new Map<string, ImageMetadata>();
for (const [path, mod] of Object.entries(modules)) {
  registry.set(path.replace('/src/assets/images/', ''), mod.default);
}

/** Retourne les métadonnées de l'image si le fichier existe, sinon `undefined`. */
export function resolveImage(src: string): ImageMetadata | undefined {
  return registry.get(src);
}

/** Liste des images réellement présentes (utile pour la documentation et les tests). */
export const availableImages = [...registry.keys()].sort();

// --- Logo ---------------------------------------------------------------
const brand = import.meta.glob<{ default: ImageMetadata }>('/src/assets/brand/*.{svg,png,webp}', {
  eager: true,
});

function findBrand(name: string): ImageMetadata | undefined {
  const entry = Object.entries(brand).find(([path]) => {
    const file = path.split('/').pop() ?? '';
    return file.replace(/\.(svg|png|webp)$/i, '') === name;
  });
  return entry?.[1].default;
}

/** Logo principal (`src/assets/brand/logo.svg|png|webp`). */
export const brandLogo = findBrand('logo');
/** Variante claire pour fonds sombres (`src/assets/brand/logo-clair.svg|png|webp`), sinon le logo principal. */
export const brandLogoLight = findBrand('logo-clair') ?? brandLogo;
