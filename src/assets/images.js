/* ============================================================
   KHATRA ASSETS REGISTRY
   ============================================================ */

import bgHero from './design/Background.jpeg';

// Integrated bubbles photography
import imgAllBubbles from './design/BUBLES/BUBBELS CATEGORY.jpg';
import imgBubblesFrais from './design/BUBLES/BUBBLES FRAIS.jpg';
import imgBubblesMangue from './design/BUBLES/BUBBLES MANGUE.jpg';
import imgBubblesPassion from './design/BUBLES/BUBBLES PASSION.jpg';

// Integrated coffee photography
import imgKhatra3 from './design/KHATRA GRAIN/KHATRA CATEGORY.jpg';
import imgGrain from './design/hero-bg.jpg';
import imgGrain2 from './design/KHATRA GRAIN/KHATRA EXTRA DORE.jpg';
import imgKhatra360 from './design/KHATRA GRAIN/KHATRA EXPRESSO.jpg';
import imgPackaging from './design/KHATRA GRAIN/KHATRA CATEGORY.jpg';

// Integrated Nidsys syrup photography
import imgSyrup3 from './design/NINDYS SIROP/NINDYS SIROP CATEGORY.jpg';
import imgBiscuit from './design/NINDYS SIROP/NINDYS SIROP BISCUIT.jpg';
import imgKiwi from './design/NINDYS SIROP/NINDYS SIROP CATEGORY.jpg';
import imgRaisin from './design/NINDYS SIROP/NINDYS SIROP FRUIT DE BOITS.jpg';

// Integrated branded product images used in story content
import imgSlogan1 from './design/SUGAR/SUGAR KHATRA1.jpg';
import imgSlogan2 from './design/SUGAR/SUGAR KHATRA2.jpg';
import imgSlogan3 from './design/KHATRA GRAIN/KHATRA CATEGORY.jpg';

// Integrated individual syrup bottle photography
import imgSyrupBiscuit from './design/SIROP/SIROP BISCUIT.jpg';
import imgSyrupCaramel from './design/SIROP/SIROP CARAMEL.jpg';
import imgSyrupNoisette from './design/SIROP/SIROP NOISETTE.jpg';
import imgSyrupToffe from './design/SIROP/SIROP TOFEE NUT.jpg';

export const Images = {
  bgHero,
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
    brand3: imgKhatra3,
  },
  nidsys: {
    syrupTrio: imgSyrup3,
    biscuit: imgBiscuit,
    kiwi: imgKiwi,
    raisin: imgRaisin,
  },
  slogans: {
    slogan1: imgSlogan1,
    slogan2: imgSlogan2,
    slogan3: imgSlogan3,
  },
  syrups: {
    biscuit: imgSyrupBiscuit,
    caramel: imgSyrupCaramel,
    noisette: imgSyrupNoisette,
    toffeNut: imgSyrupToffe,
  },
};

export default Images;
