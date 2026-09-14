import React from 'react';
import { NavLink, Link, Outlet, Navigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Layers, Package, Store, FileText, Settings, LogOut, ArrowUpRight } from '../components/Icons';

export function AdminLayout() {
  const { user, logout } = useData();

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-top">
          <Link to="/admin" className="logo light">
            KHATRA<sup>®</sup>
          </Link>
          <span style={{ fontSize: '0.65rem', color: 'var(--caramel-l)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600 }}>
            Administration
          </span>
        </div>

        <nav className="admin-nav">
          <NavLink to="/admin" end className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <Layers s={18} />
            <span>Tableau de bord</span>
          </NavLink>

          <NavLink to="/admin/products" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <Package s={18} />
            <span>Produits</span>
          </NavLink>

          <NavLink to="/admin/stores" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <Store s={18} />
            <span>Points de vente</span>
          </NavLink>

          <NavLink to="/admin/content" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <FileText s={18} />
            <span>Contenus</span>
          </NavLink>

          <NavLink to="/admin/settings" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <Settings s={18} />
            <span>Paramètres</span>
          </NavLink>
        </nav>

        <div className="admin-sidebar-bottom">
          <Link to="/" target="_blank" className="btn btn-outline-light btn-sm" style={{ width: '100%', justifyContent: 'center', marginBottom: '8px' }}>
            Voir le site public <ArrowUpRight s={14} />
          </Link>
          <button
            type="button"
            onClick={logout}
            className="btn btn-sm"
            style={{ width: '100%', justifyContent: 'center', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <LogOut s={14} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="admin-main">
        <header className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.88rem', color: 'var(--toffee)', fontWeight: 500 }}>
              Connecté en tant que <strong>{user.username}</strong>
            </span>
          </div>
          <Link to="/" className="btn-text" style={{ fontSize: '0.8rem' }}>
            Accéder au site public ↗
          </Link>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
