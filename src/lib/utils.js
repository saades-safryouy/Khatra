import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL || 'http://localhost:5000';

export function cn(...parts) {
  return twMerge(clsx(parts));
}

export function mediaUrl(path) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith('/uploads/')) return UPLOADS_URL + path;
  if (path.startsWith('uploads/')) return UPLOADS_URL + '/' + path;
  return path;
}

export function initials(firstName = '', lastName = '', email = '') {
  const a = String(firstName || '').trim();
  const b = String(lastName || '').trim();
  if (a || b) return (a.charAt(0) + b.charAt(0)).toUpperCase() || 'KA';
  return String(email || 'KA').slice(0, 2).toUpperCase();
}

export function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('fr-MA', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function formatDateTime(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('fr-MA', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatCurrency(value, currency = 'MAD') {
  if (value === undefined || value === null || value === '') return '—';
  const num = Number(value);
  if (Number.isNaN(num)) return '—';
  return num.toLocaleString('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ' + currency;
}

export function slugify(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function unwrap(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.items)) return payload.items;
  if (payload && Array.isArray(payload.data)) return payload.data;
  return [];
}

export function extractCoords(store) {
  const fromFields = [store?.latitude, store?.longitude];
  if (fromFields.every((n) => n !== undefined && n !== null && n !== '')) {
    const lat = Number(store.latitude);
    const lng = Number(store.longitude);
    if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng };
  }
  const url = String(store?.googleMapsUrl || '');
  const match = url.match(/(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/);
  if (match) {
    const lat = Number(match[1]);
    const lng = Number(match[2]);
    if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng };
  }
  return null;
}

export function mapsUrlFromCoords(lat, lng) {
  if (!lat || !lng) return '';
  return 'https://www.google.com/maps?q=' + lat + ',' + lng;
}

export function productImage(product) {
  const first = product?.images?.[0]?.imageUrl || product?.image;
  return mediaUrl(first);
}

export function inquiryLabel(type) {
  return ({ GENERAL: 'Général', PARTNERSHIP: 'Partenariat', PRODUCT: 'Produit' }[type] || type);
}

export function statusLabel(status) {
  return ({ NEW: 'Nouveau', CONTACTED: 'Contacté', CLOSED: 'Clôturé', ACTIVE: 'Actif', INACTIVE: 'Inactif' }[status] || status);
}
