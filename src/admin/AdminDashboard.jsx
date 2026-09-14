import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Plus, ArrowRight } from '../components/Icons';
import SEO from '../components/SEO';

export function AdminDashboard() {
  const { products, stores, settings } = useData();

  const categoriesCount = new Set(products.map(p => p.category)).size;
  const citiesCount = new Set(stores.map(s => s.city)).size;

  return (
    <div className="admin-dashboard">
      <SEO title="Tableau de bord" />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Tableau de bord</h1>
          <p style={{ color: 'var(--toffee)', fontSize: '0.9rem', margin: 0 }}>
            Vue d’ensemble de votre catalogue, de vos implantations et de votre présence.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/admin/products/new" className="btn btn-primary btn-sm">
            <Plus s={16} /> Nouveau Produit
          </Link>
          <Link to="/admin/stores" className="btn btn-outline-dark btn-sm">
            <Plus s={16} /> Nouveau Point de Vente
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="admin-cards">
        <div className="admin-card">
          <div className="admin-card-val">{products.length}</div>
          <div className="admin-card-label">Produits au catalogue</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--toffee)', marginTop: '8px' }}>
            Répartis sur {categoriesCount} catégories
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-val">{stores.length}</div>
          <div className="admin-card-label">Points de vente physiques</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--toffee)', marginTop: '8px' }}>
            Présents dans {citiesCount} villes
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-val">B2B</div>
          <div className="admin-card-label">Mode Écosystème Actif</div>
          <div style={{ fontSize: '0.75rem', color: '#16a34a', marginTop: '8px' }}>
            ● Franchise & Wholesale
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-val">24/7</div>
          <div className="admin-card-label">Canal WhatsApp Connecté</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--toffee)', marginTop: '8px' }}>
            +{settings?.whatsapp || '212661000000'}
          </div>
        </div>
      </div>

      {/* Recent Products Overview */}
      <div style={{ background: 'var(--white)', padding: '28px', borderRadius: 'var(--radius)', border: '1px solid rgba(42,30,23,0.06)', marginTop: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.15rem' }}>Derniers Produits Modifiés</h3>
          <Link to="/admin/products" className="btn-text" style={{ fontSize: '0.8rem' }}>
            Gérer tous les produits <ArrowRight s={14} />
          </Link>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(42,30,23,0.08)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--toffee)' }}>
                <th style={{ padding: '12px 16px' }}>Visuel</th>
                <th style={{ padding: '12px 16px' }}>Nom du produit</th>
                <th style={{ padding: '12px 16px' }}>Catégorie</th>
                <th style={{ padding: '12px 16px' }}>Formats</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.slice(0, 5).map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid rgba(42,30,23,0.04)' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <img src={p.img} alt={p.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{p.name}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className="pill" style={{ background: 'var(--linen-d)', color: 'var(--dark)' }}>{p.category}</span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: 'var(--toffee)' }}>
                    {p.formats?.join(', ')}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <Link to={`/admin/products/${p.id}/edit`} className="btn-text" style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                      Modifier
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
