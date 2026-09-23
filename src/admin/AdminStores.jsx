import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useData } from '../context/DataContext';
import Images from '../assets/images';
import { Plus, Edit, Trash, Check, MapPin } from '../components/Icons';
import SEO from '../components/SEO';

// Custom marker matching Khatra brand colors
const storeIcon = L.divIcon({
  className: 'khatra-admin-marker',
  html: `<div style="
    background: #5C1D24;
    width: 28px;
    height: 28px;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 3px 8px rgba(42,30,23,0.35);
    border: 2px solid #fff;
  "><div style="width: 8px; height: 8px; background: #C5A06A; border-radius: 50%; transform: rotate(45deg);"></div></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28],
});

function MapPicker({ onSelect, coords }) {
  const map = useMap();

  useEffect(() => {
    if (coords && coords.latitude != null && coords.longitude != null) {
      map.setView([coords.latitude, coords.longitude], 11);
    } else {
      map.setView([33.5731, -7.5898], 6);
    }
  }, [coords, map]);

  const onClick = useCallback((e) => {
    if (onSelect) onSelect({ latitude: e.latlng.lat, longitude: e.latlng.lng });
  }, [onSelect]);

  return (
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      eventHandlers={{ click: onClick }}
    />
  );
}

export function AdminStores() {
  const { stores, addStore, updateStore, deleteStore } = useData();
  const [editingId, setEditingId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState(null);
  const [mapCoords, setMapCoords] = useState(null);
  const [mapError, setMapError] = useState(null);
  const mapRef = useRef(null);

  const [form, setForm] = useState({
    name: '', city: 'Casablanca', address: '', hours: '08h00 - 23h00',
    type: 'Coffee Shop', mapsUrl: '', img: Images.khatra.brand3,
    latitude: '', longitude: '',
  });

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const handleEditClick = (s) => {
    setEditingId(s.id);
    setForm({
      ...s,
      latitude: s.latitude != null ? String(s.latitude) : '',
      longitude: s.longitude != null ? String(s.longitude) : '',
    });
    setMapCoords(s.latitude != null && s.longitude != null
      ? { latitude: Number(s.latitude), longitude: Number(s.longitude) }
      : null);
    setShowAdd(true);
  };

  const handleMapSelect = useCallback((coords) => {
    setForm(prev => ({
      ...prev,
      latitude: coords.latitude.toFixed(8),
      longitude: coords.longitude.toFixed(8),
    }));
    setMapCoords(coords);
    setMapError(null);
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (mapError) {
        setToast({ type: 'error', message: 'Veuillez corriger les erreurs avant de sauvegarder.' });
        return;
      }
      const payload = { ...form };
      if (payload.latitude === '') payload.latitude = null;
      if (payload.longitude === '') payload.longitude = null;
      else payload.latitude = parseFloat(payload.latitude);
      if (payload.longitude === '') payload.longitude = null;
      else payload.longitude = parseFloat(payload.longitude);

      if (editingId) {
        await updateStore(editingId, payload);
        setToast({ type: 'success', message: 'Point de vente modifié avec succès.' });
      } else {
        await addStore(payload);
        setToast({ type: 'success', message: 'Point de vente ajouté avec succès.' });
      }
      setShowAdd(false);
      setEditingId(null);
      setMapCoords(null);
      setForm({ name: '', city: 'Casablanca', address: '', hours: '08h00 - 23h00', type: 'Coffee Shop', mapsUrl: '', img: Images.khatra.brand3, latitude: '', longitude: '' });
    } catch (err) {
      setToast({ type: 'error', message: err?.message || 'Erreur lors de la sauvegarde.' });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteStore(id);
      setToast({ type: 'success', message: 'Point de vente supprimé.' });
    } catch (err) {
      setToast({ type: 'error', message: err?.message || 'Erreur lors de la suppression.' });
    }
  };

  return (
    <div className="admin-stores-page">
      <SEO title="Gestion des Points de Vente" />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Points de Vente</h1>
          <p style={{ color: 'var(--toffee)', fontSize: '0.9rem', margin: 0 }}>
            Gérez vos adresses de coffee shops, showrooms et boutiques franchisées.
          </p>
        </div>
        {!showAdd && (
          <button type="button" onClick={() => { setShowAdd(true); setEditingId(null); setMapCoords(null); }} className="btn btn-primary btn-sm">
            <Plus s={16} /> Ajouter un point de vente
          </button>
        )}
      </div>

      {toast && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
          background: toast.type === 'success' ? 'var(--dark)' : '#dc2626',
          color: '#fff', padding: '12px 20px', borderRadius: 'var(--radius)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)', fontSize: '0.85rem', maxWidth: '400px',
        }}>
          {toast.message}
        </div>
      )}

      {showAdd && (
        <div className="admin-form" style={{ marginBottom: '36px' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '1.1rem' }}>{editingId ? 'Modifier le point de vente' : 'Nouveau point de vente'}</h3>
          <form onSubmit={handleSave}>
            <div className="form-row">
              <div className="form-group">
                <label>Nom de l’établissement *</label>
                <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Ville *</label>
                <input type="text" required value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Adresse complète *</label>
                <input type="text" required value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Type de concept</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                  <option value="Coffee Shop">Coffee Shop</option>
                  <option value="Khatra Market Retail">Khatra Market Retail</option>
                  <option value="Coffee Shop & Showroom">Coffee Shop & Showroom</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Horaires d’ouverture</label>
                <input type="text" value={form.hours} onChange={e => setForm({ ...form, hours: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Lien Google Maps</label>
                <input type="text" value={form.mapsUrl} onChange={e => setForm({ ...form, mapsUrl: e.target.value })} placeholder="https://maps.google.com/?q=..." />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Latitude</label>
                <input type="number" step="any" min="-90" max="90" placeholder="33.5731" value={form.latitude}
                  onChange={e => { setForm({ ...form, latitude: e.target.value }); setMapError(null); }}
                  onBlur={() => {
                    if (form.latitude !== '' && (parseFloat(form.latitude) < -90 || parseFloat(form.latitude) > 90)) {
                      setMapError('Latitude invalide (-90 à 90)');
                    }
                  }}
                />
              </div>
              <div className="form-group">
                <label>Longitude</label>
                <input type="number" step="any" min="-180" max="180" placeholder="-7.5898" value={form.longitude}
                  onChange={e => { setForm({ ...form, longitude: e.target.value }); setMapError(null); }}
                  onBlur={() => {
                    if (form.longitude !== '' && (parseFloat(form.longitude) < -180 || parseFloat(form.longitude) > 180)) {
                      setMapError('Longitude invalide (-180 à 180)');
                    }
                  }}
                />
              </div>
            </div>

            {mapError && (
              <div style={{ color: '#dc2626', fontSize: '0.8rem', marginBottom: '12px' }}>{mapError}</div>
            )}

            {/* Map picker */}
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label>Sélectionner sur la carte</label>
              <div style={{ height: '260px', borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid rgba(42,30,23,0.1)', position: 'relative' }}>
                <MapContainer
                  center={mapCoords ? [mapCoords.latitude, mapCoords.longitude] : [33.5731, -7.5898]}
                  zoom={mapCoords ? 11 : 6}
                  scrollWheelZoom={false}
                  style={{ height: '100%', width: '100%' }}
                >
                  <MapPicker onSelect={handleMapSelect} coords={mapCoords} />
                  {mapCoords && (
                    <Marker
                      position={[mapCoords.latitude, mapCoords.longitude]}
                      icon={storeIcon}
                      draggable={false}
                    />
                  )}
                </MapContainer>
                {mapCoords && (
                  <button type="button" onClick={() => { setMapCoords(null); setForm({ ...form, latitude: '', longitude: '' }); }}
                    style={{
                      position: 'absolute', top: '8px', right: '8px', background: '#fff', border: 'none',
                      padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                    }}>
                    Effacer
                  </button>
                )}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--dark-s)', marginTop: '4px' }}>
                Cliquez sur la carte pour définir la position
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                <Check s={16} /> {editingId ? 'Mettre à jour' : 'Ajouter'}
              </button>
              <button type="button" className="btn btn-outline-dark" onClick={() => { setShowAdd(false); setEditingId(null); setMapCoords(null); setMapError(null); }}>
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {stores.map(s => {
          const hasCoords = s.latitude != null && s.longitude != null;
          return (
            <div key={s.id} style={{ background: 'var(--white)', padding: '24px', borderRadius: 'var(--radius)', border: '1px solid rgba(42,30,23,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span className="pill" style={{ background: 'var(--linen-d)' }}>{s.city} · {s.type}</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" onClick={() => handleEditClick(s)} className="btn-text" style={{ padding: 0 }} title="Modifier">
                    <Edit s={16} />
                  </button>
                  <button type="button" onClick={() => handleDelete(s.id)} className="btn-text" style={{ padding: 0, color: '#dc2626' }} title="Supprimer">
                    <Trash s={16} />
                  </button>
                </div>
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>{s.name}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--dark-s)', marginBottom: '8px' }}>{s.address}</p>
              <div style={{ fontSize: '0.78rem', color: 'var(--toffee)' }}>⏱ {s.hours}</div>

              {hasCoords && (
                <div style={{ marginTop: '10px', fontSize: '0.75rem', color: 'var(--dark-s)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin s={13} />
                  <span>
                    {s.latitude}, {s.longitude}
                  </span>
                </div>
              )}

              {!hasCoords && (
                <div style={{ marginTop: '10px', fontSize: '0.75rem', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin s={13} />
                  <span>Coordonnées absentes</span>
                </div>
              )}

              {s.googleMapsUrl && (
                <a href={s.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-dark btn-sm" style={{ marginTop: '12px', padding: '6px 14px', fontSize: '0.72rem' }}>
                  Voir sur Google Maps
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AdminStores;
