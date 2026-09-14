import Images from '../assets/images';

export const DEFAULT_PRODUCTS = [
  {
    id: 'p1',
    slug: 'grain-khatra',
    name: 'Grain de Café Khatra',
    category: 'Café',
    img: Images.khatra.packaging,
    short: 'Sélection de grains de café premium pour professionnels et coffee shops.',
    formats: ['250g', '500g', '1kg', '5kg'],
    desc: 'Sélection rigoureuse de grains de café d’origine pour les professionnels exigeants. Torréfaction sur-mesure garantissant une crema onctueuse et une stabilité parfaite.',
    features: ['Torréfaction artisanale maîtrisée', 'Conditionnement hermétique valve fraîcheur', 'Origine sélectionnée et traçabilité']
  },
  {
    id: 'p2',
    slug: 'cafe-360',
    name: 'Khatra 360° Signature',
    category: 'Café',
    img: Images.khatra.khatra360,
    short: 'L’assemblage signature Khatra conçu pour un équilibre parfait en tasse.',
    formats: ['1kg', 'Carton Pro (6x1kg)'],
    desc: 'Le blend signature de Khatra. Un profil aromatique complexe mêlant chocolat noir, noisette grillée et une subtile touche d’agrumes.',
    features: ['Profil équilibré et persistant', 'Idéal expresso et boissons lactées', 'Support technique barista inclus']
  },
  {
    id: 'p3',
    slug: 'sirop-biscuit',
    name: 'Sirop Gourmet Biscuit',
    category: 'Sirops',
    img: Images.syrups.biscuit,
    short: 'Saveur biscuit dorée et croustillante pour créations chaudes et froides.',
    formats: ['1L', 'Carton Pro (6x1L)'],
    desc: 'Un sirop gourmand aux notes authentiques de sablé artisanal. Apporte de la texture et un parfum réconfortant à vos boissons signatures.',
    features: ['Sucre pur & arômes sélectionnés', 'Excellente tenue thermique', 'Bouchon verseur compatible pompes pro']
  },
  {
    id: 'p4',
    slug: 'sirop-caramel',
    name: 'Sirop Caramel Onctueux',
    category: 'Sirops',
    img: Images.syrups.caramel,
    short: 'Caramel cuit au chaudron, rond et intense pour lattes et desserts.',
    formats: ['1L', 'Carton Pro (6x1L)'],
    desc: 'La référence absolue du barista. Une rondeur beurrée et une couleur ambrée pour sublimer macchiatos et chocolats chauds.',
    features: ['Arôme naturel intense', 'Solubilité instantanée', 'Sans conservateurs agressifs']
  },
  {
    id: 'p5',
    slug: 'sirop-noisette',
    name: 'Sirop Noisette Grillée',
    category: 'Sirops',
    img: Images.syrups.noisette,
    short: 'L’arôme chaleureux de la noisette torréfiée pour cafés d’exception.',
    formats: ['1L', 'Carton Pro (6x1L)'],
    desc: 'Une saveur toastée élégante qui s’accorde harmonieusement avec l’amertume noble de l’espresso et la douceur du lait texturé.',
    features: ['Idéal cappuccinos & cold brews', 'Formule haute concentration', 'Dosage précis']
  },
  {
    id: 'p6',
    slug: 'sirop-toffee-nut',
    name: 'Sirop Toffee Nut',
    category: 'Sirops',
    img: Images.syrups.toffeNut,
    short: 'Alliance généreuse de caramel au beurre et noix croquantes.',
    formats: ['1L', 'Carton Pro (6x1L)'],
    desc: 'Le bestseller des saisons fraîches. Une fusion gourmande de toffee anglais et de notes de noix torréfiées.',
    features: ['Saveur signature recherchée', 'Adapté boissons chaudes/glacées', 'Stabilité aromatique']
  },
  {
    id: 'p7',
    slug: 'bubbles-fraise',
    name: 'Bubbles Popping Fraise',
    category: 'Bubbles',
    img: Images.bubbles.frais,
    short: 'Perles de jus de fraise qui éclatent en bouche pour boissons modernes.',
    formats: ['Seau Pro 3.2kg', 'Pack 4 seaux'],
    desc: 'Perles de fruits haut de gamme avec enveloppe fine en extrait d’algues naturelles et cœur pur jus.',
    features: ['Texture croquante & éclatante', 'Prêt à l’emploi sans cuisson', 'Longue conservation']
  },
  {
    id: 'p8',
    slug: 'bubbles-mangue',
    name: 'Bubbles Popping Mangue',
    category: 'Bubbles',
    img: Images.bubbles.mangue,
    short: 'Explosion fruitée de mangue tropicale mûrie au soleil.',
    formats: ['Seau Pro 3.2kg', 'Pack 4 seaux'],
    desc: 'Un goût exotique puissant et une couleur vibrante pour dynamiser votre carte de boissons d’été.',
    features: ['Jus de fruit sélectionné', 'Visuel attractif en verre transparent', 'Normes pro']
  },
  {
    id: 'p9',
    slug: 'bubbles-passion',
    name: 'Bubbles Popping Passion',
    category: 'Bubbles',
    img: Images.bubbles.passion,
    short: 'Acidulé et fruité, le fruit de la passion en billes éclatantes.',
    formats: ['Seau Pro 3.2kg', 'Pack 4 seaux'],
    desc: 'L’équilibre parfait entre douceur et pointe acidulée pour mocktails et thés rafraîchissants.',
    features: ['Saveur rafraîchissante', 'Idéal boissons estivales', 'Conditionnement pro']
  },
  {
    id: 'p10',
    slug: 'sirop-kiwi',
    name: 'Sirop Kiwi Frais',
    category: 'Sirops',
    img: Images.nidsys.kiwi,
    short: 'Touche acidulée et vivifiante pour smoothies et mocktails.',
    formats: ['1L', 'Carton Pro (6x1L)'],
    desc: 'Une note végétale et fruitée irrésistible pour diversifier votre offre.',
    features: ['Couleur lumineuse naturelle', 'Équilibre sucré/acidulé', 'Polyvalence bar']
  },
  {
    id: 'p11',
    slug: 'sirop-raisin',
    name: 'Sirop Raisin Intense',
    category: 'Sirops',
    img: Images.nidsys.raisin,
    short: 'Saveur profonde de raisin noir gorgé de soleil.',
    formats: ['1L', 'Carton Pro (6x1L)'],
    desc: 'Un parfum noble et généreux qui séduit les amateurs d’arômes authentiques.',
    features: ['Richesse en goût', 'Dilution facile', 'Qualité professionnelle constante']
  }
];
