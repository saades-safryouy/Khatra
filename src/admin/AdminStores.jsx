import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import Images from '../assets/images';
import { Plus, Edit, Trash, Check } from '../components/Icons';
import SEO from '../components/SEO';

export function AdminStores() {
  const { stores, addStore, updateStore, deleteStore } = useData();
  const [editingId, setEditingId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const [form, setForm] = useState({
    name: '', city: 'Casablanca', address: '', hours: '08h00 - 23h00',
    type: 'Coffee Shop', mapsUrl: '', img: Images.khatra.brand3
  });

  const handleEditClick = (s) => {
    setEditingId(s.id);
    setForm({ ...s });
    setShowAdd(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingId) {
      updateStore(editingId, form);
    } else {
      addStore(form);
    }
    setShowAdd(false);
    setEditingId(null);
    setForm({ name: '', city: 'Casablanca', address: '', hours: '08h00 - 23h00', type: 'Coffee Shop', mapsUrl: '', img: Images.khatra.brand3 });
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
          <button type="button" onClick={() => { setShowAdd(true); setEditingId(null); }} className="btn btn-primary btn-sm">
            <Plus s={16} /> Ajouter un point de vente
          </button>
        )}
      </div>

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
                <input type="url" value={form.mapsUrl} placeholder="https://maps.google.com/..." onChange={e => setForm({ ...form, mapsUrl: e.target.value })} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button type="submit" className="btn btn-primary"><Check s={16} /> Enregistrer</button>
              <button type="button" onClick={() => setShowAdd(false)} className="btn btn-outline-dark">Annuler</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {stores.map(s => (
          <div key={s.id} style={{ background: 'var(--white)', padding: '24px', borderRadius: 'var(--radius)', border: '1px solid rgba(42,30,23,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <span className="pill" style={{ background: 'var(--linen-d)' }}>{s.city} · {s.type}</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" onClick={() => handleEditClick(s)} className="btn-text" style={{ padding: 0 }} title="Modifier">
                  <Edit s={16} />
                </button>
                <button type="button" onClick={() => deleteStore(s.id)} className="btn-text" style={{ padding: 0, color: '#dc2626' }} title="Supprimer">
                  <Trash s={16} />
                </button>
              </div>
            </div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>{s.name}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--dark-s)', marginBottom: '8px' }}>{s.address}</p>
            <div style={{ fontSize: '0.78rem', color: 'var(--toffee)' }}>⏱ {s.hours}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminStores;
