import React, { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLang } from '../context/LanguageContext';
import { formatDistance, calculateDistanceKm } from '../utils/geo';
import { CARTO_TILE_URL } from '../utils/mapTiles';
import { ArrowUpRight, ArrowLeft } from './Icons';

// ── Morocco-only framing ─────────────────────────────────────
// The visitor can pan/zoom freely inside Morocco but never out
// of it: maxBounds clamps the view to the country extent and
// minZoom keeps the whole country as the widest possible view.
const MOROCCO_MAX_BOUNDS = [[27.0, -14.0], [36.5, -0.5]];
const MOROCCO_CENTER = [31.9, -6.9];
const FLY_DURATION = 1.4; // seconds — every camera move is animated

// Shared pin body (existing burgundy teardrop + gold dot).
const PIN_HTML = `
  <div style="
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
  </div>`;

// Custom SVG Icons using exact Khatra Palette
const storeIcon = L.divIcon({
  className: 'khatra-map-marker',
  html: PIN_HTML,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Selected / nearest store: same pin wrapped in a soft pulse ring
// (ring animation lives in frontend.css — .khatra-marker-pulse).
const storeIconActive = L.divIcon({
  className: 'khatra-map-marker khatra-map-marker--active',
  html: `<div style="position: relative; width: 32px; height: 32px;">
    <div class="khatra-marker-pulse"></div>
    ${PIN_HTML}
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Level-1 city badge: one burgundy numbered pin per city
// (% Arabica pattern, Khatra colours). Cached per count.
const badgeIconCache = new Map();
function cityBadgeIcon(count) {
  if (!badgeIconCache.has(count)) {
    badgeIconCache.set(count, L.divIcon({
      className: 'khatra-city-badge',
      html: `<div class="khatra-city-badge__pin"><span>${count}</span></div>`,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    }));
  }
  return badgeIconCache.get(count);
}

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

// Drives every camera move. Priority: an explicitly focused store
// (card click, marker click, nearest-store finder) flies in at
// street level and opens its popup; otherwise a level change
// (country ⇄ city) flies to that level's bounds. Moves only fire
// on an actual state change, so unrelated re-renders never
// re-fly the camera.
function MapController({ mode, selectedCity, cityStores, moroccoBounds, focusStore, markerRefs }) {
  const map = useMap();
  const prevRef = useRef({ mode: null, city: null, focusId: null });

  useEffect(() => {
    const prev = prevRef.current;
    let timer;

    if (focusStore) {
      if (prev.focusId !== focusStore.id || prev.mode !== mode) {
        map.flyTo(
          [focusStore.latitude, focusStore.longitude],
          Math.max(map.getZoom(), 15),
          { duration: FLY_DURATION }
        );
        const marker = markerRefs.current[focusStore.id];
        if (marker) {
          timer = setTimeout(() => marker.openPopup(), FLY_DURATION * 1000 + 150);
        }
      }
    } else if (mode === 'city') {
      if (prev.mode !== 'city' || prev.city !== selectedCity || prev.focusId != null) {
        if (cityStores.length === 1) {
          map.flyTo([cityStores[0].latitude, cityStores[0].longitude], 14, { duration: FLY_DURATION });
        } else if (cityStores.length > 1) {
          const bounds = L.latLngBounds(cityStores.map((s) => [s.latitude, s.longitude]));
          map.flyToBounds(bounds, { padding: [50, 50], duration: FLY_DURATION });
        }
      }
    } else if (prev.mode !== 'country' || prev.focusId != null) {
      map.flyToBounds(moroccoBounds, { padding: [40, 40], duration: FLY_DURATION });
    }

    prevRef.current = { mode, city: selectedCity, focusId: focusStore ? focusStore.id : null };
    return () => { if (timer) clearTimeout(timer); };
  }, [map, mode, selectedCity, cityStores, moroccoBounds, focusStore, markerRefs]);

  return null;
}

export function StoreMap({
  stores = [],
  userCoords = null,
  height = '450px',
  selectedCity = null,
  onSelectCity = null,
  selectedStoreId = null,
  onSelectStore = null,
}) {
  const { t, lang } = useLang();
  const markerRefs = useRef({});

  const validStores = useMemo(
    () => stores.filter((s) => s.latitude != null && s.longitude != null),
    [stores]
  );

  // Level 1: one badge per city, positioned at the centroid
  // (mean of the city's store coordinates).
  const cityGroups = useMemo(() => {
    const groups = new Map();
    validStores.forEach((s) => {
      if (!s.city) return;
      if (!groups.has(s.city)) groups.set(s.city, []);
      groups.get(s.city).push(s);
    });
    return [...groups.entries()].map(([city, list]) => ({
      city,
      count: list.length,
      latitude: list.reduce((sum, s) => sum + s.latitude, 0) / list.length,
      longitude: list.reduce((sum, s) => sum + s.longitude, 0) / list.length,
    }));
  }, [validStores]);

  // Level 2: the selected city's stores (stable identity — the
  // camera controller keys its flights off this list).
  const cityStores = useMemo(
    () => (selectedCity ? validStores.filter((s) => s.city === selectedCity) : []),
    [validStores, selectedCity]
  );

  // Display copies carry a live distance once the visitor is
  // geolocated, so popups and the nearest highlight work without
  // the page having to pre-sort anything.
  const displayStores = useMemo(
    () => cityStores.map((s) => ({
      ...s,
      distanceKm: userCoords
        ? calculateDistanceKm(userCoords.latitude, userCoords.longitude, s.latitude, s.longitude)
        : (s.distanceKm ?? null),
    })),
    [cityStores, userCoords]
  );

  const nearestId = useMemo(() => {
    if (!userCoords) return null;
    let best = null;
    displayStores.forEach((s) => {
      if (s.distanceKm != null && (best == null || s.distanceKm < best.distanceKm)) best = s;
    });
    return best ? best.id : null;
  }, [userCoords, displayStores]);

  const moroccoBounds = useMemo(
    () => L.latLngBounds(validStores.map((s) => [s.latitude, s.longitude])),
    [validStores]
  );

  const mode = selectedCity ? 'city' : 'country';
  const focusStore = selectedStoreId != null
    ? displayStores.find((s) => s.id === selectedStoreId) || null
    : null;

  return (
    <div className="store-map-container" style={{ height, width: '100%', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
      <MapContainer
        center={MOROCCO_CENTER}
        zoom={5}
        minZoom={5}
        maxZoom={18}
        maxBounds={MOROCCO_MAX_BOUNDS}
        maxBoundsViscosity={1.0}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url={CARTO_TILE_URL}
        />

        <MapController
          mode={mode}
          selectedCity={selectedCity}
          cityStores={cityStores}
          moroccoBounds={moroccoBounds}
          focusStore={focusStore}
          markerRefs={markerRefs}
        />

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

        {mode === 'country' && cityGroups.map((group) => (
          <Marker
            key={group.city}
            position={[group.latitude, group.longitude]}
            icon={cityBadgeIcon(group.count)}
            eventHandlers={onSelectCity ? { click: () => onSelectCity(group.city) } : undefined}
          />
        ))}

        {mode === 'city' && displayStores.map((store) => (
          <Marker
            key={store.id}
            position={[store.latitude, store.longitude]}
            icon={store.id === selectedStoreId || store.id === nearestId ? storeIconActive : storeIcon}
            ref={(m) => { if (m) markerRefs.current[store.id] = m; }}
            eventHandlers={onSelectStore ? { click: () => onSelectStore(store.id) } : undefined}
          >
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
                {store.hours && (
                  <p style={{ margin: '0 0 8px', fontSize: '0.78rem', color: 'var(--dark-s)' }}>
                    ⏱ {store.hours}
                  </p>
                )}
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

      {selectedCity && onSelectCity && (
        <button
          type="button"
          className="khatra-map-back-btn"
          onClick={() => onSelectCity(null)}
        >
          <ArrowLeft s={14} /> {t('Tout le Maroc')}
        </button>
      )}
    </div>
  );
}

export default StoreMap;
