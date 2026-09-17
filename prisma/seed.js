const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const prisma = new PrismaClient();
const prods = require('./seedProducts');

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@khatra.ma';
  const password = process.env.ADMIN_PASSWORD || 'khatra2026';
  const hashed = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: { firstName: 'Khatra', lastName: 'Admin', password: hashed, role: 'ADMIN', active: true },
    create: { firstName: 'Khatra', lastName: 'Admin', email, password: hashed, role: 'ADMIN', active: true }
  });

  const concepts = [
    { name: 'Khatra Coffee Shop', slug: 'coffee-shop', shortDescription: 'L’expérience du café de spécialité, baristas formés et espace de vie chaleureux.', description: 'Découvrez le concept de franchise Khatra Coffee Shop.', whatsappMessage: 'Bonjour Khatra, je suis intéressé par la franchise Khatra Coffee Shop.', active: true, displayOrder: 1 },
    { name: 'Khatra Market', slug: 'khatra-market', shortDescription: 'Boutique gourmande dédiée au café, sirops artisanaux et accessoires barista.', description: 'Découvrez le concept de franchise Khatra Market.', whatsappMessage: 'Bonjour Khatra, je suis intéressé par la franchise Khatra Market.', active: true, displayOrder: 2 }
  ];
  for (const c of concepts) await prisma.franchiseConcept.upsert({ where: { slug: c.slug }, update: c, create: c });

  const cats = [
    { name: 'Café', slug: 'cafe', description: 'Grains d’exception et blends signatures.', displayOrder: 1, active: true },
    { name: 'Sirops', slug: 'sirops', description: 'Sirops gourmands et concentrés.', displayOrder: 2, active: true },
    { name: 'Bubbles', slug: 'bubbles', description: 'Perles de fruits éclatantes.', displayOrder: 3, active: true }
  ];
  const catMap = {};
  for (const c of cats) catMap[c.slug] = await prisma.category.upsert({ where: { slug: c.slug }, update: c, create: c });

  const locs = [
    { name: 'Casablanca Centre', city: 'Casablanca', slug: 'casablanca', active: true },
    { name: 'Rabat Agdal', city: 'Rabat', slug: 'rabat', active: true },
    { name: 'Marrakech Guéliz', city: 'Marrakech', slug: 'marrakech', active: true },
    { name: 'Tanger Malabata', city: 'Tanger', slug: 'tanger', active: true }
  ];
  const locMap = {};
  for (const l of locs) locMap[l.slug] = await prisma.location.upsert({ where: { slug: l.slug }, update: l, create: l });

  const stores = [
    { name: 'Khatra Flagship Hay Sadri', locationId: locMap['casablanca'].id, address: 'Boulevard Mohamed Bouziane, Hay Sadri, Casablanca', phone: '+212 5 22 10 20 30', googleMapsUrl: 'https://maps.google.com/?q=Hay+Sadri+Casablanca', description: 'Coffee Shop & Showroom | Lun - Dim: 07h00 - 23h00', active: true },
    { name: 'Khatra Coffee Maarif', locationId: locMap['casablanca'].id, address: 'Rue Jean Jaurès, Maarif, Casablanca', phone: '+212 5 22 20 30 40', googleMapsUrl: 'https://maps.google.com/?q=Maarif+Casablanca', description: 'Coffee Shop | Lun - Dim: 07h30 - 23h30', active: true },
    { name: 'Khatra Coffee Agdal', locationId: locMap['rabat'].id, address: 'Avenue Fal Ould Oumeir, Agdal, Rabat', phone: '+212 5 37 30 40 50', googleMapsUrl: 'https://maps.google.com/?q=Agdal+Rabat', description: 'Coffee Shop & Boutique | Lun - Sam: 08h00 - 22h30', active: true },
    { name: 'Khatra Guéliz', locationId: locMap['marrakech'].id, address: 'Boulevard Mohamed V, Guéliz, Marrakech', phone: '+212 5 24 40 50 60', googleMapsUrl: 'https://maps.google.com/?q=Gueliz+Marrakech', description: 'Coffee Shop | Lun - Dim: 08h00 - 00h00', active: true },
    { name: 'Khatra Malabata', locationId: locMap['tanger'].id, address: 'Boulevard Mohamed VI, Malabata, Tanger', phone: '+212 5 39 50 60 70', googleMapsUrl: 'https://maps.google.com/?q=Malabata+Tanger', description: 'Coffee Shop & Terrace | Lun - Dim: 08h00 - 23h00', active: true }
  ];
  for (const s of stores) {
    const ex = await prisma.store.findFirst({ where: { name: s.name } });
    if (ex) await prisma.store.update({ where: { id: ex.id }, data: s });
    else await prisma.store.create({ data: s });
  }

  for (const p of prods) {
    const { catSlug, ...data } = p;
    data.categoryId = catMap[catSlug].id;
    await prisma.product.upsert({ where: { slug: data.slug }, update: data, create: data });
  }

  console.log('Seed completed successfully!');
}

main().catch(e => { console.error('Seed error:', e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
