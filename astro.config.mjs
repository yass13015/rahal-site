// @ts-check
import { defineConfig, envField } from 'astro/config';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';

// L'URL publique du site est lue dans .env (PUBLIC_SITE_URL). Elle sert aux
// balises de partage (Open Graph), au sitemap et aux URLs canoniques.
const { PUBLIC_SITE_URL } = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), 'PUBLIC_');

export default defineConfig({
  site: PUBLIC_SITE_URL || 'https://rahal.example',
  // Toutes les pages sont pré-rendues en HTML statique. Seules les routes
  // /api/* (formulaires) sont rendues à la demande grâce à l'adaptateur Node.
  output: 'static',
  adapter: node({ mode: 'standalone' }),
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/api/') && !page.endsWith('/404/') && !page.endsWith('/404'),
    }),
  ],
  image: {
    // Images responsives : srcset généré automatiquement pour chaque <Image>.
    layout: 'constrained',
    responsiveStyles: false,
    objectFit: 'cover',
  },
  env: {
    schema: {
      // Secrets côté serveur uniquement (jamais envoyés au navigateur).
      BREVO_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      BREVO_API_URL: envField.string({ context: 'server', access: 'secret', optional: true, default: 'https://api.brevo.com/v3' }),
      BREVO_SENDER_EMAIL: envField.string({ context: 'server', access: 'secret', optional: true }),
      BREVO_SENDER_NAME: envField.string({ context: 'server', access: 'secret', optional: true, default: 'RAHAL' }),
      CONTACT_TO_EMAIL: envField.string({ context: 'server', access: 'secret', optional: true }),
      PUBLIC_SITE_URL: envField.string({ context: 'client', access: 'public', optional: true }),
    },
  },
  compressHTML: true,
  trailingSlash: 'never',
  build: { format: 'directory' },
});
