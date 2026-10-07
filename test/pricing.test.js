const test = require('node:test');
const assert = require('node:assert/strict');
const { effectivePrice, isPromotionActive, validatePromotion } = require('../src/utils/pricing');

const now = new Date('2026-10-07T14:30:00.000Z');

test('keeps the normal price when a product has no promotion', () => {
  assert.equal(effectivePrice({ price: '120.00', promo: null, promoExpiresAt: null }, now), '120.00');
});

for (const [percentage, expected] of [[10, '108.00'], [20, '96.00'], [50, '60.00']]) {
  test(`calculates the effective price for a ${percentage}% promotion`, () => {
    assert.equal(effectivePrice({
      price: '120.00',
      promo: String(percentage),
      promoExpiresAt: '2026-10-08T14:30:00.000Z',
    }, now), expected);
  });
}

test('automatically treats an expired promotion as inactive', () => {
  const product = { price: '120.00', promo: '20.00', promoExpiresAt: now };
  assert.equal(isPromotionActive(product, now), false);
  assert.equal(effectivePrice(product, now), '120.00');
});

test('treats a zero-percent promotion as inactive', () => {
  const product = { price: '120.00', promo: '0.00', promoExpiresAt: '2026-10-08T14:30:00.000Z' };
  assert.equal(isPromotionActive(product, now), false);
  assert.equal(effectivePrice(product, now), '120.00');
});

test('treats a promotion at 100 percent as inactive', () => {
  const product = { price: '120.00', promo: '100.00', promoExpiresAt: '2026-10-08T14:30:00.000Z' };
  assert.equal(isPromotionActive(product, now), false);
  assert.equal(effectivePrice(product, now), '120.00');
});

test('rejects negative, 100-percent, and over-precision promotions', () => {
  for (const promo of ['-1', '100', '20.123']) {
    assert.throws(() => validatePromotion({ promo, promoExpiresAt: '2026-10-08T14:30:00.000Z' }), { statusCode: 400 });
  }
});

test('rejects an impossible expiration date', () => {
  assert.throws(
    () => validatePromotion({ promo: '20', promoExpiresAt: '2026-02-30T14:30:00.000Z' }),
    { statusCode: 400 },
  );
});

test('requires expiration when setting a promotion and clears both fields when disabling it', () => {
  assert.throws(() => validatePromotion({ promo: '20' }), { statusCode: 400 });
  assert.deepEqual(validatePromotion({ promo: '', promoExpiresAt: '' }), { promo: null, promoExpiresAt: null });
});

test('preserves a promotion on partial product updates', () => {
  const existing = { promo: '20.00', promoExpiresAt: new Date('2026-10-08T14:30:00.000Z') };
  assert.deepEqual(validatePromotion({ name: 'Updated name' }, existing, true), {
    promo: 20,
    promoExpiresAt: existing.promoExpiresAt,
  });
});
