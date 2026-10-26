/**
 * Modèle de contenu RAHAL.
 * Tout ce qui est facultatif (`?`) est masqué du site tant qu'il n'est pas renseigné.
 */

/** Statut réel d'une expérience, affiché tel quel aux visiteurs. */
export type ExperienceStatus = 'a-venir' | 'demandes-ouvertes' | 'complet';

export interface ImageRef {
  /** Chemin relatif à `src/assets/images/` (ex. `chine/muraille.jpg`). */
  src: string;
  /** Description de l'image pour l'accessibilité et le référencement. */
  alt: string;
  /** Cadrage sur ordinateur, valeur CSS `object-position` (ex. `center 40%`). */
  position?: string;
  /** Cadrage sur mobile, valeur CSS `object-position` (ex. `35% center`). */
  mobilePosition?: string;
  /** Légende facultative affichée sous la photo. */
  caption?: string;
}

export interface Faq {
  question: string;
  answer: string;
  /** Lien facultatif ajouté à la fin de la réponse. */
  link?: { label: string; href: string };
}

export interface ProgrammeDay {
  title: string;
  text: string;
}

export interface ProgrammeStep {
  /** Ex. « Jours 1 à 3 » */
  kicker?: string;
  title: string;
  text: string;
  image?: ImageRef;
  /** Détail jour par jour, affiché dans un accordéon. */
  days?: ProgrammeDay[];
  /** Libellé de l'accordéon si le détail n'est pas découpé par jour. */
  daysLabel?: string;
}

/** Une question du formulaire d'inscription. `name` sert aussi de libellé dans l'email reçu. */
export interface RegistrationField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'date' | 'choice' | 'textarea' | 'consent';
  required?: boolean;
  placeholder?: string;
  hint?: string;
  /** Valeur HTML `autocomplete` (ex. `given-name`). */
  autocomplete?: string;
  /** Réponses proposées (type `choice`). */
  options?: string[];
  /** Largeur sur ordinateur : moitié de ligne ou ligne entière (par défaut). */
  width?: 'half' | 'full';
}

export interface RegistrationStep {
  id: string;
  title: string;
  text?: string;
  fields: RegistrationField[];
}

/** Page d'inscription intégrée au site (`/experiences/<slug>/inscription`). */
export interface Registration {
  title: string;
  intro: string;
  /** Objet de l'email reçu pour chaque demande. */
  subject: string;
  steps: RegistrationStep[];
  success: { title: string; text: string[] };
  /** Formulaire de secours proposé seulement si l'envoi échoue (ex. Tally). */
  fallbackUrl?: string;
}

export interface Dimension {
  title: string;
  text: string;
  image?: ImageRef;
}

export interface Experience {
  /** Segment d'URL : /experiences/<slug> */
  slug: string;
  /** Nom de l'expérience (ex. DISCIPLINE). */
  name: string;
  country: string;
  /** Pratique principale (ex. Kung‑fu). */
  practice: string;
  /** Mots du label d'ouverture, ex. ['Chine', 'Kung‑fu', 'Petit groupe']. */
  labels: string[];
  /** Phrase d'accroche (hero). */
  tagline: string;
  /** Description courte (cartes, partage). */
  summary: string;
  /** Présentation un peu plus longue sous le titre de la page du séjour. */
  intro?: string;
  status: ExperienceStatus;
  /** Une expérience non publiée n'apparaît nulle part sur le site. */
  published: boolean;
  hero: ImageRef;
  card: ImageRef;

  // --- Informations pratiques du bandeau (texte libre, affiché seulement si confirmé)
  dates?: string;
  /** Précision affichée sous les dates (ex. lieu et heure du rendez-vous). */
  datesNote?: string;
  duration?: string;
  groupSize?: string;
  price?: string;
  priceNote?: string;

  /** Les trois dimensions de l'expérience. */
  dimensions: Dimension[];

  /** Programme par étapes. Sans étapes, un message « prochainement disponible » est affiché. */
  programme?: {
    intro?: string;
    steps: ProgrammeStep[];
  };

  included?: string[];
  notIncluded?: string[];

  /** Tarif détaillé et étapes de l'inscription — uniquement lorsqu'ils sont confirmés. */
  pricing?: {
    total: string;
    note: string;
    lines: { label: string; value: string; note?: string }[];
  };
  applicationSteps?: { title: string; text: string }[];

  faq?: Faq[];

  /** Lien vers le programme (ex. `/programmes/chine.pdf` placé dans `public/programmes/`). */
  programmeUrl?: string;

  /** Lien vers la demande d'inscription (page du site ou formulaire externe). */
  applicationUrl?: string;

  /** Formulaire d'inscription intégré au site. */
  registration?: Registration;

  /** Paramètres Brevo propres à l'expérience (identifiants non secrets). */
  brevo?: {
    /** Liste de contacts Brevo dans laquelle ranger les demandes. */
    listId?: number;
    /** Template d'email transactionnel envoyé après la demande (facultatif). */
    templateId?: number;
  };

  seo: {
    title: string;
    description: string;
  };
}

export const STATUS_LABELS: Record<ExperienceStatus, string> = {
  'a-venir': 'À venir',
  'demandes-ouvertes': 'Demandes ouvertes',
  'complet': 'Complet',
};
