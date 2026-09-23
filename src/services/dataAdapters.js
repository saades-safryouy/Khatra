import Images from '../assets/images';
import { resolveImageUrl } from './api';

const PRODUCT_FALLBACK_IMAGES = {
  'grain-khatra': Images.khatra.packaging,
  'cafe-360': Images.khatra.khatra360,
  'sirop-biscuit': Images.syrups.biscuit,
  'sirop-caramel': Images.syrups.caramel,
  'sirop-noisette': Images.syrups.noisette,
  'sirop-toffee': Images.syrups.toffe,
  'bubbles-fraise': Images.bubbles.frais,
  'bubbles-mangue': Images.bubbles.mangue,
  'bubbles-passion': Images.bubbles.passion,
};

const CATEGORY_DEFAULT_IMAGES = {
  'Café': Images.khatra.packaging,
  'Sirops': Images.syrups.syrup3,
  'Bubbles': Images.bubbles.all,
};

function parseJsonOrArray(val, fallback = []) {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return val.split(',').map((s) => s.trim()).filter(Boolean);
    }
  }
  return fallback;
}

export function adaptProduct(p) {
  if (!p) return null;

  const categoryName = typeof p.category === 'object' && p.category ? p.category.name : (p.category || 'Général');
  const categorySlug = typeof p.category === 'object' && p.category ? p.category.slug : '';

  let img = '';
  if (p.images && Array.isArray(p.images) && p.images.length > 0) {
    img = resolveImageUrl(p.images[0].imageUrl || p.images[0].url || p.images[0]);
  } else if (p.image) {
    img = resolveImageUrl(p.image);
  } else if (p.img) {
    img = resolveImageUrl(p.img);
  }

  if (!img) {
    img = PRODUCT_FALLBACK_IMAGES[p.slug] || CATEGORY_DEFAULT_IMAGES[categoryName] || Images.khatra.packaging;
  }

  const galleryImages = (p.images && Array.isArray(p.images) && p.images.length > 0)
    ? p.images.map((im) => resolveImageUrl(im.imageUrl || im.url || im))
    : [img];

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: categoryName,
    categoryId: p.categoryId || (p.category && p.category.id),
    categorySlug,
    reference: p.reference || '',
    short: p.shortDescription || p.short || '',
    desc: p.description || p.desc || '',
    formats: parseJsonOrArray(p.formats, ['Standard']),
    features: parseJsonOrArray(p.features, []),
    featured: Boolean(p.featured),
    status: p.status || 'ACTIVE',
    img,
    images: galleryImages,
  };
}

export function adaptStore(s) {
  if (!s) return null;

  const cityName = s.city || (s.location && (s.location.city || s.location.name)) || 'Casablanca';

  let type = s.type || 'Coffee Shop';
  let hours = s.hours || 'Lun - Dim: 07h00 - 23h00';
  if (s.description && s.description.includes('|')) {
    const parts = s.description.split('|').map((str) => str.trim());
    if (parts[0]) type = parts[0];
    if (parts[1]) hours = parts[1];
  } else if (s.description) {
    type = s.description;
  }

  let img = '';
  if (s.image) {
    img = resolveImageUrl(s.image);
  } else if (s.imageUrl || s.img) {
    img = resolveImageUrl(s.imageUrl || s.img);
  } else {
    img = Images.khatra.khatra360;
  }

  const lat = s.latitude !== undefined && s.latitude !== null ? Number(s.latitude) : (s.lat !== undefined ? Number(s.lat) : null);
  const lng = s.longitude !== undefined && s.longitude !== null ? Number(s.longitude) : (s.lng !== undefined ? Number(s.lng) : null);

  return {
    id: s.id,
    name: s.name,
    city: cityName,
    locationId: s.locationId || (s.location && s.location.id),
    address: s.address || '',
    hours,
    type,
    phone: s.phone || '+212 5 22 00 00 00',
    email: s.email || 'contact@khatra.ma',
    mapsUrl: s.googleMapsUrl || s.mapsUrl || '#',
    img,
    latitude: lat,
    longitude: lng,
    active: s.active !== false,
  };
}

export function adaptFranchise(f) {
  if (!f) return null;
  return {
    id: f.id,
    name: f.name,
    slug: f.slug,
    shortDescription: f.shortDescription || '',
    description: f.description || '',
    whatsappMessage: f.whatsappMessage || '',
    image: resolveImageUrl(f.image, Images.khatra.khatra360),
    active: f.active !== false,
    displayOrder: f.displayOrder || 0,
  };
}
