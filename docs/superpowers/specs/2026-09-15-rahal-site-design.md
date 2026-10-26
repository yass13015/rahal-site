# RAHAL — site vitrine : décisions de conception

Date : 2026-09-15. Ce document fige les choix faits pour construire le site à partir du brief (voir la demande d'origine). Le brief est très détaillé ; les points ci-dessous couvrent uniquement ce qu'il laissait ouvert.

## 1. Contexte et contraintes constatées

- Aucun projet existant dans `~/Documents` pour RAHAL : on part de zéro.
- Aucun asset RAHAL trouvé sur le disque (ni logo, ni photos). Le site est donc construit avec des **emplacements d'images** documentés et des visuels de substitution sobres et de marque (dégradés sable/ivoire, lignes topographiques, petit soleil). Dès qu'un fichier est déposé au bon endroit, il remplace automatiquement le visuel de substitution au prochain build.
- Node.js n'était pas installé : installation via Homebrew.
- Référence QamarTrip consultée : destination phare mise en avant dès l'accueil, cartes de séjours avec durée/dates/prix, page programme structurée par étapes puis inclus/non inclus, page « À propos » à la première personne, FAQ par thèmes avec formulaire de contact. On reprend l'organisation, pas les textes ni les assets.

## 2. Stack retenue

**Astro 5 + TypeScript**, pages pré-rendues en HTML statique, deux routes API rendues à la demande (`/api/programme`, `/api/contact`) via l'adaptateur Node standalone.

Pourquoi :
- Vraies pages, vraies URLs, HTML statique rapide, zéro JavaScript par défaut (priorité mobile / Instagram).
- Composants réutilisables (`.astro`) pour menu, pied de page, cartes, sections de séjour.
- Optimisation d'images intégrée (`astro:assets`, formats modernes, dimensions adaptées, lazy loading).
- Routes API côté serveur : la clé Brevo ne quitte jamais le serveur.
- Facile à héberger (Node, ou Vercel/Netlify en changeant une ligne d'adaptateur).

Alternatives écartées : Next.js (trop lourd pour un site vitrine), HTML statique sans générateur (duplication du menu/pied de page, ajout d'expérience pénible), WordPress/Elementor (hors périmètre « réellement développé »).

## 3. Source de contenu unique

- `src/content/site.ts` : marque, navigation, pied de page, coordonnées (email, Instagram, WhatsApp) facultatives, textes des pages Accueil / À propos / FAQ-Contact / légales.
- `src/content/experiences/*.ts` : une expérience par fichier, typée (`Experience`). `src/content/experiences/index.ts` liste celles à publier.
- Champs facultatifs (dates, prix, taille de groupe, école, hébergement, inclus/non inclus, conditions, FAQ, PDF du programme, IDs Brevo) : **une section vide n'est pas affichée** ; les informations essentielles absentes affichent une formulation honnête (« Dates à venir », « Tarif communiqué prochainement »).
- Images référencées par chemin relatif à `src/assets/images/`. Un registre (`import.meta.glob`) vérifie la présence du fichier au build ; sinon, visuel de substitution.
- Logo : `src/assets/brand/logo.svg` (ou `.png`) s'il existe, sinon mot-symbole typographique temporaire « RAHAL » + petit soleil.

## 4. Pages et routes

| URL | Fichier | Notes |
|---|---|---|
| `/` | `src/pages/index.astro` | Hero DISCIPLINE, concept, expériences, fondateur, CTA |
| `/experiences` | `src/pages/experiences/index.astro` | Intro + cartes des expériences publiées |
| `/experiences/chine` | `src/pages/experiences/[slug].astro` | Généré depuis les expériences publiées |
| `/a-propos` | `src/pages/a-propos.astro` | Récit à la première personne |
| `/faq-contact` | `src/pages/faq-contact.astro` | FAQ (accordéons `<details>`) + formulaire |
| `/confidentialite`, `/mentions-legales` | pages légales | Contenu à fournir ; texte d'attente honnête |
| `/404` | `src/pages/404.astro` | Page d'erreur de marque |
| `/api/programme`, `/api/contact` | `src/pages/api/*.ts` | POST uniquement, rendu serveur |

## 5. Formulaires et Brevo

- Amélioration progressive : formulaires HTML valides (fonctionnent sans JS avec redirection), enrichis par un petit script (états chargement / erreur / succès en place, sans rechargement).
- Validation côté client (HTML5 + script) **et** côté serveur. Champ pot-de-miel anti-spam.
- `/api/programme` : crée ou met à jour le contact Brevo (attributs `PRENOM`, `WHATSAPP`, `EXPERIENCE`, `EXPERIENCE_NOM`, `CONSENTEMENT_WHATSAPP`, `SOURCE`), l'ajoute à la liste Brevo de l'expérience si configurée, envoie l'email de programme (template Brevo si configuré, sinon email simple avec le lien du PDF si un PDF est configuré). Répond `{ ok, programmeUrl }`.
- `/api/contact` : envoie un email transactionnel Brevo vers l'adresse de réception configurée, avec `replyTo` = visiteur.
- **Sans clé Brevo configurée, l'API répond 503 et le formulaire affiche un message d'erreur honnête** : aucune confirmation n'est simulée.
- Secrets uniquement dans `.env` côté serveur (`BREVO_API_KEY`, expéditeur, adresse de réception). Les IDs de liste/template ne sont pas secrets et vivent dans le contenu de l'expérience.

## 6. Direction artistique appliquée

- Tokens CSS (couleurs, typos, espacements, rayons) dans `src/styles/global.css`. Aucun framework CSS.
- Manrope (variable) et Cormorant Garamond auto-hébergées via Fontsource (pas d'appel à Google Fonts, meilleure confidentialité).
- Texture papier très légère (bruit SVG en data URI, opacité faible) et lignes topographiques discrètes (motif SVG) en fond de certaines sections.
- Animations : apparition douce au défilement uniquement ; désactivées avec `prefers-reduced-motion`.
- Doré utilisé pour : petit soleil, filets, labels, focus. Boutons principaux noir encre / texte ivoire.

## 7. Vérifications prévues avant livraison

- `astro build` sans erreur ; aperçu Node lancé et chaque URL ouverte directement (y compris après actualisation) ; 404.
- Mobile 375 px : menu, bouton fixe « Recevoir le programme », absence de débordement horizontal (mesure `scrollWidth`).
- Accordéons au clavier, focus visibles, labels de formulaire, contrastes de la palette (calculés).
- Formulaires : validation, état d'erreur sans clé Brevo, état de succès avec un faux serveur Brevo local (`BREVO_API_URL` surchargée pour le test).
