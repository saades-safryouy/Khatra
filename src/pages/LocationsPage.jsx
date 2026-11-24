import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import { useLang } from '../context/LanguageContext';
import { useGeolocation } from '../hooks/useGeolocation';
import { sortStoresByDistance, formatDistance } from '../utils/geo';
import { MapPin, ArrowUpRight, ArrowRight, ArrowLeft } from '../components/Icons';
import Images from '../assets/images';
import SEO from '../components/SEO';
import StoreMap from '../components/StoreMap';

export function LocationsPage() {
  const { stores } = useData();
  const { t, lang } = useLang();
  // Drill-down level: null = whole of Morocco (city badges on the
  // map, every card below); a city name = that city's stores only.
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const { coords, loading: geoLoading, error: geoError, locate, clear: clearGeo } = useGeolocation();

  // Cities with their store counts, biggest network first.
  const cityGroups = useMemo(() => {
    const counts = new Map();
    (stores || []).forEach((s) => {
      if (!s.city) return;
      counts.set(s.city, (counts.get(s.city) || 0) + 1);
    });
    return [...counts.entries()]
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count || a.city.localeCompare(b.city, 'fr'));
  }, [stores]);

  // The single nearest store once the visitor is geolocated.
  const nearestStore = useMemo(() => {
    if (!coords || !stores || stores.length === 0) return null;
    return sortStoresByDistance(stores, coords.latitude, coords.longitude)[0] || null;
  }, [coords, stores]);

  // Finder success: drill into the nearest store's city and focus
  // the store itself — the map flies there, its popup opens and
  // its card is badged "Le plus proche". (State adjusted during
  // render, the React-endorsed pattern for prop/state changes.)
  const [prevCoords, setPrevCoords] = useState(null);
  if (coords !== prevCoords) {
    setPrevCoords(coords);
    if (coords && nearestStore) {
      setSelectedCity(nearestStore.city);
      setSelectedStoreId(nearestStore.id);
    }
  }

  const selectCity = (city) => {
    setSelectedCity(city);
    setSelectedStoreId(null);
  };

  const handleFinderClick = () => {
    setSelectedStoreId(null);
    if (coords) {
      clearGeo();
    } else {
      locate();
    }
  };

  const handleSelectStore = (storeId) => {
    const store = (stores || []).find((s) => s.id === storeId);
    if (store && store.city && store.city !== selectedCity) {
      setSelectedCity(store.city);
    }
    setSelectedStoreId(storeId);
    document.getElementById('stores-map')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const processedStores = useMemo(() => {
    let list = stores || [];
    if (selectedCity) {
      list = list.filter((s) => s.city === selectedCity);
    }
    if (coords) {
      return sortStoresByDistance(list, coords.latitude, coords.longitude);
    }
    return list;
  }, [stores, selectedCity, coords]);

  return (
    <div className="locations-page">
      <SEO
        title="Points de Vente"
        description="Découvrez notre point de vente Khatra Market à Casablanca et trouvez le Khatra le plus proche de vous."
      />

      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-bg">
          <picture>
            <source media="(max-width: 768px)" srcSet={Images.heroes.locations.mobile} />
            <img src={Images.heroes.locations.desktop} alt="" />
          </picture>
        </div>
        <div className="page-header-overlay" />
        <div className="page-header-inner">
          <span className="eyebrow">{t('Réseau & Présence')}</span>
          <h1>{t('Points de Vente')}</h1>
          <p>
            {t('Vivez l’expérience Khatra au Maroc : dégustation de cafés de spécialité, conseil barista et achat direct de produits.')}
          </p>
        </div>
      </div>

      {/* Geolocation + City Filter Bar (city chips: phones only —
          desktop uses the "Villes" panel beside the map) */}
      <div style={{ background: 'var(--linen)', borderBottom: '1px solid rgba(42,30,23,0.08)', padding: '20px 0', position: 'sticky', top: 'var(--nav-h)', zIndex: 10 }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div className="locations-city-chips">
            {selectedCity && (
              <button
                type="button"
                onClick={() => selectCity(null)}
                className="btn btn-sm btn-primary"
                style={{ padding: '6px 16px', borderRadius: '30px', fontSize: '0.75rem', flex: '0 0 auto', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <ArrowLeft s={12} /> {t('Tout le Maroc')}
              </button>
            )}
            {cityGroups.map(({ city, count }) => (
              <button
                key={city}
                type="button"
                onClick={() => selectCity(city)}
                className={`btn btn-sm ${selectedCity === city ? 'btn-primary' : 'btn-outline-dark'}`}
                style={{ padding: '6px 16px', borderRadius: '30px', fontSize: '0.75rem', flex: '0 0 auto', whiteSpace: 'nowrap' }}
              >
                {t(city)} · {count}
              </button>
            ))}
          </div>

          <div className="nearest-finder-wrap" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={handleFinderClick}
              disabled={geoLoading}
              className={`btn nearest-finder-btn ${coords ? 'btn-primary' : 'btn-outline'}`}
            >
              {geoLoading ? (
                <span>{t('Localisation...')}</span>
              ) : coords ? (
                <span>✓ {t('Autour de moi')} ({t('Effacer')})</span>
              ) : (
                <span>📍 {t('Trouver le Khatra le plus proche')}</span>
              )}
            </button>
          </div>
        </div>

        {geoError && (
          <div className="container" style={{ marginTop: '10px' }}>
            <div style={{
              fontSize: '0.8rem',
              color: 'var(--bordeaux)',
              background: 'rgba(92,29,36,0.08)',
              padding: '6px 12px',
              borderRadius: 'var(--radius)'
            }}>
              {t('Position non disponible — voici nos points de vente.')}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Map Section — "Villes" panel + Morocco map */}
      <div className="container" id="stores-map" style={{ marginTop: '40px', scrollMarginTop: 'calc(var(--nav-h) + 12px)' }}>
        <div className="locations-map-layout">
          <motion.aside
            className="locations-city-panel"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <h2 className="locations-city-panel__title">{t('Villes')}</h2>
            <div className="locations-city-list">
              {selectedCity && (
                <button
                  type="button"
                  className="locations-city-row locations-city-row--back"
                  onClick={() => selectCity(null)}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <ArrowLeft s={14} /> {t('Tout le Maroc')}
                  </span>
                </button>
              )}
              {cityGroups.map(({ city, count }) => (
                <button
                  key={city}
                  type="button"
                  className={`locations-city-row${selectedCity === city ? ' is-active' : ''}`}
                  onClick={() => selectCity(city)}
                >
                  <span className="locations-city-name">{t(city)}</span>
                  <span className="locations-city-count">{count}</span>
                </button>
              ))}
            </div>
          </motion.aside>

          <div className="locations-map-wrap">
            <StoreMap
              stores={stores || []}
              userCoords={coords}
              height="480px"
              selectedCity={selectedCity}
              onSelectCity={selectCity}
              selectedStoreId={selectedStoreId}
              onSelectStore={setSelectedStoreId}
            />
          </div>
        </div>
      </div>

      {/* Locations Grid */}
      <div className="container section">
        {selectedCity && (
          <div className="locations-results-head">
            <h2 style={{ margin: 0 }}>{t(selectedCity)}</h2>
            <span className="locations-results-count">
              {processedStores.length} {t('Points de vente')}
            </span>
            <button
              type="button"
              onClick={() => selectCity(null)}
              className="btn btn-outline-dark btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <ArrowLeft s={14} /> {t('Tout le Maroc')}
            </button>
          </div>
        )}
        <motion.div
          className="locations-grid"
          style={{ padding: 0 }}
          key={selectedCity || 'all'}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          {processedStores.map((store) => {
            const isNearest = Boolean(nearestStore && store.id === nearestStore.id);

            return (
              <div
                key={store.id}
                className="location-card"
                onClick={() => handleSelectStore(store.id)}
                style={isNearest ? { border: '2px solid var(--caramel)', position: 'relative' } : undefined}
              >
                <div className={`location-card-img${store.imgLogo ? ' location-card-img--logo' : ''}`} style={{ position: 'relative' }}>
                  <img src={store.img} alt={store.name} data-no-translate loading="lazy" />
                  {isNearest && (
                    <span style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: 'var(--bordeaux)',
                      color: 'var(--white)',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '4px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      zIndex: 2,
                    }}>
                      ★ {t('Le plus proche')}
                    </span>
                  )}
                </div>
                <div className="location-card-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span className="eyebrow" style={{ color: 'var(--bordeaux)', margin: 0 }}>
                      {t(store.city)} · {store.type}
                    </span>
                    {store.distanceKm != null && (
                      <span style={{
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: 'var(--bordeaux)',
                        background: 'rgba(92,29,36,0.08)',
                        padding: '2px 8px',
                        borderRadius: '12px',
                      }}>
                        {lang === 'ar' ? formatDistance(store.distanceKm, lang) : `à ${formatDistance(store.distanceKm, lang)}`}
                      </span>
                    )}
                  </div>
                  <h3 data-no-translate>{store.name}</h3>
                  <p style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'var(--dark-s)', fontSize: '0.88rem' }}>
                    <span style={{ color: 'var(--toffee)', flexShrink: 0, marginTop: '2px' }}><MapPin s={16} /></span>
                    <span>{store.address}</span>
                  </p>
                  {store.hours && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--toffee)', marginBottom: '20px' }}>
                      ⏱ {store.hours}
                    </div>
                  )}
                  {store.mapsUrl && (
                    <a
                      href={store.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="btn btn-outline-dark btn-sm"
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      {t('Itinéraire Google Maps')} <ArrowUpRight s={14} />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Franchise Callout */}
      <section style={{ background: 'var(--dark)', color: '#fff', padding: '80px 0' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '700px' }}>
          <span className="eyebrow" style={{ color: 'var(--caramel-l)' }}>{t('Expansion Nationale')}</span>
          <h2 style={{ color: '#fff', marginBottom: '16px' }}>{t('Votre ville n’est pas encore couverte ?')}</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '32px' }}>
            {t('Devenez le partenaire exclusif Khatra dans votre région et implantez le premier Coffee Shop ou Khatra Market de votre ville.')}
          </p>
          <Link to="/contact" className="btn btn-primary">
            {t('Proposer un emplacement')} <ArrowRight s={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default LocationsPage;
