import React from 'react';
import { Phone, Mail, MapPin, WhatsApp } from '../../components/Icons';
import { useData } from '../../context/DataContext';
import { useLang } from '../../context/LanguageContext';

export function ContactChannels() {
  const { settings } = useData();
  const { lang } = useLang();
  const waNum = settings?.whatsapp || '212661000000';
  const waMessage = lang === 'ar'
    ? 'مرحباً خاترة، أود التواصل معكم بشأن مشروع تجاري أو امتياز تجاري.'
    : 'Bonjour Khatra, je souhaite vous contacter pour un projet B2B / Franchise.';
  const waUrl = `https://wa.me/${waNum}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="contact-info">
      <span className="eyebrow">Canaux Directs</span>
      <h2>Une équipe dédiée à votre service.</h2>
      <p>
        Nous répondons rapidement à toutes vos demandes de devis, échantillons et informations de franchise.
      </p>

      <div className="contact-channels">
        <div className="contact-channel">
          <div className="contact-channel-icon" style={{ background: '#dcfce7', color: '#16a34a' }}>
            <WhatsApp s={22} color="#16a34a" />
          </div>
          <div className="contact-channel-info">
            <span>WhatsApp Business</span>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600 }}>
              Démarrer une conversation WhatsApp ↗
            </a>
          </div>
        </div>

        <div className="contact-channel">
          <div className="contact-channel-icon">
            <Phone s={20} color="var(--bordeaux)" />
          </div>
          <div className="contact-channel-info">
            <span>Ligne Téléphonique</span>
            <a href={`tel:${settings?.phone || '+212522000000'}`}>
              {settings?.phone || '+212 5 22 00 00 00'}
            </a>
          </div>
        </div>

        <div className="contact-channel">
          <div className="contact-channel-icon">
            <Mail s={20} color="var(--bordeaux)" />
          </div>
          <div className="contact-channel-info">
            <span>Courrier Électronique</span>
            <a href={`mailto:${settings?.email || 'contact@khatra.ma'}`}>
              {settings?.email || 'contact@khatra.ma'}
            </a>
          </div>
        </div>

        <div className="contact-channel">
          <div className="contact-channel-icon">
            <MapPin s={20} color="var(--bordeaux)" />
          </div>
          <div className="contact-channel-info">
            <span>Showroom & Siège</span>
            <p>{settings?.address || 'Casablanca, Maroc'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactChannels;
