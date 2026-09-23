import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Plus, Edit, Trash } from '../components/Icons';
import SEO from '../components/SEO';

export function AdminProducts() {
  const { products, categories: dataCategories, deleteProduct } = useData();
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('Tout');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const categories = ['Tout', ...Array.from(new Set([...(dataCategories || []), ...products.map((p) => p.category)])).filter(Boolean)];

  const filtered = products.filter(p => {
    const matchCat = filterCat === 'Tout' || p.category === filterCat;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                        p.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="admin-products-page">
      <SEO title="Gestion des Produits" />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Gestion des Produits</h1>
          <p style={{ color: 'var(--toffee)', fontSize: '0.9rem', margin: 0 }}>
            Ajoutez, modifiez ou retirez des références du catalogue B2B.
          </p>
        </div>
        <Link to="/admin/products/new" className="btn btn-primary btn-sm">
          <Plus s={16} /> Ajouter un produit
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Rechercher par nom..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: '300px', background: 'var(--white)', padding: '10px 16px', borderRadius: 'var(--radius)', border: '1px solid rgba(42,30,23,0.1)' }}
        />
        <div style={{ display: 'flex', gap: '8px' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`btn btn-sm ${filterCat === cat ? 'btn-primary' : 'btn-outline-dark'}`}
              style={{ padding: '6px 16px', fontSize: '0.75rem' }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: 'var(--white)', borderRadius: 'var(--radius)', border: '1px solid rgba(42,30,23,0.06)', overflowX: 'auto' }}>
        <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(42,30,23,0.08)', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--toffee)' }}>
              <th style={{ padding: '14px 20px' }}>Visuel</th>
              <th style={{ padding: '14px 20px' }}>Nom</th>
              <th style={{ padding: '14px 20px' }}>Catégorie</th>
              <th style={{ padding: '14px 20px' }}>Formats</th>
              <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid rgba(42,30,23,0.04)' }}>
                <td style={{ padding: '14px 20px' }}>
                  <img src={p.img} alt={p.name} style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '4px' }} />
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ fontWeight: 600 }}>{p.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--toffee)' }}>/{p.slug}</div>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <span className="pill" style={{ background: 'var(--linen-d)', color: 'var(--dark)' }}>{p.category}</span>
                </td>
                <td style={{ padding: '14px 20px', fontSize: '0.85rem' }}>{p.formats?.join(', ')}</td>
                <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '8px' }}>
                    <Link to={`/admin/products/${p.id}/edit`} className="btn btn-sm btn-outline-dark" style={{ padding: '6px 12px' }}>
                      <Edit s={14} /> Modifier
                    </Link>
                    {deleteConfirmId === p.id ? (
                      <button
                        type="button"
                        onClick={() => { deleteProduct(p.id); setDeleteConfirmId(null); }}
                        className="btn btn-sm btn-primary"
                        style={{ padding: '6px 10px', fontSize: '0.7rem', background: '#dc2626', borderColor: '#dc2626' }}
                      >
                        Confirmer
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(p.id)}
                        className="btn btn-sm btn-outline-dark"
                        style={{ padding: '6px 10px', color: '#dc2626' }}
                      >
                        <Trash s={14} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminProducts;
