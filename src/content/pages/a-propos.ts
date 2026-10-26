import type { ImageRef } from '../types';

interface Chapter {
  kicker: string;
  title: string;
  text: string;
  image?: ImageRef;
}

/**
 * Page « L'esprit RAHAL » — racontée à la première personne par Yassine.
 * Photos personnelles de Yassine (voyage en Chine), sans légende à la demande de Yassine.
 */
export const aPropos = {
  seo: {
    title: 'L’esprit RAHAL — L’histoire de Yassine',
    description:
      "Yassine raconte l’origine de RAHAL : une passion du voyage et de l’apprentissage, un rêve d’enfant autour du kung‑fu et l’envie de partager ça en petit groupe.",
  },

  hero: {
    kicker: 'L’esprit RAHAL',
    title: 'Je m’appelle Yassine, et RAHAL est né d’un rêve d’enfant.',
    text: "Passionné de voyage et d’apprentissage, j’ai créé RAHAL pour partager une façon de voyager qui m’a marqué : apprendre une pratique sur place, explorer un pays autrement, et revenir différent.",
    portrait: {
      src: 'yassine/portrait.jpg',
      alt: "Yassine, en t-shirt noir, adossé à l’encadrement d’une ouverture voûtée en pierre ; derrière lui, la Muraille grimpe une colline boisée.",
      position: 'center 50%',
      mobilePosition: 'center 55%',
    },
  },

  sections: <Chapter[]>[
    {
      kicker: 'Voyager pour apprendre',
      title: 'Je n’ai jamais voyagé pour cocher des lieux.',
      text: "Ce qui me reste d’un voyage, c’est ce que j’y ai appris : un geste, quelques mots d’une langue, une façon de faire les choses. C’est ce qui tient encore, bien après les photos.",
      image: {
        src: 'yassine/apprendre.jpg',
        alt: 'Yassine, en tenue grise, tient un bâton en position basse, guidé par un maître en robe safran devant un temple aux murs rouges.',
        position: 'center 62%',
        mobilePosition: 'center 58%',
      },
    },
    {
      kicker: 'Le kung‑fu',
      title: 'Un rêve d’enfant, pris au sérieux.',
      text: "Enfant, je regardais les films de kung‑fu en boucle. Des années plus tard, je suis parti en Chine pour m’y confronter pour de vrai. J’ai eu mal partout, j’ai douté, et j’ai adoré.",
      image: {
        src: 'yassine/chine-2.jpg',
        alt: 'Un élève en tenue de kung‑fu grise marche aux côtés d’un pratiquant en robe safran, sur un chemin de forêt.',
        mobilePosition: 'center 75%',
      },
    },
    {
      kicker: 'En petit groupe',
      title: 'Parce qu’on ose plus à plusieurs.',
      text: "Un entraînement difficile passe mieux quand on le vit ensemble. Les expériences RAHAL se vivent en petit groupe : assez petit pour que chacun compte, assez grand pour que l’aventure soit partagée.",
      image: {
        src: 'yassine/chine-3.jpg',
        alt: 'Un compagnon de route avance sur la Grande Muraille vers une tour de guet, sous un ciel bleu.',
        mobilePosition: 'center 65%',
      },
    },
  ],

  closing: {
    kicker: 'Les trois piliers',
    title: 'Apprendre. Essayer. Se dépasser.',
    text: "La première expérience RAHAL t’emmène en Chine, autour du kung‑fu.",
    button: { label: 'Découvrir les expériences', href: '/experiences' },
  },
} as const;
