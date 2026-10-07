import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLang } from '../context/LanguageContext';
import { formatDistance } from '../utils/geo';
import { CARTO_TILE_URL } from '../utils/mapTiles';
import { ArrowUpRight } from './Icons';

// Custom SVG Icons using exact Khatra Palette
const storeIcon = L.divIcon({
  className: 'khatra-map-marker',
  html: `<div style="
    background: #5C1D24;
    width: 32px;
    height: 32px;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(42,30,23,0.35);
    border: 2px solid #FFFFFF;
  ">
    <div style="
      width: 10px;
      height: 10px;
      background: #C5A06A;
      border-radius: 50%;
      transform: rotate(45deg);
    "></div>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const userIcon = L.divIcon({
  className: 'khatra-user-marker',
  html: `<div style="
    position: relative;
    width: 24px;
    height: 24px;
  ">
    <div style="
      position: absolute;
      inset: -4px;
      background: rgba(197, 160, 106, 0.4);
      border-radius: 50%;
      animation: pulse 2s infinite ease-in-out;
    "></div>
    <div style="
      width: 24px;
      height: 24px;
      background: #C5A06A;
      border: 3px solid #FFFFFF;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    "></div>
  </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -14],
});

function MapRecenter({ userCoords, stores }) {
  const map = useMap();

  useEffect(() => {
    if (userCoords) {
      map.flyTo([userCoords.latitude, userCoords.longitude], 12, { duration: 1.5 });
    } else if (stores && stores.length > 0) {
      const valid = stores.filter((s) => s.latitude != null && s.longitude != null);
      if (valid.length > 0) {
        const bounds = L.latLngBounds(valid.map((s) => [s.latitude, s.longitude]));
        map.fitBounds(bounds, { padding: [40, 40] });
      }
    }
  }, [userCoords, stores, map]);

  return null;
}

export function StoreMap({ stores = [], userCoords = null, height = '450px', selectedStoreId = null, onSelectStore = null }) {
  const { t, lang } = useLang();

  const validStores = useMemo(
    () => stores.filter((s) => s.latitude != null && s.longitude != null),
    [stores]
  );

  // Default center of Morocco (Casablanca / Rabat area)
  const defaultCenter = [33.5731, -7.5898];

  return (
    <div className="store-map-container" style={{ height, width: '100%', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
      <MapContainer
        center={defaultCenter}
        zoom={6}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url={CARTO_TILE_URL}
        />

        <MapRecenter userCoords={userCoords} stores={validStores} />

        {userCoords && (
          <Marker position={[userCoords.latitude, userCoords.longitude]} icon={userIcon}>
            <Popup>
              <div style={{ textAlign: 'center', padding: '4px' }}>
                <strong style={{ color: 'var(--bordeaux)', display: 'block', marginBottom: '4px' }}>
                  {t('Votre position')}
                </strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--dark-s)' }}>
                  {t('Précision')} ~{Math.round(userCoords.accuracy || 0)}m
                </span>
              </div>
            </Popup>
          </Marker>
        )}

        {validStores.map((store) => (
          <Marker key={store.id} position={[store.latitude, store.longitude]} icon={storeIcon}>
            <Popup>
              <div className="store-map-popup" style={{ minWidth: '200px', padding: '4px' }}>
                <span className="eyebrow" style={{ color: 'var(--bordeaux)', fontSize: '0.62rem', marginBottom: '4px', display: 'block' }}>
                  {t(store.city)} · {store.type}
                </span>
                <h4 data-no-translate style={{ margin: '0 0 6px', fontSize: '1rem', color: 'var(--dark)' }}>
                  {store.name}
                </h4>
                <p style={{ margin: '0 0 8px', fontSize: '0.82rem', color: 'var(--dark-s)', lineHeight: 1.4 }}>
                  {store.address}
                </p>
                {store.distanceKm != null && (
                  <div style={{
                    display: 'inline-block',
                    background: 'var(--linen)',
                    color: 'var(--bordeaux)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '12px',
                    marginBottom: '10px'
                  }}>
                    📍 {formatDistance(store.distanceKm, lang)}
                  </div>
                )}
                {store.mapsUrl && (
                  <a
                    href={store.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm"
                    style={{ width: '100%', justifyContent: 'center', padding: '6px 12px', fontSize: '0.72rem' }}
                  >
                    {t('Itinéraire')} <ArrowUpRight s={12} />
                  </a>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default StoreMap;
