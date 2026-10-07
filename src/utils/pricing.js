const { AppError } = require('./helpers');

function toCents(value) {
  const match = String(value).match(/^(\d+)(?:\.(\d{1,2}))?$/);
  if (!match) throw new AppError('Le prix doit comporter au maximum deux décimales.', 400);
  return BigInt(match[1]) * 100n + BigInt((match[2] || '').padEnd(2, '0'));
}

function formatCents(cents) {
  const value = BigInt(cents);
  return `${value / 100n}.${String(value % 100n).padStart(2, '0')}`;
}

function promoBasisPoints(promo) {
  const match = String(promo).match(/^(\d{1,3})(?:\.(\d{1,2}))?$/);
  if (!match) return null;
  return Number(match[1]) * 100 + Number((match[2] || '').padEnd(2, '0'));
}

function isPromotionActive(product, now = new Date()) {
  if (product?.promo === null || product?.promo === undefined) return false;
  const percentage = Number(product.promo);
  const expiration = product.promoExpiresAt ?? product.promo_expires_at;
  const expirationTime = expiration ? new Date(expiration).getTime() : Number.NaN;
  return Number.isFinite(percentage)
    && percentage > 0
    && percentage < 100
    && Number.isFinite(expirationTime)
    && expirationTime > now.getTime();
}

function effectivePrice(product, now = new Date()) {
  if (product?.price === null || product?.price === undefined) return null;
  const originalCents = toCents(product.price);
  if (!isPromotionActive(product, now)) return formatCents(originalCents);

  const percentage = promoBasisPoints(product.promo);
  if (percentage === null) return formatCents(originalCents);
  const discountedCents = (originalCents * BigInt(10000 - percentage) + 5000n) / 10000n;
  return formatCents(discountedCents);
}

function validatePromotion(data, existing = null, partial = false) {
  const promoValue = data.promo === undefined && partial
    ? existing?.promo
    : data.promo === '' || data.promo === null || data.promo === undefined ? null : data.promo;
  const expiryInput = data.promoExpiresAt ?? data.promo_expires_at;
  const expiryValue = expiryInput === undefined && partial
    ? existing?.promoExpiresAt
    : expiryInput === '' || expiryInput === null || expiryInput === undefined ? null : expiryInput;

  let promo = null;
  if (promoValue !== null && promoValue !== undefined) {
    const raw = String(promoValue).trim();
    const percentage = Number(raw);
    if (!/^\d{1,3}(?:\.\d{1,2})?$/.test(raw) || !Number.isFinite(percentage) || percentage < 0 || percentage >= 100) {
      throw new AppError('Le pourcentage de réduction doit être compris entre 0 et 99,99 et comporter au maximum deux décimales.', 400);
    }
    promo = percentage;
  }

  let promoExpiresAt = null;
  if (expiryValue !== null && expiryValue !== undefined) {
    if (expiryValue instanceof Date) {
      if (!Number.isFinite(expiryValue.getTime())) {
        throw new AppError('La date et l’heure d’expiration de la promotion sont invalides.', 400);
      }
      promoExpiresAt = expiryValue;
    } else {
      const raw = String(expiryValue).trim();
      const parsed = new Date(raw);
      const parts = raw.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})?$/);
      const [, year, month, day, hour, minute, second = '0'] = parts || [];
      const dayCount = parts ? new Date(Date.UTC(Number(year), Number(month), 0)).getUTCDate() : 0;
      const validParts = parts
        && Number(month) >= 1 && Number(month) <= 12
        && Number(day) >= 1 && Number(day) <= dayCount
        && Number(hour) <= 23
        && Number(minute) <= 59
        && Number(second) <= 59;
      if (!validParts || !Number.isFinite(parsed.getTime())) {
        throw new AppError('La date et l’heure d’expiration de la promotion sont invalides.', 400);
      }
      promoExpiresAt = parsed;
    }
  }

  if (promo !== null && !promoExpiresAt) {
    throw new AppError('Une date et une heure d’expiration sont obligatoires pour la promotion.', 400);
  }
  if (promo === null && promoExpiresAt) {
    throw new AppError('Supprimez la date d’expiration lorsqu’aucune promotion n’est définie.', 400);
  }
  return { promo, promoExpiresAt };
}

module.exports = { effectivePrice, isPromotionActive, validatePromotion };
