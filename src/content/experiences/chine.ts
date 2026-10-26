import type { Experience } from '../types';

export const chine: Experience = {
  slug: 'chine',
  name: 'Chapitre 1',
  country: 'Chine',
  practice: 'Kung‑fu',
  labels: ['Le prochain départ RAHAL', 'Chine', 'Mars–avril 2027'],
  tagline: '12 jours pour sortir de ta routine, découvrir la Chine autrement et t’initier au kung‑fu.',
  summary:
    'Pékin, une immersion kung‑fu à Tengzhou, puis Shanghai. Une première aventure faite pour découvrir, apprendre et se dépasser.',
  intro:
    'Une expérience, pas un voyage classique. Cette première aventure a été pensée pour découvrir la Chine, mais surtout pour vivre une immersion qui demande de la discipline, de l’humilité et l’envie de se dépasser.',
  status: 'demandes-ouvertes',
  published: true,

  hero: {
    src: 'chine/terrasse-kungfu.jpg',
    alt: 'Trois pratiquants en tenue grise enchaînent des mouvements de kung‑fu sur une terrasse, devant des toits dorés et les montagnes près de l’école de kung fu.',
    position: 'center 45%',
    mobilePosition: '38% center',
  },
  card: {
    src: 'chine/entrainement.jpg',
    alt: 'Yassine, de dos, en tenue de kung‑fu grise devant le grand escalier de pierre d’un temple aux colonnes rouges, près de Tengzhou.',
    position: '50% 60%',
    mobilePosition: '50% 48%',
  },

  dates: 'Du 25 mars au 5 avril 2027',
  datesNote: 'Arrivée à Pékin le 26 mars',
  duration: '12 jours',
  groupSize: '9 personnes',
  price: '1 890 €',
  priceNote: 'Paiement en 1 à 3 fois sans frais · Hors vols internationaux',

  dimensions: [
    {
      title: 'Découvrir autrement',
      text: 'Commencer à Pékin, s’initier au kung‑fu à Tengzhou et terminer à Shanghai. Trois temps pour voir plusieurs visages de la Chine.',
      image: {
        src: 'chine/decouvrir.jpg',
        alt: 'La Grande Muraille serpente sur les crêtes boisées de Mutianyu, près de Pékin.',
      },
    },
    {
      title: 'Sortir de sa zone de confort',
      text: 'Cinq journées d’immersion dans une école de kung fu, environ 6 heures d’entraînement par jour. Se lever tôt, essayer, recommencer : le maître adapte le rythme au niveau du groupe.',
      image: {
        src: 'chine/immersion-escaliers.jpg',
        alt: 'Des participants descendent un escalier de pierre vers une cour et des bâtiments aux toits dorés, devant les montagnes boisées.',
        position: 'center 68%',
        mobilePosition: 'center 68%',
      },
    },
    {
      title: 'Vivre l’expérience ensemble',
      text: 'Tu arrives seul, tu repars avec une famille. On se motive, on se soutient dans l’effort, dans une ambiance bienveillante, et chacun rentre la tête remplie de souvenirs en commun.',
      image: {
        src: 'chine/repas-ensemble.jpg',
        alt: 'Des voyageurs partagent un repas autour de petites tables en plein air, devant un bâtiment traditionnel chinois.',
        position: 'center 85%',
        mobilePosition: 'center 85%',
      },
    },
  ],

  programme: {
    intro:
      'Le voyage commence à Pékin et se termine à Shanghai. Trois étapes, douze jours calendaires, une seule aventure.',
    steps: [
      {
        kicker: '25–28 mars · Pékin',
        title: 'Commencer par la Chine impériale',
        text: 'Rejoindre le groupe à Pékin, découvrir la capitale et la Grande Muraille, puis prendre le train rapide vers Tengzhou.',
        image: {
          src: 'chine/etape-pekin.jpg',
          alt: 'La Grande Muraille vue entre deux créneaux, avec une tour de guet et les collines de Mutianyu.',
        },
        days: [
          {
            title: 'Jeudi 25 mars · Départ direction la Chine',
            text: 'Vol vers Pékin : chacun rejoint la capitale pour le vendredi 26 mars. Les billets d’avion pourront être coordonnés selon les villes et les dates de départ de chacun : un groupe sera créé pour s’organiser ensemble. Ne réserve pas ton billet avant la validation de ta demande.',
          },
          {
            title: 'Vendredi 26 mars · Pékin impérial',
            text: 'Arrivée à Pékin, transfert collectif vers l’hôtel et rencontre du groupe. Découverte de la Cité interdite et de la capitale impériale. Première nuit à Pékin.',
          },
          {
            title: 'Samedi 27 mars · Grande Muraille de Chine à Mutianyu',
            text: 'Visite de la Grande Muraille de Chine à Mutianyu, montée en téléphérique et descente en toboggan si la météo le permet. Retour et deuxième nuit à Pékin.',
          },
          {
            title: 'Dimanche 28 mars · Pékin → Tengzhou',
            text: 'Pékin, puis transfert vers la gare et train rapide pour Tengzhou East. Installation à l’école de kung fu.',
          },
        ],
      },
      {
        kicker: '28 mars–3 avril · Kung‑fu à Tengzhou',
        title: 'Entrer dans l’immersion kung‑fu',
        daysLabel: 'Voir le détail de l’immersion',
        text: 'Du 28 mars au 3 avril à l’école de kung fu, avec cinq jours d’entraînement du lundi 29 mars au vendredi 2 avril, environ 6 heures par jour. Le maître adapte les séances au niveau du groupe, à sa progression et à la météo.',
        image: {
          src: 'chine/maitre-escaliers.jpg',
          alt: 'Le maître, en robe safran, descend les escaliers de marbre d’un temple aux toits dorés, dans les montagnes près de Tengzhou.',
          position: 'center 50%',
        },
        days: [
          {
            title: 'Une pratique complète',
            text: 'Qigong, conditionnement, formes Shaolin, Sanda, travail de la force, souplesse et méditation rythment l’immersion.',
          },
          {
            title: 'Un rythme progressif',
            text: 'Tu viens pour apprendre et essayer. Aucune expérience préalable du kung‑fu n’est nécessaire ; l’entraînement est ajusté au groupe.',
          },
          {
            title: 'La vie sur place',
            text: 'Six nuits à l’école de kung fu, du 28 mars au 3 avril, au rythme du groupe : entraînement, repas à la cantine, récupération et soirées partagées.',
          },
        ],
      },
      {
        kicker: '3–5 avril · Shanghai',
        title: 'Terminer entre tradition et futur',
        text: 'Rejoindre Shanghai en train rapide, découvrir Yuyuan, le Bund et Lujiazui, puis prendre le temps de clôturer l’aventure ensemble.',
        image: {
          src: 'chine/etape-shanghai.jpg',
          alt: 'Les tours illuminées de Lujiazui et la tour de la Perle de l’Orient à Shanghai, au crépuscule.',
        },
        days: [
          {
            title: 'Samedi 3 avril · Tengzhou → Shanghai',
            text: 'Départ de l’école de kung fu, train rapide vers Shanghai Hongqiao, transfert et installation à l’hôtel pour les nuits des 3 et 4 avril. En fin de journée : ruelles illuminées de Yuyuan, Bund et croisière nocturne sur le Huangpu.',
          },
          {
            title: 'Dimanche 4 avril · Shanghai traditionnel et futuriste',
            text: 'Découverte de Lujiazui et montée à l’observatoire de la Shanghai Tower. Balades et temps libre selon les envies du groupe, puis dîner d’au revoir.',
          },
          {
            title: 'Lundi 5 avril · Retour',
            text: 'Check-out et transfert collectif vers l’aéroport de Shanghai.',
          },
        ],
      },
    ],
  },

  included: [
    '10 nuits d’hébergement : 2 à Pékin, 6 à l’école de kung fu et 2 à Shanghai',
    'Chambres non mixtes partagées à deux durant tout le séjour',
    '5 journées d’immersion, environ 6 h d’entraînement par jour',
    'Uniforme de kung‑fu',
    "3 repas par jour à la cantine de l'école de kung-fu",
    '2 trains rapides : Pékin → Tengzhou et Tengzhou → Shanghai',
    'Transferts collectifs prévus entre les aéroports, les gares et les hébergements',
    'Cité interdite, Grande Muraille, croisière sur le Huangpu et Shanghai Tower',
    'Accompagnement pendant toute l’expérience',
  ],
  notIncluded: [
    'Vols internationaux aller-retour',
    'Visa éventuel selon ta nationalité',
    'Assurance voyage obligatoire',
    'Repas à Pékin et Shanghai hors repas de groupe annoncés',
    'Transferts effectués en dehors des créneaux collectifs',
  ],

  pricing: {
    total: '1 890 €',
    note: 'par personne, hors vols internationaux · Règlement intégral possible : 1 890 €',
    lines: [
      { label: 'Acompte', value: '300 €', note: 'pour réserver ta place' },
      { label: 'Solde', value: '1 590 €', note: 'en une fois, ou en deux versements de 795 € sans frais' },
    ],
  },
  applicationSteps: [
    {
      title: 'Tu fais ta demande.',
      text: 'Quelques minutes pour te présenter et répondre à quelques questions sur ton voyage.',
    },
    {
      title: 'On revient vers toi.',
      text: 'Si ta demande est retenue, tu reçois un email ou un message de confirmation.',
    },
    {
      title: 'Tu confirmes ta place.',
      text: 'Tu réserves ta place avec 300 € d’acompte. Le solde de 1 590 € se règle en une fois ou en deux versements de 795 €, sans frais. Tu peux aussi régler les 1 890 € en une fois. Puis tu rejoins le groupe WhatsApp pour rencontrer les autres participants.',
    },
  ],

  faq: [
    {
      question: 'Faut-il avoir déjà pratiqué le kung‑fu ?',
      answer: 'Non, l’expérience est ouverte aux débutants. Une condition physique correcte et l’envie de t’investir suffisent : le maître adapte les séances au niveau du groupe et à sa progression.',
    },
    {
      question: 'Peut-on venir seul ?',
      answer: "Bien sûr ! Tu fais connaissance avec les autres voyageurs dans le groupe WhatsApp avant le départ, puis on partage l'aventure ensemble !",
    },
    {
      question: 'À quoi ressemble une journée à l’école ?',
      answer: 'Environ 6 heures d’entraînement, entre Qigong, conditionnement, formes Shaolin, Sanda, travail de la force, souplesse et méditation. Le reste du temps : repas à la cantine, récupération et soirées partagées avec le groupe.',
    },
    {
      question: 'Quand commence le voyage, et les vols sont-ils inclus ?',
      answer: 'Le voyage a lieu du jeudi 25 mars au lundi 5 avril 2027 : départ le jeudi 25 mars pour arriver à Pékin le vendredi 26 mars, puis fin du séjour à Shanghai le lundi 5 avril. Les vols internationaux ne sont pas inclus. Attends la validation de ta demande avant de réserver ton billet. Un groupe WhatsApp sera créé pour coordonner les billets d’avion selon les villes et les dates de départ de chacun.',
    },
    {
      question: 'Où dort-on, et comment se passent les repas ?',
      answer: '10 nuits : 2 à Pékin, 6 à l’école de kung fu et 2 à Shanghai, en chambres non mixtes partagées à deux. Pendant l’immersion, les 3 repas par jour sont fournis par la cantine de l’école ; à Pékin et à Shanghai, seuls les repas de groupe annoncés sont inclus. Une chambre individuelle est possible avec supplément, sur demande et selon disponibilité.',
    },
    {
      question: 'Faut-il un visa et une assurance ?',
      answer: 'Selon ta nationalité et les règles d’entrée en vigueur en mars–avril 2027, un visa peut être nécessaire, et ton passeport doit être valide au moins 6 mois après le retour. Une assurance voyage couvrant le séjour est obligatoire.',
    },
    {
      question: 'Que mettre dans son sac ?',
      answer: 'Le voyage a lieu au printemps : prévois des vêtements chauds pour Pékin et la Grande Muraille, une tenue souple et des chaussures confortables. L’uniforme de kung‑fu est fourni.',
    },
    {
      question: 'Comment se déroule l’inscription ?',
      answer: 'Tu fais ta demande en ligne, en quelques minutes. Si elle est retenue, tu reçois les modalités de paiement : 300 € d’acompte pour réserver ta place, puis un solde de 1 590 € à régler en une fois ou en deux versements de 795 €, sans frais. Le règlement intégral de 1 890 € est aussi possible. Une fois ta place validée, tu rejoins le groupe WhatsApp des participants.',
      link: { label: 'Faire ma demande', href: '/experiences/chine/inscription' },
    },
  ],

  applicationUrl: '/experiences/chine/inscription',
  registration: {
    title: 'Ta demande d’inscription',
    intro:
      'Trois courtes étapes pour te présenter. Ce formulaire constitue une demande d’inscription : ta place est réservée après validation de ta demande et versement des 300 € d’acompte, ou règlement intégral de 1 890 €. Après acompte, le solde de 1 590 € peut être réglé en une fois ou en deux versements de 795 €, sans frais.',
    subject: 'Demande d’inscription · Chine, mars–avril 2027',
    steps: [
      {
        id: 'toi',
        title: 'Faisons connaissance',
        text: 'Tes coordonnées pour recevoir les prochaines étapes.',
        fields: [
          { name: 'Prénom', label: 'Prénom', type: 'text', required: true, autocomplete: 'given-name', placeholder: 'Ton prénom', width: 'half' },
          { name: 'Nom', label: 'Nom de famille', type: 'text', required: true, autocomplete: 'family-name', placeholder: 'Ton nom', width: 'half' },
          { name: 'Date de naissance', label: 'Date de naissance', type: 'date', required: true, autocomplete: 'bday', width: 'half' },
          { name: 'Sexe', label: 'Sexe', type: 'choice', required: true, options: ['Homme', 'Femme'], hint: 'Pour la répartition des chambres non mixtes.', width: 'half' },
          { name: 'email', label: 'Adresse email', type: 'email', required: true, autocomplete: 'email', placeholder: 'ton@email.com' },
          { name: 'WhatsApp', label: 'Numéro WhatsApp', type: 'tel', required: true, autocomplete: 'tel', placeholder: '+33 6 12 34 56 78', hint: 'Avec l’indicatif. Il sert à te transmettre les prochaines étapes de l’inscription.', width: 'half' },
          { name: 'Instagram', label: 'Instagram', type: 'text', placeholder: '@tonpseudo', width: 'half' },
        ],
      },
      {
        id: 'voyage',
        title: 'Ton voyage',
        text: 'Ces quelques réponses nous permettent de vérifier que l’expérience correspond bien à tes disponibilités et à ton projet.',
        fields: [
          { name: 'Passeport valide 6 mois après le retour', label: 'As-tu un passeport valide au moins 6 mois après le retour ?', type: 'choice', required: true, options: ['Oui', 'Mon renouvellement est en cours ou prévu', 'Non'] },
          { name: 'Pays du passeport', label: 'Quel pays a délivré ton passeport ?', type: 'text', required: true, autocomplete: 'country-name', placeholder: 'Ex. France' },
          { name: 'Assurance voyage', label: 'As-tu souscrit une assurance voyage ?', type: 'choice', required: true, options: ['Oui', 'Pas encore'], hint: 'Elle est obligatoire pour participer.' },
          { name: 'Paiement', label: 'Comment souhaites-tu régler ton voyage ?', type: 'choice', required: true, hint: 'Après validation de ta demande : 300 € d’acompte pour réserver, puis le solde de 1 590 € en une ou deux fois sans frais. Tu peux aussi régler la totalité en une fois.', options: ['Règlement intégral : 1 890 €', 'Acompte de 300 € + solde en 1 fois : 1 590 €', 'Acompte de 300 € + solde en 2 fois : 795 € + 795 €'] },
        ],
      },
      {
        id: 'envoi',
        title: 'Avant d’envoyer',
        text: 'Deux dernières questions et une confirmation, puis tu vérifies tes réponses.',
        fields: [
          { name: 'Droit à l’image', label: 'Acceptes-tu que les photos et vidéos du voyage où tu es reconnaissable soient publiées sur les réseaux sociaux de RAHAL ?', type: 'choice', required: true, hint: 'Ton choix n’a aucune incidence sur ta participation au voyage.', options: ['Oui, j’autorise cette utilisation de mon image', 'Non, je ne souhaite pas apparaître sur les publications de RAHAL'] },
          { name: 'Question ou contrainte', label: 'Une question, une contrainte ou un problème de santé à nous signaler ?', type: 'textarea', placeholder: 'Facultatif' },
          { name: 'Confirmation', label: 'Je confirme avoir pris connaissance du programme, des prestations incluses et non incluses et des modalités d’inscription et de paiement. J’ai compris que les vols internationaux ne sont pas inclus et que je dois être à Pékin le vendredi 26 mars 2027.', type: 'consent', required: true },
        ],
      },
    ],
    success: {
      title: 'Ta demande d’inscription est bien envoyée.',
      text: [
        'Tu recevras par email ou WhatsApp les prochaines étapes et les modalités du paiement choisi.',
        'Ta place sera définitivement réservée après validation de ta demande et réception des 300 € d’acompte, ou du règlement intégral de 1 890 €. Après acompte, il restera 1 590 € à régler en une fois ou en deux versements de 795 €, sans frais.',
      ],
    },
    fallbackUrl: 'https://tally.so/r/rj7y2L',
  },

  brevo: {},
  seo: {
    title: 'Chapitre 1 : Chine · 12 jours et immersion kung‑fu — RAHAL',
    description:
      'Du jeudi 25 mars au lundi 5 avril 2027 : Pékin, immersion kung‑fu à Tengzhou et Shanghai. 9 voyageurs, 1 890 €, paiement en 1 à 3 fois sans frais.',
  },
};
