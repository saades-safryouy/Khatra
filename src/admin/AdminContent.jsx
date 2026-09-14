import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Check } from '../components/Icons';
import SEO from '../components/SEO';

export function AdminContent() {
  const { content, updateContent } = useData();
  const [form, setForm] = useState({ ...content });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateContent(form);
  };

  return (
    <div className="admin-content-page">
      <SEO title="Édition des Contenus" />

      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Contenus du Site</h1>
        <p style={{ color: 'var(--toffee)', fontSize: '0.9rem', margin: 0 }}>
          Modifiez les slogans, les textes d’accroche et les messages de marque.
        </p>
      </div>

      <div className="admin-form">
        <form onSubmit={handleSubmit}>
          <div className="form-section-label">Page d’Accueil — Hero Header</div>

          <div className="form-group">
            <label>Accroche supérieure (Eyebrow)</label>
            <input
              type="text"
              value={form.heroTagline || ''}
              onChange={e => setForm({ ...form, heroTagline: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Titre Principal Hero</label>
            <input
              type="text"
              value={form.heroTitle || ''}
              onChange={e => setForm({ ...form, heroTitle: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Sous-titre descriptif</label>
            <textarea
              rows="3"
              value={form.heroDesc || ''}
              onChange={e => setForm({ ...form, heroDesc: e.target.value })}
            />
          </div>

          <div className="form-section-label">Page Histoire & Marque</div>

          <div className="form-group">
            <label>Introduction Histoire</label>
            <textarea
              rows="3"
              value={form.brandStoryIntro || ''}
              onChange={e => setForm({ ...form, brandStoryIntro: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Citation de Marque (Closing Quote)</label>
            <textarea
              rows="2"
              value={form.brandQuote || ''}
              onChange={e => setForm({ ...form, brandQuote: e.target.value })}
            />
          </div>

          <div style={{ marginTop: '32px' }}>
            <button type="submit" className="btn btn-primary">
              <Check s={16} /> Enregistrer les contenus
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminContent;
