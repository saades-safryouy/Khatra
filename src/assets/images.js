/* ============================================================
   KHATRA ASSETS REGISTRY
   ============================================================ */

import bgHero from './design/Background.jpeg';

// Bubbles
import imgAllBubbles from './design/Bubbles/AllBubbles.png';
import imgBubblesFrais from './design/Bubbles/BubblesFrais.png';
import imgBubblesMangue from './design/Bubbles/BubblesMangue.png';
import imgBubblesPassion from './design/Bubbles/BublesPqssionFruit.png';

// Khatra Coffee & Branding
import imgKhatra3 from './design/Khatra/3.jpg';
import imgGrain from './design/Khatra/grain.jpg';
import imgGrain2 from './design/Khatra/khatra grain.jpg';
import imgKhatra360 from './design/Khatra/Khatra360.jpg';
import imgPackaging from './design/Khatra/PackaginGrainKhatra.jpg';

// Nidsys & Syrups
import imgSyrup3 from './design/Nidsys/3Syrup.png';
import imgBiscuit from './design/Nidsys/Biscuit.jpg';
import imgKiwi from './design/Nidsys/Kiwi.jpg';
import imgRaisin from './design/Nidsys/Raisin.jpg';

// Posts & Slogans
import imgSlogan1 from './design/Post/Slogan1.jpg';
import imgSlogan2 from './design/Post/Slogan2.jpg';
import imgSlogan3 from './design/Post/Slogan3.jpg';

// Syrup individual bottles
import imgSyrupBiscuit from './design/syrup/BiscuitSyrup.jpg';
import imgSyrupCaramel from './design/syrup/CaramelSyrup.jpg';
import imgSyrupNoisette from './design/syrup/NoisetteSyrup.jpg';
import imgSyrupToffe from './design/syrup/ToffeNutSyrup.jpg';

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
