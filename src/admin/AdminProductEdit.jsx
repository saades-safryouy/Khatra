import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Images from '../assets/images';
import { ArrowLeft, Check } from '../components/Icons';
import SEO from '../components/SEO';

const PRESETS = [
  { label: 'Packaging Grain', val: Images.khatra.packaging },
  { label: 'Khatra 360°', val: Images.khatra.khatra360 },
  { label: 'Sirop Biscuit', val: Images.syrups.biscuit },
  { label: 'Sirop Caramel', val: Images.syrups.caramel },
  { label: 'Sirop Noisette', val: Images.syrups.noisette },
  { label: 'Sirop Toffee Nut', val: Images.syrups.toffeNut },
  { label: 'Bubbles Fraise', val: Images.bubbles.frais },
  { label: 'Bubbles Mangue', val: Images.bubbles.mangue },
  { label: 'Bubbles Passion', val: Images.bubbles.passion },
  { label: 'Sirop Kiwi', val: Images.nidsys.kiwi },
  { label: 'Sirop Raisin', val: Images.nidsys.raisin }
];

export function AdminProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, categories: dataCategories, addProduct, updateProduct } = useData();

  const isNew = !id || id === 'new';
  const existing = products.find((p) => String(p.id) === String(id) || p.slug === id);

  const categories = dataCategories && dataCategories.length > 0 ? dataCategories : ['Café', 'Sirops', 'Bubbles'];

  const [form, setForm] = useState(() => {
    if (existing) {
      return {
        name: existing.name || '',
        slug: existing.slug || '',
        category: existing.category || categories[0] || 'Café',
        img: existing.img || Images.khatra.packaging,
        short: existing.short || '',
        desc: existing.desc || '',
        formats: existing.formats?.join(', ') || '',
        features: existing.features?.join('\n') || '',
      };
    }
    return {
      name: '',
      slug: '',
      category: categories[0] || 'Café',
      img: Images.khatra.packaging,
      short: '',
      desc: '',
      formats: '1kg, Carton Pro',
      features: 'Torréfaction artisanale\nConditionnement hermétique',
    };
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      formats: form.formats.split(',').map((s) => s.trim()).filter(Boolean),
      features: form.features.split('\n').map((s) => s.trim()).filter(Boolean),
    };
    if (isNew) {
      await addProduct(payload);
    } else {
      await updateProduct(existing?.id || id, payload);
    }
    navigate('/admin/products');
  };

  return (
    <div className="admin-product-edit">
      <SEO title={isNew ? 'Ajouter un Produit' : `Modifier ${form.name}`} />

      <Link to="/admin/products" className="btn-text" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <ArrowLeft s={16} /> Retour aux produits
      </Link>

      <div className="admin-form">
        <h2 className="admin-form-title">{isNew ? 'Créer un Produit B2B' : `Modifier : ${form.name}`}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Nom du Produit *</label>
              <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Slug URL</label>
              <input type="text" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Catégorie *</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Formats (séparés par virgules)</label>
              <input type="text" value={form.formats} onChange={e => setForm({ ...form, formats: e.target.value })} />
            </div>
          </div>

          <div className="form-group">
            <label>Visuel</label>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <img src={form.img} alt="Aperçu" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px' }} />
              <select value={form.img} onChange={e => setForm({ ...form, img: e.target.value })} style={{ flex: 1 }}>
                {PRESETS.map((p, i) => <option key={i} value={p.val}>{p.label}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Résumé court *</label>
            <input type="text" required value={form.short} onChange={e => setForm({ ...form, short: e.target.value })} />
          </div>

          <div className="form-group">
            <label>Description détaillée *</label>
            <textarea rows="3" required value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} />
          </div>

          <div className="form-group">
            <label>Points forts (1 par ligne)</label>
            <textarea rows="3" value={form.features} onChange={e => setForm({ ...form, features: e.target.value })} />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button type="submit" className="btn btn-primary"><Check s={16} /> {isNew ? 'Enregistrer' : 'Sauvegarder'}</button>
            <Link to="/admin/products" className="btn btn-outline-dark">Annuler</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminProductEdit;
