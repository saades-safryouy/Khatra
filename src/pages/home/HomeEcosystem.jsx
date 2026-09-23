import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Images from '../../assets/images';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { ArrowUpRight } from '../../components/Icons';

const EASE = [0.22, 1, 0.36, 1];

const CONCEPTS = [
  {
    id: 'coffee-shop',
    num: 'Concept 01',
    title: 'Khatra Coffee Shop',
    desc: 'L’expérience café de spécialité dans un univers chaleureux. Boissons signatures, méthodes douces et offre food sélectionnée.',
    img: Images.khatra.khatra360,
    alt: 'Khatra Coffee Shop',
    cta: 'Découvrir le Coffee Shop',
  },
  {
    id: 'khatra-market',
    num: 'Concept 02',
    title: 'Khatra Market',
    desc: 'Le point de distribution moderne : vente de café en grains, sirops, bubbles et accessoires pour particuliers et pros.',
    img: Images.khatra.packaging,
    alt: 'Khatra Market',
    cta: 'Découvrir Khatra Market',
  },
];

export function HomeEcosystem() {
  const { ref, isInView } = useScrollReveal();

  return (
    <section className="ecosystem" ref={ref}>
      <div className="ecosystem-inner">
        <motion.div
          className="ecosystem-header"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <div>
            <span className="eyebrow" style={{ color: 'var(--caramel-l)' }}>Et si Khatra devenait votre prochaine aventure ?</span>
            <h2 style={{ color: '#ffffff' }}>Un écosystème à fort potentiel.</h2>
          </div>
          <span className="ecosystem-mark">Franchise & Retail</span>
        </motion.div>

        <div className="eco-grid">
          {CONCEPTS.map((c, idx) => (
            <motion.article
              key={c.id}
              className="eco-card"
              initial={{ opacity: 0, y: 44 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 44 }}
              transition={{ duration: 0.85, ease: EASE, delay: 0.15 + idx * 0.14 }}
              whileHover={{ y: -6 }}
            >
              <motion.div
                className="eco-card-img"
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                <img src={c.img} alt={c.alt} loading="lazy" />
              </motion.div>
              <div className="eco-card-body">
                <span className="eyebrow">{c.num}</span>
                <h3 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '10px' }}>{c.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '20px' }}>
                  {c.desc}
                </p>
                <Link to={`/franchise/${c.id}`} className="btn btn-outline-light btn-sm">
                  {c.cta} <ArrowUpRight s={14} />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          className="ecosystem-cta"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.5 }}
        >
          <Link to="/franchise" className="btn btn-primary">
            Devenir franchisé <ArrowUpRight s={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default HomeEcosystem;
