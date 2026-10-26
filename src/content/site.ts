/**
 * Paramètres généraux du site : marque, navigation, coordonnées, pied de page.
 * Les coordonnées vides sont simplement masquées.
 */
export const site = {
  name: 'RAHAL',
  tagline: 'Apprendre. Essayer. Se dépasser.',
  description:
    'RAHAL organise des voyages en petit groupe pour découvrir un pays à travers une pratique, des rencontres et des expériences qui font sortir de ses habitudes.',
  locale: 'fr_FR',
  lang: 'fr',

  founder: {
    firstName: 'Yassine',
  },

  /** Coordonnées : laisser vide pour masquer. */
  contact: {
    email: 'rahal.experience@gmail.com',
    instagram: 'https://www.instagram.com/rahal.xp/',
    instagramHandle: '@rahal.xp',
    whatsapp: '', // ex. 'https://wa.me/33600000000'
  },

  /**
   * Réception des formulaires (contact, liste d'attente) par email, via FormSubmit (fonctionne sans serveur).
   * Le premier envoi déclenche un email d'activation à cette adresse : cliquer sur « Activate Form ».
   */
  forms: {
    email: 'rahal.experience@gmail.com',
  },

  nav: [
    { label: 'Nos expériences', href: '/experiences' },
    { label: 'L’esprit RAHAL', href: '/a-propos' },
    { label: 'FAQ / Contact', href: '/faq-contact' },
  ],

  /** Bouton mis en avant dans le menu. */
  navCta: { label: 'Prochain départ : Chine', href: '/experiences/chine' },

  /** Liens légaux du pied de page (configurables). */
  legalLinks: [] as { label: string; href: string }[],

  footer: {
    note: 'Voyages en petit groupe. Une destination, une pratique, une aventure partagée.',
  },
} as const;
