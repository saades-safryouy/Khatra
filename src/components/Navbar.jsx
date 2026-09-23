import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, WhatsApp } from './Icons';
import { useData } from '../context/DataContext';
import { useLang } from '../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import Khatra_logo from "../assets/design/Khatra_logo_new.png"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const { settings } = useData();
  const { t, lang } = useLang();

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

  const slide = lang === 'ar' ? '-100%' : '100%';
  const mobileMenuVariants = {
    closed: { opacity: 0, x: slide },
    open: { opacity: 1, x: '0%', transition: { type: 'spring', stiffness: 260, damping: 30 } },
    exit: { opacity: 0, x: slide, transition: { duration: 0.25 } },
  };

  const linkStagger = {
    hidden: { opacity: 0, x: 20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: 0.08 * i, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
    }),
  };

  const NAV_LINKS = [
    { to: '/', label: 'Accueil', end: true },
    { to: '/produits', label: 'Produits' },
    { to: '/franchise', label: 'Franchise' },
    { to: '/points-de-vente', label: 'Points de vente' },
    { to: '/notre-histoire', label: 'Notre histoire' },
    { to: '/contact', label: 'Contact' },
  ];

  const MOBILE_LINKS = [
    { to: '/', label: 'Accueil' },
    { to: '/produits', label: 'Nos Produits B2B' },
    { to: '/franchise', label: 'Opportunités Franchise' },
    { to: '/franchise/coffee-shop', label: '— Khatra Coffee Shop', className: 'mobile-menu-sub' },
    { to: '/franchise/khatra-market', label: '— Khatra Market', className: 'mobile-menu-sub' },
    { to: '/points-de-vente', label: 'Points de vente' },
    { to: '/notre-histoire', label: 'Notre histoire' },
    { to: '/contact', label: 'Contact & Devis' },
  ];

  return (
    <>
      <header className={navClass}>
        <div className="nav-inner">
          <Link to="/" className={`logo ${isLightLogo ? 'light' : ''}`} onClick={closeMobile}>
            <img  src={Khatra_logo} alt="Khatra Logo" />
          </Link>

          <nav className="nav-links">
            {NAV_LINKS.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end || false}
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                {t(link.label)}
              </NavLink>
            ))}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="nav-cta-desktop">
              <Link to="/contact" className="btn btn-primary btn-sm">
                {t('Devenir Partenaire')}
              </Link>
            </div>

            <div className="nav-lang-switcher-header">
              <LanguageSwitcher light={isLightLogo} />
            </div>

            <button
              type="button"
              className={`menu-btn ${mobileOpen ? 'open' : ''}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? t('Fermer le menu') : t('Ouvrir le menu')}
              aria-expanded={mobileOpen}
              style={{ color: isLightLogo ? '#ffffff' : 'var(--dark)' }}
            >
              {mobileOpen ? <X s={26} /> : <Menu s={26} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-menu open"
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="exit"
          >
            <div className="mobile-menu-inner">
              <div className="mobile-menu-links">
                {MOBILE_LINKS.map((link, i) => (
                  <motion.div
                    key={link.to}
                    custom={i}
                    variants={linkStagger}
                    initial="hidden"
                    animate="visible"
                  >
                    <Link
                      to={link.to}
                      onClick={closeMobile}
                      className={link.className || ''}
                    >
                      {t(link.label)}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mobile-menu-bottom">
                <Link to="/contact" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={closeMobile}>
                  {t('Devenir Partenaire')} <ArrowRight s={16} />
                </Link>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
                  onClick={closeMobile}
                >
                  <WhatsApp s={18} color="#fff" /> {t('WhatsApp Direct')}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
