import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useLang } from '../context/LanguageContext';
import { useGeolocation } from '../hooks/useGeolocation';
import { sortStoresByDistance, formatDistance } from '../utils/geo';
import { MapPin, ArrowUpRight, ArrowRight } from '../components/Icons';
import SEO from '../components/SEO';
import StoreMap from '../components/StoreMap';

export function LocationsPage() {
  const { stores, locations } = useData();
  const { t, lang } = useLang();
  const [selectedCity, setSelectedCity] = useState('Toutes');
  const { coords, loading: geoLoading, error: geoError, locate, clear: clearGeo } = useGeolocation();

  const cities = useMemo(() => {
    return [
      'Toutes',
      ...Array.from(
        new Set([
          ...(locations || []).map((l) => l.city || l.name),
          ...(stores || []).map((s) => s.city),
        ])
      ).filter(Boolean),
    ];
  }, [locations, stores]);

  const processedStores = useMemo(() => {
    let list = stores || [];
    if (selectedCity !== 'Toutes') {
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
        description="Découvrez nos coffee shops et points de vente Khatra à Casablanca, Rabat, Marrakech et Tanger."
      />

      {/* Page Header */}
      <div className="page-header no-image">
        <div className="page-header-inner">
          <span className="eyebrow">{t('Réseau & Présence')}</span>
          <h1>{t('Points de Vente')}</h1>
          <p>
            {t('Vivez l’expérience Khatra au Maroc : dégustation de cafés de spécialité, conseil barista et achat direct de produits.')}
          </p>
        </div>
      </div>

      {/* Geolocation + City Filter Bar */}
      <div style={{ background: 'var(--linen)', borderBottom: '1px solid rgba(42,30,23,0.08)', padding: '20px 0', position: 'sticky', top: 'var(--nav-h)', zIndex: 10 }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px', maxWidth: '100%' }}>
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`btn btn-sm ${selectedCity === city ? 'btn-primary' : 'btn-outline-dark'}`}
                style={{ padding: '6px 16px', borderRadius: '30px', fontSize: '0.75rem' }}
              >
                {city === 'Toutes' ? t('Toutes les villes') : t(city)}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={coords ? clearGeo : locate}
              disabled={geoLoading}
              className={`btn btn-sm ${coords ? 'btn-primary' : 'btn-outline'}`}
              style={{ borderRadius: '30px', padding: '6px 16px', fontSize: '0.75rem' }}
            >
              {geoLoading ? (
                <span>{t('Localisation...')}</span>
              ) : coords ? (
                <span>✓ {t('Autour de moi')} ({t('Effacer')})</span>
              ) : (
                <span>📍 {t('À proximité')}</span>
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
              {geoError === 'PERMISSION_DENIED'
                ? t('Autorisation de géolocalisation refusée par votre navigateur.')
                : t('Position géographique indisponible.')}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Map Section */}
      <div className="container" style={{ marginTop: '40px' }}>
        <StoreMap stores={processedStores} userCoords={coords} height="480px" />
      </div>

      {/* Locations Grid */}
      <div className="container section">
        <div className="locations-grid" style={{ padding: 0 }}>
          {processedStores.map((store, idx) => {
            const isNearest = coords && idx === 0;

            return (
              <div
                key={store.id}
                className="location-card"
                style={isNearest ? { border: '2px solid var(--caramel)', position: 'relative' } : undefined}
              >
                <div className="location-card-img" style={{ position: 'relative' }}>
                  <img src={store.img} alt={store.name} loading="lazy" />
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
                        {formatDistance(store.distanceKm, lang)}
                      </span>
                    )}
                  </div>
                  <h3>{t(store.name)}</h3>
                  <p style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'var(--dark-s)', fontSize: '0.88rem' }}>
                    <span style={{ color: 'var(--toffee)', flexShrink: 0, marginTop: '2px' }}><MapPin s={16} /></span>
                    <span>{store.address}</span>
                  </p>
                  <div style={{ fontSize: '0.8rem', color: 'var(--toffee)', marginBottom: '20px' }}>
                    ⏱ {store.hours}
                  </div>
                  {store.mapsUrl && (
                    <a
                      href={store.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
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
        </div>
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
