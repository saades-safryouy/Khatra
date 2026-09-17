# Khatra Backend API

Lightweight Node.js + Express.js + Prisma + MySQL backend for the Khatra B2B platform. JavaScript/CommonJS only.

## Setup

```bash
cd Backend
npm install
cp .env.example .env
```

Update `.env`:

```env
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/khatra_db"
JWT_SECRET="your-long-random-secret"
FRONTEND_URL="http://localhost:5173"
ADMIN_EMAIL="admin@khatra.ma"
ADMIN_PASSWORD="strong-password"
WHATSAPP_PHONE="212661000000"
```

## MySQL

Create an empty database:

```sql
CREATE DATABASE khatra_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

The included `KhatraDB.sql` is a reference/manual SQL file. Prisma migrations are the source of truth for this backend.

## Prisma

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:seed
npm run prisma:studio
```

Seed creates one admin user from `.env` and exactly two franchise concepts: `coffee-shop` and `khatra-market`.

## Run

```bash
npm run dev
# or
npm start
```

Health check: `GET /api/health`

## Auth

- `POST /api/auth/login` body `{ "email": "admin@khatra.ma", "password": "..." }`
- `POST /api/auth/logout`
- `GET /api/auth/me`

Use protected routes with header:

```txt
Authorization: Bearer <token>
```

## Public API

- `GET /api/products?search=&category=&featured=true&page=1&limit=12`
- `GET /api/products/:slug`
- `GET /api/categories`
- `GET /api/categories/:slug`
- `GET /api/locations`
- `GET /api/locations/:slug`
- `GET /api/stores`
- `GET /api/stores/:id`
- `GET /api/franchise`
- `GET /api/franchise/:slug`
- `POST /api/inquiries`

Public APIs return active catalogue/content only.

## Admin API

Protected with JWT:

- `/api/admin/products` GET, POST
- `/api/admin/products/:id` GET, PUT, DELETE
- `/api/admin/categories` GET, POST
- `/api/admin/categories/:id` GET, PUT, DELETE
- `/api/admin/locations` GET, POST
- `/api/admin/locations/:id` GET, PUT, DELETE
- `/api/admin/stores` GET, POST
- `/api/admin/stores/:id` GET, PUT, DELETE
- `/api/admin/franchise` GET
- `/api/admin/franchise/:id` GET, PUT
- `/api/admin/inquiries` GET
- `/api/admin/inquiries/:id` GET, PUT, DELETE

No cart, checkout, payment, stock, price, orders, or customer accounts are included.

## Uploads

Multipart field names:

- Product images: `images` multiple files
- Category image: `image`
- Store image: `image`
- Franchise image: `image`

Files are served from `/uploads/...`. Allowed: jpg, png, webp, gif. Max size configured by `MAX_FILE_SIZE_MB`.

## Response format

Success:

```json
{ "success": true, "data": {} }
```

Error:

```json
{ "success": false, "message": "Product not found" }
```
