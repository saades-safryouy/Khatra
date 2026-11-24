/* ============================================================
   KHATRA ASSETS REGISTRY
   Product photography supplied by BOSS (Nov 19, 2026) lives in
   the category folders with underscore filenames and is wired
   in below. Older spaced filenames remain in the repo but are
   no longer referenced here.
   ============================================================ */

import bgHero from './design/Background.jpeg';
import khatraLogo from './design/khatra_logo_new.png';

// Hero banners (Nov 2026 artwork: products right, empty burgundy
// left for headline text, no baked-in text). Desktop 1920x800,
// mobile 900x1200 twins served under the 768px breakpoint.
import heroHome from './heroes/hero-home.jpg';
import heroHomeMobile from './heroes/hero-home-mobile.jpg';
import heroProducts from './heroes/hero-produits.jpg';
import heroProductsMobile from './heroes/hero-produits-mobile.jpg';
import heroLocations from './heroes/hero-points-de-vente.jpg';
import heroLocationsMobile from './heroes/hero-points-de-vente-mobile.jpg';
import heroStory from './heroes/hero-notre-histoire.jpg';
import heroStoryMobile from './heroes/hero-notre-histoire-mobile.jpg';
import heroContact from './heroes/hero-contact.jpg';
import heroContactMobile from './heroes/hero-contact-mobile.jpg';
import heroFranchise from './heroes/hero-franchise.jpg';
import heroFranchiseMobile from './heroes/hero-franchise-mobile.jpg';
import heroFranchiseCoffeeShop from './heroes/hero-franchise-coffee-shop.jpg';
import heroFranchiseCoffeeShopMobile from './heroes/hero-franchise-coffee-shop-mobile.jpg';
import heroFranchiseMarket from './heroes/hero-franchise-khatra-market.jpg';
import heroFranchiseMarketMobile from './heroes/hero-franchise-khatra-market-mobile.jpg';

// Bubbles (Nidsy's)
import imgAllBubbles from './design/BUBLES/BUBBELS_CATEGORY.jpg';
import imgBubblesFrais from './design/BUBLES/BUBBLES_FRAIS.jpg';
import imgBubblesMangue from './design/BUBLES/BUBBLES_MANGUE.jpg';
import imgBubblesPassion from './design/BUBLES/BUBBLES_PASSION.jpg';

// Khatra grain
import imgKhatraCategory from './design/KHATRA GRAIN/KHATRA_CATEGORY.jpg';
import imgGrain from './design/hero-bg.jpg';
import imgGrain2 from './design/KHATRA GRAIN/KHATRA_EXTRA_DORE.jpg';
import imgKhatra360 from './design/KHATRA GRAIN/KHATRA_EXPRESSO.jpg';
import imgPackaging from './design/KHATRA GRAIN/KHATRA_CATEGORY.jpg';

// Nindy's syrups 750ml
import imgNindysCategory from './design/NINDYS SIROP/NINDYS_SIROP_CATEGORY.jpg';
import imgNindysBiscuit from './design/NINDYS SIROP/NINDYS_SIROP_BISCUIT.jpg';
import imgNindysCaramel from './design/NINDYS SIROP/NINDYS_SIROP_CARAMEL.jpg';
import imgNindysChocolat from './design/NINDYS SIROP/NINDYS_SIROP_CHOCOLAT.jpg';
import imgNindysFruitDeBois from './design/NINDYS SIROP/NINDYS_SIROP_FRUIT_DE_BOITS.jpg';
import imgNindysPeche from './design/NINDYS SIROP/NINDYS_SIROP_PECHE.jpg';
import imgNindysVanille from './design/NINDYS SIROP/NINDYS_SIROP_VANILLE.jpg';

// FO syrups 700ml
import imgSyrupCategory from './design/SIROP/SIROP_CATEGORY.jpg';
import imgSyrupBiscuit from './design/SIROP/SIROP_BISCUIT.jpg';
import imgSyrupCaramel from './design/SIROP/SIROP_CARAMEL.jpg';
import imgSyrupNoisette from './design/SIROP/SIROP_NOISETTE.jpg';
import imgSyrupToffe from './design/SIROP/SIROP_TOFEE_NUT.jpg';

// Sugar
import imgSugar1 from './design/SUGAR/SUGAR_KHATRA1.jpg';
import imgSugar2 from './design/SUGAR/SUGAR_KHATRA2.jpg';

// APM VIP toppings
import imgToppingCategory from './design/TOPING/TOPPING_CATEGORY.jpg';
import imgToppingCaramel from './design/TOPING/CARAMEL_TOPPING.jpg';
import imgToppingForestFruit from './design/TOPING/FOREST_FRUIT_TOPPING.jpg';
import imgToppingStrawberry from './design/TOPING/STRAWBERRY_TOPPING.jpg';

export const Images = {
  bgHero,
  logo: khatraLogo,
  heroes: {
    home: { desktop: heroHome, mobile: heroHomeMobile },
    products: { desktop: heroProducts, mobile: heroProductsMobile },
    locations: { desktop: heroLocations, mobile: heroLocationsMobile },
    story: { desktop: heroStory, mobile: heroStoryMobile },
    contact: { desktop: heroContact, mobile: heroContactMobile },
    franchise: { desktop: heroFranchise, mobile: heroFranchiseMobile },
    franchiseCoffeeShop: { desktop: heroFranchiseCoffeeShop, mobile: heroFranchiseCoffeeShopMobile },
    franchiseMarket: { desktop: heroFranchiseMarket, mobile: heroFranchiseMarketMobile },
  },
  categories: {
    bubbles: imgAllBubbles,
    grain: imgKhatraCategory,
    nindys: imgNindysCategory,
    syrups: imgSyrupCategory,
    sugar: imgSugar1,
    toppings: imgToppingCategory,
  },
  bubbles: {
    all: imgAllBubbles,
    frais: imgBubblesFrais,
    mangue: imgBubblesMangue,
    passion: imgBubblesPassion,
  },
  khatra: {
    hero: imgGrain,
    packaging: imgPackaging,
    khatra360: imgKhatra360,
    grainClose: imgGrain2,
    brand3: imgKhatraCategory,
  },
  nidsys: {
    syrupTrio: imgNindysCategory,
    biscuit: imgNindysBiscuit,
    caramel: imgNindysCaramel,
    chocolat: imgNindysChocolat,
    fruitDeBois: imgNindysFruitDeBois,
    peche: imgNindysPeche,
    vanille: imgNindysVanille,
    // No supplied photo exists for the Kiwi / Raisin product records:
    // they fall back to the Nindy's category (group) visual rather
    // than a wrong flavour's bottle shot.
    kiwi: imgNindysCategory,
    raisin: imgNindysCategory,
  },
  sugar: {
    sachet1: imgSugar1,
    sachet2: imgSugar2,
  },
  toppings: {
    category: imgToppingCategory,
    caramel: imgToppingCaramel,
    forestFruit: imgToppingForestFruit,
    strawberry: imgToppingStrawberry,
  },
  slogans: {
    slogan1: imgSugar1,
    slogan2: imgSugar2,
    slogan3: imgKhatraCategory,
  },
  syrups: {
    biscuit: imgSyrupBiscuit,
    caramel: imgSyrupCaramel,
    noisette: imgSyrupNoisette,
    toffeNut: imgSyrupToffe,
    // aliases used by services/dataAdapters.js fallbacks
    toffe: imgSyrupToffe,
    syrup3: imgSyrupCategory,
  },
};

// Real Google Maps hero photo per location (downloaded Nov 21, 2026
// from each listing), keyed by store id ('s1', 's2', ...). Locations
// whose listing has no photo are absent here — src/data/stores.js
// falls back to the Khatra logo for those.
const storePhotoModules = import.meta.glob('./stores/*', { eager: true, query: '?url', import: 'default' });
export const storePhotos = Object.fromEntries(
  Object.entries(storePhotoModules).map(([path, url]) => [path.split('/').pop().replace(/\.[^.]+$/, ''), url]),
);

export default Images;
