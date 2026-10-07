import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useData } from '../../context/DataContext';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { ArrowRight, MapPin } from '../../components/Icons';
import { useLang } from '../../context/LanguageContext';

const EASE = [0.22, 1, 0.36, 1];

export function HomeLocations() {
  const { stores } = useData();
  const { t } = useLang();
  const { ref, isInView } = useScrollReveal();
  const displayedStores = (stores || []).filter((store) => store.active !== false).slice(0, 3);

  return (
    <section className="locations-editorial-section" ref={ref}>
      <div className="container">
        <motion.div
          className="locations-editorial__header"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: EASE }}
        >
          <div className="locations-editorial__header-main">
            <div>
              <span className="eyebrow">{t('Réseau & Présence')}</span>
              <h2>{t('Retrouvez nos points de vente au Maroc')}</h2>
              <p className="locations-editorial__intro">
                {t('Retrouvez l’expérience Khatra dans nos différents points de vente à travers le Maroc.')}
              </p>
            </div>
          </div>
        </motion.div>

        <div className="locations-editorial__grid">
          {displayedStores.map((store, idx) => (
            <motion.article
              key={store.id}
              className="location-editorial-card"
              initial={{ opacity: 0, y: 36 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.75, ease: EASE, delay: 0.08 + idx * 0.12 }}
            >
              <div className="location-editorial-card__img-box">
                <img src={store.img} alt={store.name} data-no-translate loading="lazy" />
                <span className="location-editorial-card__city-tag">{t(store.city)}</span>
              </div>

              <div className="location-editorial-card__body">
                <div className="location-editorial-card__top">
                  <h3 data-no-translate>{store.name}</h3>
                </div>
                <p className="location-editorial-card__addr">
                  <MapPin s={14} />
                  <span>{store.address}</span>
                </p>
                {store.mapsUrl && (
                  <a
                    href={store.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="location-editorial-card__map-link"
                  >
                    {t('Voir l’itinéraire sur la carte')} <ArrowRight s={12} />
                  </a>
                )}
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          className="locations-editorial__cta"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, ease: EASE, delay: 0.4 }}
        >
          <Link to="/points-de-vente" className="btn btn-outline-dark">
            {t('Où nous trouver ?')} <ArrowRight s={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default HomeLocations;
