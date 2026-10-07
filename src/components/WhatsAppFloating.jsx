import React from 'react';
import { useData } from '../context/DataContext';
import { useLang } from '../context/LanguageContext';
import { WhatsApp } from './Icons';

export function WhatsAppFloating() {
  const { settings } = useData();
  const { lang } = useLang();
  const num = settings?.whatsapp || '212661000000';
  const message = lang === 'ar'
    ? 'مرحباً خاترة، أود مناقشة فرصة تجارية أو امتياز تجاري.'
    : 'Bonjour Khatra, je souhaite échanger sur une opportunité B2B / Franchise.';
  const url = `https://wa.me/${num}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="wa-float"
      aria-label="Contacter Khatra sur WhatsApp"
      title="Échanger sur WhatsApp"
    >
      <WhatsApp s={26} color="#ffffff" />
    </a>
  );
}

export default WhatsAppFloating;
