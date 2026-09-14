import React from 'react';
import SEO from '../components/SEO';
import ContactChannels from './contact/ContactChannels';
import ContactForm from './contact/ContactForm';

export function ContactPage() {
  return (
    <div className="contact-page">
      <SEO
        title="Contact & Partenariat B2B"
        description="Contactez l'équipe Khatra pour toute demande de devis, commande professionnelle ou projet de franchise au Maroc."
      />

      <div className="page-header no-image">
        <div className="page-header-inner">
          <span className="eyebrow">Échange & Partenariat</span>
          <h1>Contactez-nous</h1>
          <p>
            Vous êtes professionnel, investisseur ou futur franchisé ? Discutons de vos besoins et construisons votre projet.
          </p>
        </div>
      </div>

      <div className="contact-wrap">
        <ContactChannels />
        <ContactForm />
      </div>
    </div>
  );
}

export default ContactPage;

