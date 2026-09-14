import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, WhatsApp } from './Icons';
import { useData } from '../context/DataContext';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const { settings } = useData();

  const isHome = pathname === '/';
  const isLightLogo = isHome && !scrolled;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  const navClass = `site-header ${scrolled || !isHome ? 'scrolled' : 'transparent'}${isLightLogo ? ' nav-on-dark' : ''}`;

  const waNum = settings?.whatsapp || '212661000000';
  const waUrl = `https://wa.me/${waNum}?text=${encodeURIComponent("Bonjour Khatra, je souhaite échanger sur une opportunité B2B / Franchise.")}`;

  return (
    <>
      <header className={navClass}>
        <div className="nav-inner">
          <Link to="/" className={`logo ${isLightLogo ? 'light' : ''}`} onClick={closeMobile}>
            KHATRA<sup>®</sup>
          </Link>

          <nav className="nav-links">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Accueil</NavLink>
            <NavLink to="/produits" className={({ isActive }) => isActive ? 'active' : ''}>Produits</NavLink>
            <NavLink to="/franchise" className={({ isActive }) => isActive ? 'active' : ''}>Franchise</NavLink>
            <NavLink to="/points-de-vente" className={({ isActive }) => isActive ? 'active' : ''}>Points de vente</NavLink>
            <NavLink to="/notre-histoire" className={({ isActive }) => isActive ? 'active' : ''}>Notre histoire</NavLink>
            <NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>Contact</NavLink>
          </nav>

          <div className="nav-cta-desktop">
            <Link to="/contact" className="btn btn-primary btn-sm">
              Devenir Partenaire
            </Link>
          </div>

          <button
            type="button"
            className={`menu-btn ${mobileOpen ? 'open' : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileOpen}
            style={{ color: isLightLogo ? '#ffffff' : 'var(--dark)' }}
          >
            {mobileOpen ? <X s={26} /> : <Menu s={26} />}
          </button>
        </div>
      </header>

      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <div className="mobile-menu-inner">
          <div className="mobile-menu-links">
            <Link to="/" onClick={closeMobile}>Accueil</Link>
            <Link to="/produits" onClick={closeMobile}>Nos Produits B2B</Link>
            <Link to="/franchise" onClick={closeMobile}>Opportunités Franchise</Link>
            <Link to="/franchise/coffee-shop" onClick={closeMobile} className="mobile-menu-sub">— Khatra Coffee Shop</Link>
            <Link to="/franchise/khatra-market" onClick={closeMobile} className="mobile-menu-sub">— Khatra Market</Link>
            <Link to="/points-de-vente" onClick={closeMobile}>Points de vente</Link>
            <Link to="/notre-histoire" onClick={closeMobile}>Notre histoire</Link>
            <Link to="/contact" onClick={closeMobile}>Contact & Devis</Link>
          </div>

          <div className="mobile-menu-bottom">
            <Link to="/contact" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={closeMobile}>
              Devenir Partenaire <ArrowRight s={16} />
            </Link>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
              style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
              onClick={closeMobile}
            >
              <WhatsApp s={18} color="#fff" /> WhatsApp Direct
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
