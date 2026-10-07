const test = require('node:test');
const assert = require('node:assert/strict');
const prisma = require('../src/config/database');
const inquiryService = require('../src/services/inquiryService');

test('inquiry creation recalculates active and expired promotion prices from products', async () => {
  const originalTransaction = prisma.$transaction;
  const captured = {};
  const products = [
    {
      id: 1,
      name: 'Promotional product',
      price: '120.00',
      promo: '20.00',
      promoExpiresAt: new Date('2099-01-01T00:00:00.000Z'),
      images: [],
    },
    {
      id: 2,
      name: 'Expired promotion product',
      price: '120.00',
      promo: '20.00',
      promoExpiresAt: new Date('2000-01-01T00:00:00.000Z'),
      images: [],
    },
  ];

  prisma.$transaction = async (callback) => callback({
    product: { findMany: async () => products },
    inquiry: { create: async ({ data }) => { captured.data = data; return data; } },
  });

  try {
    const result = await inquiryService.create({
      type: 'PRODUCT',
      name: 'Test Buyer',
      email: 'buyer@example.com',
      language: 'fr',
      items: [
        { productId: 1, quantity: 1, unitPrice: 0.01, effectivePrice: 0.01 },
        { productId: 2, quantity: 1, unitPrice: 0.01, effectivePrice: 0.01 },
      ],
    });
    const savedItems = captured.data.items.create;

    assert.equal(captured.data.cartTotal, '216.00');
    assert.equal(savedItems[0].unitPrice, '96.00');
    assert.equal(savedItems[1].unitPrice, '120.00');
    assert.match(captured.data.message, /Prix normal : 120\.00 MAD/);
    assert.match(captured.data.message, /Promotion : -20%/);
    assert.equal(result.summary, captured.data.message);
  } finally {
    prisma.$transaction = originalTransaction;
  }
});
