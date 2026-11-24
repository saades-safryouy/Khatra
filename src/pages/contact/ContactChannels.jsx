import React from 'react';
import { Phone, Mail, MapPin } from '../../components/Icons';
import { useData } from '../../context/DataContext';

export function ContactChannels() {
  const { settings } = useData();

  return (
    <div className="contact-info">
      <span className="eyebrow">Canaux Directs</span>
      <h2>Une équipe dédiée à votre service.</h2>
      <p>
        Nous répondons rapidement à toutes vos demandes de devis, échantillons et informations de franchise.
      </p>

      <div className="contact-channels">
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
