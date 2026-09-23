import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useLang } from '../context/LanguageContext';

const EASE = [0.22, 1, 0.36, 1];

export function Footer() {
  const { settings } = useData();
  const { t } = useLang();
  const { ref, isInView } = useScrollReveal({ margin: '-60px' });

  const socials = [
    settings?.instagram && { label: 'Instagram', href: settings.instagram },
    settings?.facebook && { label: 'Facebook', href: settings.facebook },
    settings?.tiktok && { label: 'TikTok', href: settings.tiktok },
  ].filter(Boolean);

  return (
    <motion.footer
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.9, ease: EASE }}
    >
      <div className="footer-top">
        <div className="footer-brand">
          <Link to="/" className="logo light">
            KHATRA<sup>®</sup>
          </Link>
          <p>
            {t("Khatra développe un écosystème marocain d'exception autour du café de spécialité, des sirops gourmands et de concepts de franchise rentables et modernes.")}
          </p>
          {socials.length > 0 && (
            <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
              {socials.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem' }}
                >
                  {s.label} ↗
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="footer-col">
          <h5>{t('Navigation')}</h5>
          <Link to="/">{t('Accueil')}</Link>
          <Link to="/produits">{t('Produits B2B')}</Link>
          <Link to="/points-de-vente">{t('Points de vente')}</Link>
          <Link to="/notre-histoire">{t('Notre histoire')}</Link>
          <Link to="/contact">{t('Contact & Partenariat')}</Link>
        </div>

        <div className="footer-col">
          <h5>{t('Franchise')}</h5>
          <Link to="/franchise">{t("Vue d'ensemble")}</Link>
          <Link to="/franchise/coffee-shop">{t('Khatra Coffee Shop')}</Link>
          <Link to="/franchise/khatra-market">Khatra Market</Link>
          <Link to="/contact">{t('Candidature Franchise')}</Link>
        </div>

        <div className="footer-col">
          <h5>{t('Contact Direct')}</h5>
          <div className="footer-contact-item">
            <span>{t('Siège & Showroom')}</span>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
              {t(settings?.address || 'Casablanca, Maroc')}
            </p>
          </div>
          <div className="footer-contact-item">
            <span>{t('Téléphone')}</span>
            <a href={`tel:${settings?.phone || '+212522000000'}`}>
              {settings?.phone || '+212 5 22 00 00 00'}
            </a>
          </div>
          <div className="footer-contact-item">
            <span>{t('Email Pro')}</span>
            <a href={`mailto:${settings?.email || 'contact@khatra.ma'}`}>
              {settings?.email || 'contact@khatra.ma'}
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} KHATRA S.A.R.L. {t('Tous droits réservés.')}</span>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <span>{t('Fait au Maroc avec passion')}</span>
          <Link to="/admin" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', textDecoration: 'underline' }}>
            Portail Admin
          </Link>
        </div>
      </div>
    </motion.footer>
  );
}

export default Footer;
