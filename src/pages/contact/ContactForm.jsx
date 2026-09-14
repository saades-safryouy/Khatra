import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Check, ArrowRight } from '../../components/Icons';

export function ContactForm() {
  const { showToast } = useData();
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState(() => {
    const prodParam = searchParams.get('product');
    const subjParam = searchParams.get('subject');
    if (prodParam) {
      return {
        name: '', company: '', email: '', phone: '', subject: 'Produits B2B',
        message: `Bonjour, je souhaite obtenir un devis professionnel pour le produit : ${prodParam}.`
      };
    }
    if (subjParam) {
      return { name: '', company: '', email: '', phone: '', subject: subjParam, message: '' };
    }
    return { name: '', company: '', email: '', phone: '', subject: 'Produits B2B', message: '' };
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      showToast('Votre message a bien été transmis. Notre équipe vous répondra sous 24h.');
    }, 600);
  };

  if (submitted) {
    return (
      <div className="contact-form-wrap" style={{ textAlign: 'center', padding: '48px 24px' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <Check s={32} />
        </div>
        <h3 style={{ marginBottom: '12px' }}>Demande Envoyée !</h3>
        <p style={{ color: 'var(--dark-s)', marginBottom: '28px' }}>
          Merci pour votre intérêt. Un conseiller commercial Khatra prendra contact avec vous dans un délai maximum de 24 heures ouvrées.
        </p>
        <button
          type="button"
          onClick={() => { setSubmitted(false); setForm({ name: '', company: '', email: '', phone: '', subject: 'Produits B2B', message: '' }); }}
          className="btn btn-outline-dark btn-sm"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <div className="contact-form-wrap">
      <form onSubmit={handleSubmit}>
        <h3 style={{ marginBottom: '24px' }}>Formulaire de contact professionnel</h3>

        <div className="form-row">
          <div className="form-group">
            <label>Nom & Prénom *</label>
            <input
              type="text"
              required
              placeholder="Ex: Youssef El Mansouri"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Entreprise / Établissement</label>
            <input
              type="text"
              placeholder="Ex: Café Central / Projet Franchise"
              value={form.company}
              onChange={e => setForm({ ...form, company: e.target.value })}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Email professionnel *</label>
            <input
              type="email"
              required
              placeholder="contact@entreprise.ma"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Téléphone *</label>
            <input
              type="tel"
              required
              placeholder="+212 6 XX XX XX XX"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Objet de la demande *</label>
          <select
            value={form.subject}
            onChange={e => setForm({ ...form, subject: e.target.value })}
          >
            <option value="Produits B2B">Commande / Devis Produits B2B</option>
            <option value="Franchise Coffee Shop">Candidature Franchise Khatra Coffee Shop</option>
            <option value="Franchise Khatra Market">Candidature Franchise Khatra Market</option>
            <option value="Autre partenariat">Autre opportunité de partenariat</option>
          </select>
        </div>

        <div className="form-group">
          <label>Votre message *</label>
          <textarea
            rows="4"
            required
            placeholder="Précisez votre ville, vos besoins ou les détails de votre projet..."
            value={form.message}
            onChange={e => setForm({ ...form, message: e.target.value })}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          {loading ? 'Transmission en cours...' : 'Envoyer ma demande'} <ArrowRight s={16} />
        </button>
      </form>
    </div>
  );
}

export default ContactForm;
