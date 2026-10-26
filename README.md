# RAHAL — site vitrine

Site vitrine de RAHAL, marque de voyages en petit groupe : **Apprendre. Essayer. Se dépasser.**
Première expérience : **DISCIPLINE — Chine** (initiation au kung-fu).

Construit avec [Astro](https://astro.build) (pages HTML statiques, formulaires traités côté serveur), sans framework CSS, entièrement en français, priorité au mobile.

---

## 0. Dépôt et aperçu en ligne

- Code source : https://github.com/usroroanto/rahal-site
- Aperçu du site (sans serveur, formulaires inactifs, mis à jour automatiquement à chaque push sur `main` par le workflow `.github/workflows/pages.yml`) : https://usroroanto.github.io/rahal-site/

L'aperçu est construit par `node scripts/build-preview-artifact.mjs` (chemins relatifs, bandeau d'information). Le vrai site se déploie comme indiqué au §6.

---

## 1. Lancer le projet

Prérequis : **Node.js 22.12 ou plus récent** (le site a été construit avec Node 26) et npm.

```bash
npm install          # installe les dépendances
npm run dev          # serveur de développement : http://localhost:4321
npm run build        # construit le site dans dist/
npm start            # lance le site construit (http://localhost:4321)
npm run check        # vérifie les types et les fichiers .astro
npm run og           # régénère l'image de partage par défaut (public/og/rahal.png)
```

Copier `.env.example` en `.env` et renseigner les variables (voir la section Brevo). Le fichier `.env` n'est jamais versionné.

Pages :

| URL | Contenu |
|---|---|
| `/` | Accueil |
| `/experiences` | Nos expériences |
| `/experiences/chine` | DISCIPLINE — Chine |
| `/a-propos` | L'esprit RAHAL |
| `/faq-contact` | FAQ et contact |
| `/confidentialite`, `/mentions-legales` | Pages légales (contenu à fournir) |
| `/api/programme`, `/api/contact` | Routes serveur des formulaires (POST uniquement) |

---

## 2. Structure du projet

```
src/
  content/                ← TOUT le contenu modifiable est ici
    site.ts               ← nom, navigation, coordonnées, pied de page
    types.ts              ← modèle d'une expérience (documenté)
    experiences/
      chine.ts            ← contenu du séjour DISCIPLINE — Chine
      index.ts            ← liste des expériences publiées
    pages/
      accueil.ts          ← textes de l'accueil
      experiences.ts      ← textes de la page « Nos expériences »
      a-propos.ts         ← récit de Yassine
      faq-contact.ts      ← questions / réponses et formulaire de contact
      legal.ts            ← pages légales
  assets/
    brand/                ← logo (logo.svg / logo.png, logo-clair.svg pour fond sombre)
    images/               ← photos (voir §3)
  components/             ← composants réutilisables (menu, pied de page, cartes, sections…)
  layouts/Base.astro      ← gabarit commun : métadonnées, polices, en-tête, pied de page
  pages/                  ← une page = une URL
  lib/                    ← registre d'images, client Brevo, validation des formulaires
  styles/global.css       ← palette, typographies, boutons, utilitaires
public/                   ← fichiers servis tels quels (favicon, robots.txt, image OG, PDF des programmes)
scripts/generate-og.mjs   ← génération de l'image de partage
docs/superpowers/specs/   ← décisions de conception
```

---

## 3. Modifier les contenus et les images

### Textes
Chaque page a son fichier dans `src/content/pages/`. Les textes sont de simples chaînes de caractères : modifier, enregistrer, le site se met à jour (`npm run dev`) ou se reconstruit (`npm run build`).

Coordonnées, Instagram, WhatsApp : dans `src/content/site.ts` (`contact`). **Un champ vide est simplement masqué** (pied de page, page contact).

Typographie française : les espaces avant `? ! : ;` et à l'intérieur des guillemets sont des espaces insécables dans les fichiers de contenu (évite un `?` seul en début de ligne).

### Photos
Déposer les fichiers dans `src/assets/images/` avec **exactement** ces noms (JPG, PNG ou WebP, largeur conseillée 2 400 px minimum pour les grands visuels) :

Photos en place (voyage de Yassine en Chine, juillet 2026, converties depuis les originaux HEIC, recadrées au format de leur emplacement) :

| Fichier | Photo d'origine | Utilisation |
|---|---|---|
| `chine/entrainement.jpg` | IMG_7452 · Yassine de dos, en tenue, devant un temple près de Tengzhou | Carte du voyage et fond flouté de « Nos expériences » |
| `chine/muraille.jpg` | IMG_2308 · la Muraille à Mutianyu | Fond du « prochain départ » (accueil) |
| `chine/terrasse-kungfu.jpg` | IMG_2774 · entraînement sur une terrasse aux toits dorés | Grande photo d'ouverture de la page Chine et image de partage |
| `chine/avec-le-maitre.jpg` | IMG_2754 · Yassine et le maître devant le temple | Accueil, pilier « Apprendre sur place » |
| `chine/shanghai-perle.jpg` | IMG_3315 · la Perle de l'Orient au crépuscule | Accueil, pilier « Explorer pour de vrai » |
| `chine/compagnons.jpg` | IMG_2707 · deux élèves sur une passerelle | Accueil, pilier « Le vivre ensemble » |
| `chine/decouvrir.jpg` | IMG_2305 · la Muraille dans la vallée | Page Chine, « Découvrir autrement » |
| `chine/zone-de-confort.jpg` | IMG_7505 · chemin rocheux vers l'entraînement | Page Chine, « Sortir de sa zone de confort » |
| `chine/shanghai-rue.jpg` | IMG_7724 · rue de Shanghai et Perle de l'Orient | Page Chine, « Vivre l'expérience ensemble » |
| `chine/etape-pekin.jpg` | IMG_2275 · la Muraille entre deux créneaux | Programme, étape Pékin |
| `chine/maitre-escaliers.jpg` | IMG_2780 · le maître descend les escaliers du temple | Programme, étape Kung-fu à Tengzhou |
| `chine/etape-shanghai.jpg` | IMG_3328 · Lujiazui au crépuscule | Programme, étape Shanghai |
| `chine/sentier.jpg` | IMG_2697 · pratiquante sur un sentier de pierre | Page Chine, questions « Avant de te lancer » |
| `chine/porte-shaolin.jpg` | IMG_2465 · porte illuminée de nuit | Page Chine, bandeau final « Prêt(e) à vivre l'expérience ? » |
| `chine/escaliers-temple.jpg` | IMG_7472 · Yassine monte l'escalier d'un temple | Page d'inscription, carte récapitulative |
| `chine/glycines.jpg` | IMG_2680 · allée de glycines | « Nos expériences », liste d'attente |
| `chine/dragon-cascade.jpg` | IMG_2696 · dragon doré et cascade | FAQ / Contact, à côté des questions |
| `yassine/portrait.jpg` | IMG_7144 · Yassine dans une arche de la Muraille | Portrait de « L'esprit RAHAL » et du mot du fondateur (accueil) |
| `yassine/apprendre.jpg` | IMG_7552 · Yassine guidé par le maître, bâton en main | « Je n'ai jamais voyagé pour cocher des lieux » |
| `yassine/chine-2.jpg` | IMG_7500 · sur le chemin de l'école de kung-fu | « Un rêve d'enfant, pris au sérieux » |
| `yassine/chine-3.jpg` | IMG_2287 · compagnon de route sur la Muraille | « Parce qu'on ose plus à plusieurs » |

Les photos s'affichent sans légende (demande de Yassine) ; leur texte alternatif décrit ce qu'elles montrent.

Pour remplacer une photo : convertir l'original (`sips -s format jpeg photo.HEIC --out photo.jpg` sur Mac), puis `node scripts/prepare-photo.cjs photo.jpg src/assets/images/<fichier>.jpg native 50 1600` (`native` garde le cadrage d'origine ; on peut aussi imposer un ratio, ex. `4:3`, et la position verticale du cadrage en %). Le script supprime les métadonnées : les coordonnées GPS ne sont jamais publiées. Les cadrages se règlent avec `position` et `mobilePosition` dans les fichiers de contenu.


Tant qu'un fichier manque, le site affiche un **visuel de substitution** de marque (dégradé sable, lignes topographiques). Dès que le fichier est déposé, il est optimisé automatiquement (formats WebP, plusieurs tailles, chargement différé sous le premier écran).

Cadrage mobile / ordinateur : chaque image du contenu a `position` (ordinateur) et `mobilePosition` (mobile), valeurs CSS `object-position` (ex. `center 40%`, `35% center`). Le texte alternatif (`alt`) est obligatoire.

### Logo
Le logo est en place dans `src/assets/brand/` :
- `source/rahal-logo-original.png` : fichier d'origine (fond blanc, récupéré depuis le formulaire Tally de la marque).
- `logo.png` : logo détouré (fond transparent), utilisé dans l'en-tête et l'image de partage.
- `logo-clair.png` : même logo avec les traits en ivoire pour le pied de page sombre (formes et disque doré inchangés).
- `soleil.png` : le disque doré isolé, disponible comme motif.

Pour repartir d'un nouveau fichier source : `node scripts/prepare-logo.cjs <fichier.png> src/assets/brand` régénère les trois fichiers, puis `npm run og` régénère l'image de partage. Un fichier `logo.svg` vectoriel, s'il existe un jour, sera utilisé en priorité (même nom, même dossier).

Le petit disque doré du logo sert de motif graphique sur tout le site (puces, décor, favicon). Le favicon (`public/favicon.svg`) et l'icône Apple reprennent ce disque sur fond ivoire.

### Symbole « h + soleil »
Le h du logo et son soleil doré, extraits du logo sans être redessinés (`node scripts/extract-brand-mark.cjs` → `src/assets/brand/h-soleil.png` et `h-soleil-clair.png`). Il s'affiche avec le composant `BrandMark` (`variant="light"` sur fond sombre) partout où le site utilisait un pictogramme soleil.

### Image de partage (réseaux sociaux)
- Par défaut : `public/og/rahal.png`, générée par `npm run og`.
- Page Chine : sa grande photo d'ouverture (`chine/terrasse-kungfu.jpg`) est utilisée automatiquement (recadrée en 1200×630). Les autres pages utilisent l’image par défaut.

---

## 4. Ajouter une expérience

1. Copier `src/content/experiences/chine.ts` vers `src/content/experiences/<slug>.ts` (ex. `japon.ts`).
2. Renseigner les champs (tous documentés dans `src/content/types.ts`). Les champs facultatifs non renseignés sont masqués ; dates, durée, prix affichent une formulation d'attente tant qu'ils sont vides.
   - `status` : `'a-venir'`, `'demandes-ouvertes'` ou `'complet'` (affiché tel quel).
   - `published: true` pour la rendre visible.
   - `programmeUrl` : chemin du PDF déposé dans `public/programmes/` (ex. `/programmes/japon.pdf`), affiché après une demande réussie.
   - `brevo.listId` / `brevo.templateId` : voir §5.
3. Ajouter les photos dans `src/assets/images/<slug>/`.
4. Dans `src/content/experiences/index.ts`, importer le fichier et l'ajouter au tableau `all`.
5. Si elle doit devenir l'expérience mise en avant sur l'accueil : la placer en premier dans le tableau (`featuredExperience` = première expérience publiée) et adapter `navCta` dans `site.ts`.

La page `/experiences/<slug>`, la carte sur l'accueil et sur `/experiences`, le sitemap et les métadonnées sont générés automatiquement. Avec plusieurs expériences, les cartes passent en grille.

Exemple de programme par étapes (avec détail jour par jour dépliable) :

```ts
programme: {
  intro: 'Le séjour alterne entraînements, exploration et temps partagés.',
  steps: [
    {
      kicker: 'Jours 1 à 3',
      title: 'Arrivée et premiers pas',
      text: 'Accueil du groupe, installation et première séance.',
      image: { src: 'chine/entrainement.jpg', alt: 'Première séance d’entraînement.' },
      days: [
        { title: 'Jour 1', text: 'Arrivée, rencontre du groupe, dîner ensemble.' },
        { title: 'Jour 2', text: 'Première séance d’entraînement le matin, découverte du quartier.' },
      ],
    },
  ],
},
```

---

## 5. Connecter Brevo (demandes de programme) et le formulaire de contact

Les deux formulaires envoient leurs données à des routes serveur (`src/pages/api/programme.ts`, `src/pages/api/contact.ts`). La clé Brevo ne quitte jamais le serveur.

### Configuration
Dans `.env` (copie de `.env.example`) :

| Variable | Rôle |
|---|---|
| `BREVO_API_KEY` | Clé API Brevo (Paramètres → Clés API). **Sans elle, les formulaires affichent un message d'indisponibilité** : rien n'est simulé. |
| `BREVO_SENDER_EMAIL` / `BREVO_SENDER_NAME` | Expéditeur validé dans Brevo (Expéditeurs & IP). Nécessaire pour l'email de programme sans template et pour le formulaire de contact. |
| `CONTACT_TO_EMAIL` | Adresse qui reçoit les messages du formulaire de contact. |
| `PUBLIC_SITE_URL` | URL publique du site (liens absolus, sitemap, image de partage). |

### Dans Brevo
1. Créer les **attributs de contact** (Contacts → Paramètres → Attributs) : `PRENOM` (texte), `WHATSAPP` (texte), `EXPERIENCE` (texte, slug), `EXPERIENCE_NOM` (texte), `CONSENTEMENT_WHATSAPP` (booléen), `SOURCE` (texte).
2. Créer une **liste par expérience** (ex. « Programme — Chine ») et reporter son identifiant dans `brevo.listId` du fichier de l'expérience.
3. Facultatif : créer un **template transactionnel** d'envoi du programme et reporter son identifiant dans `brevo.templateId`. Paramètres disponibles dans le template : `{{ params.PRENOM }}`, `{{ params.EXPERIENCE }}`, `{{ params.PAYS }}`, `{{ params.PROGRAMME_URL }}`.
   Sans template, un email simple est envoyé depuis l'expéditeur configuré, avec le lien du PDF si `programmeUrl` est renseigné.

### Comportement
- Demande de programme : le contact est créé ou mis à jour (`updateEnabled`) avec l'expérience concernée, ajouté à la liste, puis l'email est envoyé. Réponse au visiteur : confirmation + bouton « Consulter le programme » si un PDF est configuré.
- Contact : email envoyé à `CONTACT_TO_EMAIL`, avec l'adresse du visiteur en `replyTo`.
- Validation des champs côté navigateur **et** côté serveur, champ pot-de-miel anti-robots, aucune confirmation sans réussite réelle de l'envoi.
- Sans JavaScript, les formulaires fonctionnent quand même (envoi classique puis retour sur la page avec l'état affiché).

### Formulaires : contact, liste d'attente et demande d'inscription
Les trois formulaires du site envoient leurs réponses par email à **rahal.experience@gmail.com** via [FormSubmit](https://formsubmit.co), un service gratuit qui fonctionne sans serveur (donc aussi sur GitHub Pages) :
- le formulaire de contact (page FAQ / Contact) ;
- la liste d'attente des prochaines destinations (page « Nos expériences ») ;
- la **demande d'inscription** au voyage en Chine, sur la page `/experiences/chine/inscription` (en trois étapes, reprises du formulaire Tally). Les questions se modifient dans `src/content/experiences/chine.ts`, rubrique `registration` : le nom de chaque champ devient une ligne du tableau reçu par email.

L'adresse de réception se change dans `src/content/site.ts` (`forms.email`).

**Activation obligatoire, une seule fois** : au tout premier envoi, FormSubmit envoie à rahal.experience@gmail.com un email « Activate Form ». Il faut cliquer sur le lien ; avant cela, aucun message n'est transmis et le visiteur voit un message d'erreur (avec, pour l'inscription, un lien vers le formulaire Tally de secours et l'adresse email). Le plus simple : envoyer soi-même un message de test depuis la page FAQ / Contact juste après la mise en ligne, puis cliquer sur le lien d'activation. Après activation, FormSubmit propose un identifiant aléatoire qui peut remplacer l'adresse dans le code pour la masquer.

La confirmation n'est affichée au visiteur qu'après une réponse positive de FormSubmit. Aucune réponse n'est conservée dans le navigateur.

### Tester en local
```bash
curl -X POST http://localhost:4321/api/programme \
  -H 'content-type: application/json' -H 'accept: application/json' \
  -d '{"prenom":"Test","email":"test@example.com","experience":"chine"}'
```
Réponses : `200 {"ok":true}` si Brevo a accepté, `400` avec `errors` par champ, `503` si Brevo n'est pas configuré, `502` si Brevo a refusé (détail dans les journaux du serveur).

---

## 6. Déployer

Le site est construit en HTML statique ; seules les routes `/api/*` ont besoin de Node.

**Serveur Node (par défaut)** : `npm run build` puis `node dist/server/entry.mjs` (variables `HOST`, `PORT`, et celles de `.env` dans l'environnement). À placer derrière un reverse proxy (Nginx, Caddy) ou sur un hébergeur Node (Railway, Render, Fly.io, VPS…).

**Vercel ou Netlify** : remplacer l'adaptateur dans `astro.config.mjs` (`npx astro add vercel` ou `npx astro add netlify`), déployer le dépôt et renseigner les variables d'environnement dans l'interface de l'hébergeur. Rien d'autre ne change.

Avant la mise en ligne : renseigner `PUBLIC_SITE_URL` avec le vrai domaine et reconstruire (canonical, sitemap et images de partage en dépendent).

---

## 7. À fournir ou valider avant publication

**Assets**
- [x] Logo (intégré depuis le formulaire Tally ; fournir l'original vectoriel si disponible).
- [x] Photos : 6 photos du voyage de Yassine en place (voir §3). À confirmer : c'est bien Yassine sur le portrait.

**Informations du séjour Chine** (`src/content/experiences/chine.ts`) — non inventées, donc absentes ou en formulation d'attente :
- [ ] Dates, durée, taille du groupe, prix (et note de prix).
- [ ] Programme par étapes et détail jour par jour.
- [ ] École partenaire et encadrement ; hébergement et chambres ; repas ; transports et point de rendez-vous.
- [ ] Listes inclus / non inclus.
- [ ] Modalités d'inscription, paiement, annulation.
- [ ] PDF du programme (`public/programmes/`) et `programmeUrl`.
- [ ] Statut réel (`status`).

**Textes à faire relire par Yassine** (rédigés à partir du brief, à confirmer) :
- [ ] Origine du nom : « à une lettre près, le mot arabe qui désigne le grand voyageur » (page À propos).
- [ ] « Les séances sont encadrées par des pratiquants expérimentés » et « Yassine accompagne le groupe pendant tout le séjour » (informations pratiques).
- [ ] « Aucune pratique préalable n'est demandée » / « une condition physique correcte suffit » (niveau requis).
- [ ] « De nouvelles expériences sont en préparation » (page Nos expériences).
- [ ] Récit de la page À propos et légendes des photos personnelles.

**Marque et légal**
- [ ] Email de contact, lien Instagram, lien WhatsApp (`src/content/site.ts`).
- [ ] Contenu des pages Confidentialité et Mentions légales (`src/content/pages/legal.ts`), identité juridique.
- [ ] Nom de domaine (`PUBLIC_SITE_URL`).

**Brevo**
- [ ] Clé API, expéditeur validé, adresse de réception, attributs, liste (et template) — voir §5.

---

## 8. Vérifications effectuées

- Build de production sans erreur ; `astro check` : 0 erreur.
- Toutes les URLs répondent en accès direct (et après actualisation) ; `/experiences/` redirige vers `/experiences` ; page 404 de marque.
- Mobile 375 px : aucun débordement horizontal, menu accessible (bouton `aria-expanded`, fermeture par Échap, retour du focus), bouton fixe « Recevoir le programme » qui se masque quand le formulaire est visible.
- Accordéons natifs `<details>` (souris et clavier), focus visibles, labels et messages d'erreur reliés aux champs (`aria-describedby`, `aria-invalid`).
- Formulaires : validation, état de chargement, erreur honnête sans Brevo (503), succès vérifié avec un faux serveur Brevo local (contact avec attributs + email).
- Pipeline d'images vérifié avec des photos de test : WebP multi-tailles, image prioritaire sur le premier écran, chargement différé ailleurs, image de partage recadrée.
- Contrastes de la palette (texte encre sur ivoire 14,5:1 ; gris chaud sur ivoire 5,5:1 ; brun doré sur ivoire 5,2:1 ; l'or n'est utilisé que comme accent décoratif ou sur fond encre 7,5:1).
- Animations désactivées avec `prefers-reduced-motion`.
