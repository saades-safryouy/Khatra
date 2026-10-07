import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Menu, X, ArrowRight, WhatsApp, ShoppingBag } from './Icons';
import { useData } from '../context/DataContext';
import { useCart } from '../context/cartStore';
import { useLang } from '../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
// import KhatraLogo from '../assets/design/khatra_logo_new.png';
import KhatraLogo from '../assets/design/logo.png';

/**
 * Props
 *  heroTone: "dark" (default) → dark text over a LIGHT hero (your cream hero)
 *            "light"          → white text over a DARK hero image
 */

// labels stay identical to before so your t() translation keys keep working
const NAV_LINKS = [
  { to: '/', label: 'Accueil', end: true },
  { to: '/produits', label: 'Produits' },
  { to: '/franchise', label: 'Franchise' },
  { to: '/points-de-vente', label: 'Stores' },
  { to: '/notre-histoire', label: 'Notre histoire' },
  { to: '/contact', label: 'Contact' },
];

const MOBILE_LINKS = [
  { to: '/', label: 'Accueil' },
  { to: '/produits', label: 'Produits' },
  { to: '/franchise', label: 'Franchise' },
  { to: '/franchise/coffee-shop', label: '— Khatra Coffee Shop', className: 'mobile-sub-link' },
  { to: '/franchise/khatra-market', label: '— Khatra Market', className: 'mobile-sub-link' },
  { to: '/points-de-vente', label: 'Stores' },
  { to: '/notre-histoire', label: 'Notre histoire' },
  { to: '/contact', label: 'Contact & Devis Pro' },
];

const WA_MESSAGE = {
  fr: 'Bonjour Khatra, je souhaite échanger sur une opportunité B2B / Franchise.',
  ar: 'مرحباً خاترة، أرغب في مناقشة فرصة شراكة / امتياز تجاري.',
};

export function Navbar({ heroTone = 'dark' }) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastY = useRef(0);
  const drawerRef = useRef(null);
  const burgerRef = useRef(null);
  const { pathname } = useLocation();
  const { settings } = useData();
  const { count: cartCount } = useCart();
  const { t, lang } = useLang();

  const isHome = pathname === '/';
  const isTransparentOnHero = isHome && !scrolled;
  const lightOnHero = isTransparentOnHero && heroTone === 'light';

  // thin caramel reading-progress line under the bar
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  // scrolled state + hide on scroll down / reveal on scroll up
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 30);
      const delta = y - lastY.current;
      if (Math.abs(delta) > 8) {
        setHidden(y > 240 && delta > 0);
        lastY.current = y;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // close the drawer on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // drawer: scroll lock, Escape to close, focus first link
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    if (!mobileOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        burgerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    const id = window.setTimeout(() => drawerRef.current?.querySelector('a')?.focus(), 350);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
      window.clearTimeout(id);
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  const headerClass = [
    'site-navbar',
    isTransparentOnHero ? 'site-navbar--hero-transparent' : 'site-navbar--scrolled',
    isTransparentOnHero && heroTone === 'dark' ? 'site-navbar--on-light' : '',
    hidden && !mobileOpen ? 'site-navbar--hidden' : '',
    mobileOpen ? 'site-navbar--menu-open' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const waNum = settings?.whatsapp || '212661000000';
  const waUrl = `https://wa.me/${waNum}?text=${encodeURIComponent(WA_MESSAGE[lang] || WA_MESSAGE.fr)}`;

  const slideDir = lang === 'ar' ? '-100%' : '100%';
  const mobileMenuVariants = {
    closed: { opacity: 0, x: slideDir },
    open: { opacity: 1, x: '0%', transition: { type: 'spring', stiffness: 280, damping: 32 } },
    exit: { opacity: 0, x: slideDir, transition: { duration: 0.25 } },
  };
  const linkStagger = {
    hidden: { opacity: 0, y: 15 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.06 * i, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
    }),
  };

  return (
    <>
      <header className={headerClass}>
        <div className="site-navbar__inner">
          <Link
            to="/"
            className={`site-navbar__logo ${lightOnHero ? 'site-navbar__logo--light' : ''}`}
            aria-label="Khatra Accueil"
          >
            <img src={KhatraLogo} alt="Khatra Logo" className="site-navbar__logo-img" />
          </Link>

          <nav className="site-navbar__links" aria-label="Navigation principale">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end || false}
                className={({ isActive }) =>
                  `site-navbar__link ${isActive ? 'site-navbar__link--active' : ''}`
                }
              >
                {t(link.label)}
              </NavLink>
            ))}
          </nav>

          <div className="site-navbar__actions">
            <Link to="/panier" className={`navbar-cart-link${lightOnHero ? ' navbar-cart-link--light' : ''}`} aria-label={`Panier, ${cartCount} article${cartCount === 1 ? '' : 's'}`}>
              <ShoppingBag s={19} />
              {cartCount > 0 && <span className="navbar-cart-count">{cartCount > 99 ? '99+' : cartCount}</span>}
            </Link>
            <div className="site-navbar__cta-desktop">
              <Link to="/contact" className="btn btn-primary btn-sm navbar-cta-btn">
                {t('Devenir Partenaire')}
              </Link>
            </div>
            <div className="site-navbar__lang-box">
              <LanguageSwitcher light={lightOnHero} />
            </div>
            <div className="site-navbar__theme-box">
              <ThemeToggle light={lightOnHero} />
            </div>
            <button
              ref={burgerRef}
              type="button"
              className={`site-navbar__hamburger ${mobileOpen ? 'is-open' : ''} ${
                lightOnHero ? 'site-navbar__hamburger--light' : ''
              }`}
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? t('Fermer le menu') : t('Ouvrir le menu')}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              {mobileOpen ? <X s={24} /> : <Menu s={24} />}
            </button>
          </div>
        </div>
        <motion.span className="site-navbar__progress" style={{ scaleX: progress }} aria-hidden="true" />
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            ref={drawerRef}
            className="navbar-mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label={t('Ouvrir le menu')}
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="exit"
          >
            <div className="navbar-mobile-drawer__inner">
              <div className="navbar-mobile-drawer__top">
                <Link to="/" onClick={closeMobile} className="navbar-mobile-drawer__brand">
                  <img src={KhatraLogo} alt="Khatra" />
                </Link>
                <div className="navbar-mobile-drawer__tools">
                  <LanguageSwitcher light />
                  <ThemeToggle light />
                </div>
              </div>

              <nav className="navbar-mobile-drawer__links" aria-label="Navigation mobile">
                {MOBILE_LINKS.map((link, i) => (
                  <motion.div key={link.to} custom={i} variants={linkStagger} initial="hidden" animate="visible">
                    <NavLink
                      to={link.to}
                      end={link.to === '/'}
                      onClick={closeMobile}
                      className={({ isActive }) =>
                        `navbar-mobile-drawer__link ${link.className || ''} ${isActive ? 'is-active' : ''}`
                      }
                    >
                      {t(link.label)}
                    </NavLink>
                  </motion.div>
                ))}
              </nav>

              <div className="navbar-mobile-drawer__bottom">
                <Link to="/contact" className="btn btn-primary" onClick={closeMobile}>
                  {t('Devenir Partenaire')} <ArrowRight s={16} />
                </Link>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp"
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