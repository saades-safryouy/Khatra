import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Check } from '../components/Icons';
import SEO from '../components/SEO';

export function AdminSettings() {
  const { settings, updateSettings } = useData();
  const [form, setForm] = useState({ ...settings });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings(form);
  };

  return (
    <div className="admin-settings-page">
      <SEO title="Paramètres Généraux" />

      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Paramètres Généraux</h1>
        <p style={{ color: 'var(--toffee)', fontSize: '0.9rem', margin: 0 }}>
          Coordonnées de contact, numéro WhatsApp B2B et liens réseaux sociaux.
        </p>
      </div>

      <div className="admin-form">
        <form onSubmit={handleSubmit}>
          <div className="form-section-label">Coordonnées Professionnelles</div>

          <div className="form-row">
            <div className="form-group">
              <label>Numéro WhatsApp (sans le +)</label>
              <input
                type="text"
                placeholder="212661000000"
                value={form.whatsapp || ''}
                onChange={e => setForm({ ...form, whatsapp: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Téléphone standard</label>
              <input
                type="text"
                value={form.phone || ''}
                onChange={e => setForm({ ...form, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email de contact B2B</label>
              <input
                type="email"
                value={form.email || ''}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Adresse du Siège</label>
              <input
                type="text"
                value={form.address || ''}
                onChange={e => setForm({ ...form, address: e.target.value })}
              />
            </div>
          </div>

          <div className="form-section-label">Réseaux Sociaux</div>

          <div className="form-group">
            <label>Lien Instagram</label>
            <input
              type="url"
              placeholder="https://instagram.com/khatracoffee"
              value={form.instagram || ''}
              onChange={e => setForm({ ...form, instagram: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Lien Facebook</label>
            <input
              type="url"
              placeholder="https://facebook.com/khatracoffee"
              value={form.facebook || ''}
              onChange={e => setForm({ ...form, facebook: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Lien TikTok</label>
            <input
              type="url"
              placeholder="https://tiktok.com/@khatracoffee"
              value={form.tiktok || ''}
              onChange={e => setForm({ ...form, tiktok: e.target.value })}
            />
          </div>

          <div style={{ marginTop: '32px' }}>
            <button type="submit" className="btn btn-primary">
              <Check s={16} /> Enregistrer les paramètres
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminSettings;
