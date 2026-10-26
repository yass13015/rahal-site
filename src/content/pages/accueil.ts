/** Textes de la page d'accueil. Le grand visuel d'ouverture reprend l'expérience mise en avant. */
export const accueil = {
  seo: {
    title: 'RAHAL — Voyages en petit groupe : apprendre, essayer, se dépasser',
    description:
      'RAHAL, ce sont des voyages en petit groupe pour découvrir un pays à travers une pratique. Première expérience : DISCIPLINE, une initiation au kung‑fu en Chine.',
  },

  hero: {
    cta: 'Découvrir l’expérience',
  },

  concept: {
    kicker: 'Le concept RAHAL',
    title: 'Apprendre. Essayer. Se dépasser.',
    text: 'Un voyage RAHAL, c’est un pays, une pratique et un petit groupe. Tu ne viens pas seulement voir : tu viens faire. Chaque séjour s’organise autour d’une discipline à apprendre sur place, avec des gens qui la vivent au quotidien. Le reste vient naturellement : les rencontres, les paysages, les repas partagés, et cette petite fierté d’avoir tenté quelque chose que tu n’aurais jamais fait chez toi.',
    pillars: [
      {
        title: 'Apprendre',
        text: 'Une pratique transmise sur place par celles et ceux qui la vivent. Tu repars avec de vraies bases, pas un souvenir de démonstration.',
      },
      {
        title: 'Essayer',
        text: 'Des journées qui te sortent de tes habitudes : un entraînement à l’aube, un plat inconnu, une conversation sans langue commune.',
      },
      {
        title: 'Se dépasser',
        text: 'Rien à prouver. Juste un pas de plus que la veille, à ton rythme, porté par le groupe.',
      },
    ],
  },

  experiences: {
    kicker: 'Nos expériences',
    title: 'Une destination, une pratique, un petit groupe.',
    text: 'Chaque expérience RAHAL a son pays et sa discipline. Voici celles que tu peux rejoindre.',
    cta: 'Voir toutes les expériences',
  },

  founder: {
    kicker: 'Le fondateur',
    title: 'Le voyage comme un moyen, pas une finalité.',
    text: 'On part souvent en voyage pour fuir la routine. On revient reposé, avec des photos plein le téléphone, et le quotidien reprend vite le dessus. J’ai créé RAHAL pour voyager autrement : partir pour apprendre une pratique, un savoir-faire, une façon de vivre, et rentrer avec quelque chose qui reste. C’est l’idée qui guide chaque expérience RAHAL.',
    cta: 'Découvrir l’histoire de RAHAL',
    portrait: {
      src: 'yassine/portrait.jpg',
      alt: 'Yassine, en t-shirt noir, adossé à l’encadrement d’une ouverture voûtée en pierre ; derrière lui, la Muraille grimpe une colline boisée.',
      position: 'center 50%',
      mobilePosition: 'center 55%',
    },
  },

  finalCta: {
    kicker: 'Première expérience',
    title: 'Prêt à découvrir le programme ?',
    text: 'DISCIPLINE, en Chine, est la première expérience RAHAL. Le détail du séjour et le formulaire pour recevoir le programme t’attendent sur sa page.',
    primary: { label: 'Voir le séjour en Chine', href: '/experiences/chine' },
    secondary: { label: 'Faire ma demande', href: '/experiences/chine/inscription' },
  },
} as const;
