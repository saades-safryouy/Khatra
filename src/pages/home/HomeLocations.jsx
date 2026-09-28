import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useData } from "../../context/DataContext";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { useGeolocation } from "../../hooks/useGeolocation";
import { sortStoresByDistance, formatDistance } from "../../utils/geo";
import { ArrowRight, MapPin } from "../../components/Icons";
import { useLang } from "../../context/LanguageContext";

const E = [0.22, 1, 0.36, 1];

export function HomeLocations() {
  const { stores } = useData();
  const { t, lang } = useLang();
  const { ref, isInView } = useScrollReveal();
  const { coords, loading: geoLoading, error: geoError, locate } = useGeolocation();

  // If user location is available, sort and pick the 3 nearest stores. Otherwise default first 3.
  const displayedStores = useMemo(() => {
    const raw = stores || [];
    if (coords) {
      return sortStoresByDistance(raw, coords.latitude, coords.longitude).slice(0, 3);
    }
    return raw.slice(0, 3);
  }, [stores, coords]);

  return (
    <section className="home-locations" ref={ref}>
      <div className="container">
        <motion.div
          className="home-locations__head"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: E }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span className="eyebrow">{t('Réseau')}</span>
              <h2>{t('Retrouvez-nous près de chez vous')}</h2>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                type="button"
                onClick={locate}
                disabled={geoLoading}
                className={`btn btn-sm ${coords ? 'btn-primary' : 'btn-outline'}`}
                style={{ borderRadius: '24px' }}
              >
                {geoLoading ? (
                  <span>{t('Localisation en cours...')}</span>
                ) : coords ? (
                  <span>✓ {t('À proximité')}</span>
                ) : (
                  <span>📍 {t('Trouver près de moi')}</span>
                )}
              </button>
            </div>
          </div>

          {geoError && (
            <div style={{
              marginTop: '12px',
              fontSize: '0.82rem',
              color: 'var(--bordeaux)',
              background: 'rgba(92,29,36,0.08)',
              padding: '8px 14px',
              borderRadius: 'var(--radius)'
            }}>
              {geoError === 'PERMISSION_DENIED'
                ? t('Autorisation de géolocalisation refusée.')
                : t('Impossible d’obtenir votre position.')}
            </div>
          )}
        </motion.div>

        <div className="location-preview-grid">
          {displayedStores.map((store, idx) => {
            const isNearest = coords && idx === 0;

            return (
              <motion.article
                key={store.id}
                className={`location-preview-card${isNearest ? ' location-preview-card--nearest' : ''}`}
                initial={{ opacity: 0, y: 36 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.75, ease: E, delay: 0.08 + idx * 0.12 }}
              >
                <div className="location-preview-card__img">
                  <img src={store.img} alt={store.name} loading="lazy" />
                  {isNearest && (
                    <span className="location-nearest-label">
                      {t('Le plus proche')}
                    </span>
                  )}
                </div>
                <div className="location-preview-card__body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span className="eyebrow" style={{ margin: 0 }}>{t(store.city)}</span>
                    {store.distanceKm != null && (
                      <span style={{
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: 'var(--bordeaux)',
                        background: 'rgba(92,29,36,0.08)',
                        padding: '2px 8px',
                        borderRadius: '12px'
                      }}>
                        {formatDistance(store.distanceKm, lang)}
                      </span>
                    )}
                  </div>
                  <h3>{t(store.name)}</h3>
                  <p>
                    <MapPin s={15} />
                    <span>{store.address}</span>
                  </p>
                  {store.mapsUrl && (
                    <a href={store.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-text">
                      {t('Voir sur la carte')}
                    </a>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>

        <motion.div
          className="home-locations__cta"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, ease: E, delay: 0.45 }}
        >
          <Link to="/points-de-vente" className="btn btn-primary">
            {t('Voir tous les points de vente')} <ArrowRight s={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default HomeLocations;
