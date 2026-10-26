// Configuration de build pour l'aperçu partageable (Artifact) : pages en fichiers .html, sortie séparée.
import base from './astro.config.mjs';

export default {
  ...base,
  outDir: './dist-preview',
  // Le service d'artifacts réserve les dossiers commençant par « _ » : on renomme _astro en assets.
  build: { ...(base.build ?? {}), format: 'file', assets: 'assets' },
};
