import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { MapPin, ArrowUpRight, ArrowRight } from '../components/Icons';
import SEO from '../components/SEO';

export function LocationsPage() {
  const { stores } = useData();
  const [selectedCity, setSelectedCity] = useState('Toutes');

  const cities = ['Toutes', ...Array.from(new Set(stores.map(s => s.city)))];

  const filteredStores = selectedCity === 'Toutes'
    ? stores
    : stores.filter(s => s.city === selectedCity);

  return (
    <div className="locations-page">
      <SEO
        title="Points de Vente"
        description="Découvrez nos coffee shops et points de vente Khatra à Casablanca, Rabat, Marrakech et Tanger."
      />

      {/* Page Header */}
      <div className="page-header no-image">
        <div className="page-header-inner">
          <span className="eyebrow">Réseau & Présence</span>
          <h1>Points de Vente</h1>
          <p>
            Vivez l’expérience Khatra au Maroc : dégustation de cafés de spécialité, conseil barista et achat direct de produits.
          </p>
        </div>
      </div>

      {/* City Filters */}
      <div style={{ background: 'var(--linen)', borderBottom: '1px solid rgba(42,30,23,0.08)', padding: '24px 0', position: 'sticky', top: 'var(--nav-h)', zIndex: 10 }}>
        <div className="container" style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
          {cities.map(city => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`btn btn-sm ${selectedCity === city ? 'btn-primary' : 'btn-outline-dark'}`}
              style={{ padding: '8px 20px', borderRadius: '30px' }}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Locations Grid */}
      <div className="container section">
        <div className="locations-grid" style={{ padding: 0 }}>
          {filteredStores.map(store => (
            <div key={store.id} className="location-card">
              <div className="location-card-img">
                <img src={store.img} alt={store.name} loading="lazy" />
              </div>
              <div className="location-card-body">
                <span className="eyebrow" style={{ color: 'var(--bordeaux)' }}>{store.city} · {store.type}</span>
                <h3>{store.name}</h3>
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
                    Itinéraire Google Maps <ArrowUpRight s={14} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Franchise Callout */}
      <section style={{ background: 'var(--dark)', color: '#fff', padding: '80px 0' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '700px' }}>
          <span className="eyebrow" style={{ color: 'var(--caramel-l)' }}>Expansion Nationale</span>
          <h2 style={{ color: '#fff', marginBottom: '16px' }}>Votre ville n’est pas encore couverte ?</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '32px' }}>
            Devenez le partenaire exclusif Khatra dans votre région et implantez le premier Coffee Shop ou Khatra Market de votre ville.
          </p>
          <Link to="/contact" className="btn btn-primary">
            Proposer un emplacement <ArrowRight s={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default LocationsPage;
