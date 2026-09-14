import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

export function Footer() {
  const { settings } = useData();

  return (
    <footer>
      <div className="footer-top">
        <div className="footer-brand">
          <Link to="/" className="logo light">
            KHATRA<sup>®</sup>
          </Link>
          <p>
            Khatra développe un écosystème marocain d’exception autour du café de spécialité, des sirops gourmands et de concepts de franchise rentables et modernes.
          </p>
          <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
            {settings?.instagram && (
              <a href={settings.instagram} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem' }}>
                Instagram ↗
              </a>
            )}
            {settings?.facebook && (
              <a href={settings.facebook} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem' }}>
                Facebook ↗
              </a>
            )}
            {settings?.tiktok && (
              <a href={settings.tiktok} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem' }}>
                TikTok ↗
              </a>
            )}
          </div>
        </div>

        <div className="footer-col">
          <h5>Navigation</h5>
          <Link to="/">Accueil</Link>
          <Link to="/produits">Produits B2B</Link>
          <Link to="/points-de-vente">Points de vente</Link>
          <Link to="/notre-histoire">Notre histoire</Link>
          <Link to="/contact">Contact & Partenariat</Link>
        </div>

        <div className="footer-col">
          <h5>Franchise</h5>
          <Link to="/franchise">Vue d’ensemble</Link>
          <Link to="/franchise/coffee-shop">Khatra Coffee Shop</Link>
          <Link to="/franchise/khatra-market">Khatra Market</Link>
          <Link to="/contact">Candidature Franchise</Link>
        </div>

        <div className="footer-col">
          <h5>Contact Direct</h5>
          <div className="footer-contact-item">
            <span>Siège & Showroom</span>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
              {settings?.address || 'Casablanca, Maroc'}
            </p>
          </div>
          <div className="footer-contact-item">
            <span>Téléphone</span>
            <a href={`tel:${settings?.phone || '+212522000000'}`}>
              {settings?.phone || '+212 5 22 00 00 00'}
            </a>
          </div>
          <div className="footer-contact-item">
            <span>Email Pro</span>
            <a href={`mailto:${settings?.email || 'contact@khatra.ma'}`}>
              {settings?.email || 'contact@khatra.ma'}
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} KHATRA S.A.R.L. Tous droits réservés.</span>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <span>Fait au Maroc avec passion</span>
          <Link to="/admin" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', textDecoration: 'underline' }}>
            Portail Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
