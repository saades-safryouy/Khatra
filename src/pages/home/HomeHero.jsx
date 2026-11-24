import React from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import bagDore from '../../assets/design/KHATRA_EXTRA_DORE-removebg-preview.png';
import bagKhatra from '../../assets/design/KHATRA_EXPRESSO-removebg-preview.png';
import bagPrestige from '../../assets/design/Cafe_Prestige-removebg.png';

/**
 * Home hero — slogan only, and the three coffee bags floating in a
 * smooth 3D stage (mouse parallax on desktop, gentle idle sway and
 * per-bag float everywhere). No other text, by design.
 */
const BAGS = [
  { src: bagDore, alt: 'Café Extra Doré', slot: 'left', float: 6.5, delay: 0.55 },
  { src: bagKhatra, alt: 'Café Khatra', slot: 'center', float: 5.6, delay: 0.3 },
  { src: bagPrestige, alt: 'Café Prestige', slot: 'right', float: 7.2, delay: 0.8 },
];

export function HomeHero() {
  const reduceMotion = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-11, 11]), { stiffness: 55, damping: 16, mass: 0.6 });
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), { stiffness: 55, damping: 16, mass: 0.6 });

  const onMouseMove = (e) => {
    if (reduceMotion) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onMouseLeave = () => { mx.set(0); my.set(0); };

  const scrollToNextSection = () => {
    window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
  };

  return (
    <section
      className="hero-showcase hero-3d"
      aria-label="Hero Khatra"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <motion.h1
        className="hero-showcase__headline hero-3d__headline"
        initial={{ opacity: 0, y: -26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <span>NCHORBOHA</span>
        <span>KHAAATRA</span>
      </motion.h1>

      <div className="hero-3d__stage" aria-hidden="false">
        <div className="hero-3d__glow" aria-hidden="true" />
        <motion.div
          className="hero-3d__sway"
          style={{ transformStyle: 'preserve-3d' }}
          animate={reduceMotion ? undefined : { rotateY: [-2.4, 2.4, -2.4] }}
          transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
        >
          <motion.div
            className="hero-3d__tilt"
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          >
            {BAGS.map((bag) => (
              <div key={bag.slot} className={`hero-3d__bag hero-3d__bag--${bag.slot}`}>
                <motion.div
                  initial={{ opacity: 0, y: 110 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.05, delay: bag.delay, ease: [0.22, 1, 0.36, 1] }}
                >
                  <motion.img
                    src={bag.src}
                    alt={bag.alt}
                    draggable="false"
                    animate={reduceMotion ? undefined : { y: [0, -13, 0] }}
                    transition={{ duration: bag.float, repeat: Infinity, ease: 'easeInOut', delay: bag.delay }}
                  />
                </motion.div>
                <motion.span
                  className="hero-3d__shadow"
                  aria-hidden="true"
                  animate={reduceMotion ? undefined : { scaleX: [1, 0.86, 1], opacity: [0.55, 0.38, 0.55] }}
                  transition={{ duration: bag.float, repeat: Infinity, ease: 'easeInOut', delay: bag.delay }}
                />
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <button
        type="button"
        className="hero-showcase__scroll"
        onClick={scrollToNextSection}
        aria-label="Défiler vers la suite"
      >
        <span className="hero-showcase__scroll-arrow" aria-hidden="true" />
      </button>
    </section>
  );
}

export default HomeHero;
