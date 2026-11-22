// Shapes the DB rows into the objects the Khatra frontend expects
// (see BACKEND_SPEC.md §3). The frontend adapter is tolerant, but we
// return the canonical shape directly.

function parseJson(value, fallback) {
  if (value == null) return fallback;
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch {
      return value.split(',').map((s) => s.trim()).filter(Boolean);
    }
  }
  return fallback;
}

function toNumberOrNull(v) {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function isPromoActive(p) {
  const promo = Number(p.promo || 0);
  if (!(promo > 0 && promo < 100)) return false;
  if (!p.promoExpiresAt && !p.promo_expires_at) return false;
  const exp = new Date(p.promoExpiresAt || p.promo_expires_at);
  return exp.getTime() > Date.now();
}

function effectivePrice(p) {
  const price = toNumberOrNull(p.price);
  if (price === null) return null;
  if (isPromoActive(p)) {
    return Math.round(price * (1 - Number(p.promo) / 100) * 100) / 100;
  }
  return price;
}

function serializeCategory(row) {
  if (!row) return null;
  return { id: row.id, name: row.name, slug: row.slug, image: row.image || null };
}

function serializeProduct(row, images = [], category = null) {
  const cat = category || (row.category_id
    ? { id: row.category_id, name: row.category_name, slug: row.category_slug }
    : null);
  const promoActive = isPromoActive(row);
  const price = toNumberOrNull(row.price);
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: cat,
    categoryId: row.category_id ?? null,
    categorySlug: cat ? cat.slug : null,
    reference: row.reference || null,
    price,
    effectivePrice: effectivePrice(row),
    promo: Number(row.promo || 0),
    promoExpiresAt: row.promo_expires_at
      ? new Date(row.promo_expires_at).toISOString()
      : null,
    promoActive,
    shortDescription: row.short_description || null,
    description: row.description || null,
    formats: parseJson(row.formats, ['Standard']),
    features: parseJson(row.features, []),
    featured: Boolean(row.featured),
    status: row.status || 'ACTIVE',
    image: images.length ? images[0].imageUrl : null,
    images: images.map((im) => ({ imageUrl: im.imageUrl })),
  };
}

function serializeStore(row) {
  return {
    id: row.id,
    name: row.name,
    city: row.city || 'Casablanca',
    locationId: row.location_id ?? null,
    location: row.location_id
      ? { id: row.location_id, city: row.city, name: row.city }
      : null,
    address: row.address || null,
    hours: row.hours || 'Lun - Dim: 07h00 - 23h00',
    type: row.type || 'Coffee Shop',
    description: row.description || null,
    phone: row.phone || '+212 5 22 00 00 00',
    email: row.email || 'contact@khatra.ma',
    googleMapsUrl: row.google_maps_url || '#',
    image: row.image || null,
    latitude: row.latitude !== null && row.latitude !== undefined ? Number(row.latitude) : null,
    longitude: row.longitude !== null && row.longitude !== undefined ? Number(row.longitude) : null,
    active: row.active !== 0 && row.active !== false,
  };
}

function serializeLocation(row) {
  return { id: row.id, slug: row.slug, name: row.name, city: row.city };
}

function serializeFranchise(row) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    shortDescription: row.short_description || null,
    description: row.description || null,
    whatsappMessage: row.whatsapp_message || null,
    image: row.image || null,
    active: row.active !== 0 && row.active !== false,
    displayOrder: row.display_order ?? 0,
  };
}

module.exports = {
  parseJson,
  toNumberOrNull,
  isPromoActive,
  effectivePrice,
  serializeCategory,
  serializeProduct,
  serializeStore,
  serializeLocation,
  serializeFranchise,
};
