/** Textes de la page « Nos expériences ». */
export const experiencesPage = {
  seo: {
    title: 'Nos expériences — RAHAL',
    description:
      'Les voyages RAHAL : une destination, une pratique à apprendre sur place et un petit groupe. Découvre les expériences disponibles.',
  },
  kicker: 'Nos expériences',
  title: 'Un pays. Une pratique. Un petit groupe.',
  text: 'Chaque expérience RAHAL réunit une destination et une discipline à apprendre sur place, avec un groupe volontairement réduit. Pas un circuit touristique : une pratique au cœur du voyage, et le temps de s’y plonger.',
  /** Les trois photos à côté du titre, qui en reprennent les mots. */
  mosaic: [
    {
      label: 'Un pays',
      image: { src: 'chine/muraille-creneaux.jpg', alt: 'La Grande Muraille et ses montagnes, vues entre deux créneaux.', position: 'center 55%' },
    },
    {
      label: 'Une pratique',
      image: { src: 'chine/terrasse-kungfu.jpg', alt: 'Des élèves en tenue grise s’entraînent au kung‑fu sur une terrasse aux toits dorés.', position: '30% center' },
    },
    {
      label: 'Un petit groupe',
      image: { src: 'chine/compagnons.jpg', alt: 'Deux élèves en tenue grise traversent une passerelle en bois au pied d’une cascade.', position: 'center 72%' },
    },
  ],
  next: {
    kicker: 'Les prochaines destinations',
    title: 'Une autre destination te tente ?',
    text: 'Inscris-toi à notre liste d’attente pour découvrir les prochaines expériences RAHAL en avant-première.',
    image: {
      src: 'chine/glycines.jpg',
      alt: 'Une allée couverte de glycines mauves, avec de la lumière au bout du chemin.',
      position: 'center 55%',
      mobilePosition: 'center 60%',
    },
  },
} as const;
