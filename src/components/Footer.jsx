import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useLang } from '../context/LanguageContext';
import KhatraLogo from '../assets/design/khatra_logo_new.png';
import { Facebook, Instagram, Mail, MapPin, Phone, TikTok } from './Icons';

const EASE = [0.22, 1, 0.36, 1];

export function Footer() {
  const { settings } = useData();
  const { t } = useLang();
  const { ref, isInView } = useScrollReveal({ margin: '-60px' });

  const socials = [
    settings?.instagram && { label: 'Instagram', href: settings.instagram, Icon: Instagram },
    settings?.facebook && { label: 'Facebook', href: settings.facebook, Icon: Facebook },
    settings?.tiktok && { label: 'TikTok', href: settings.tiktok, Icon: TikTok },
  ].filter(Boolean);

  return (
    <motion.footer
      className="site-editorial-footer"
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.9, ease: EASE }}
    >
      <div className="container">
        <div className="site-editorial-footer__top">
          {/* Brand Column */}
          <div className="site-editorial-footer__brand-col">
            <Link to="/" className="site-editorial-footer__logo">
              <img src={KhatraLogo} alt="Khatra Logo" />
            </Link>
            <p className="site-editorial-footer__manifesto">
              {t(
                "Khatra développe un écosystème marocain d'exception autour du café de spécialité, des sirops gourmands et de concepts de franchise rentables et modernes."
              )}
            </p>
            {socials.length > 0 && (
              <div className="site-editorial-footer__socials">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="site-editorial-footer__social-link"
                    aria-label={`${s.label} Khatra`}
                    title={s.label}
                  >
                    <s.Icon s={17} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Column */}
          <nav className="site-editorial-footer__col" aria-label={t('Navigation')}>
            <h5>{t('Navigation')}</h5>
            <Link to="/">{t('Accueil')}</Link>
            <Link to="/produits">{t('Produits B2B')}</Link>
            <Link to="/points-de-vente">{t('Points de vente')}</Link>
            <Link to="/notre-histoire">{t('Notre histoire')}</Link>
            <Link to="/contact">{t('Contact & Partenariat')}</Link>
          </nav>

          {/* Franchise Column */}
          <nav className="site-editorial-footer__col" aria-label={t('Franchise')}>
            <h5>{t('Franchise')}</h5>
            <Link to="/franchise">{t("Vue d'ensemble")}</Link>
            <Link to="/franchise/coffee-shop">{t('Khatra Coffee Shop')}</Link>
            <Link to="/franchise/khatra-market">{t('Khatra Market')}</Link>
            <Link to="/contact">{t('Candidature Franchise')}</Link>
          </nav>

          {/* Direct Contact Column */}
          <address className="site-editorial-footer__col site-editorial-footer__contact" aria-label={t('Contact & Siège')}>
            <h5>{t('Contact & Siège')}</h5>
            <div className="site-editorial-footer__contact-item">
              <span className="site-editorial-footer__contact-icon" aria-hidden="true">
                <MapPin s={16} />
              </span>
              <span>{t('Siège & Showroom')}</span>
              <p>{t(settings?.address || 'Casablanca, Maroc')}</p>
            </div>
            <div className="site-editorial-footer__contact-item">
              <span className="site-editorial-footer__contact-icon" aria-hidden="true">
                <Phone s={15} />
              </span>
              <span>{t('Téléphone Direct')}</span>
              <a href={`tel:${settings?.phone || '+212522000000'}`}>
                {settings?.phone || '+212 5 22 00 00 00'}
              </a>
            </div>
            <div className="site-editorial-footer__contact-item">
              <span className="site-editorial-footer__contact-icon" aria-hidden="true">
                <Mail s={15} />
              </span>
              <span>{t('Email Professionnel')}</span>
              <a href={`mailto:${settings?.email || 'contact@khatra.ma'}`}>
                {settings?.email || 'contact@khatra.ma'}
              </a>
            </div>
          </address>
        </div>

        <div className="site-editorial-footer__bottom">
          <span>
            © {new Date().getFullYear()} KHATRA S.A.R.L. {t('Tous droits réservés.')}
          </span>
        </div>
      </div>
    </motion.footer>
  );
}

export default Footer;
