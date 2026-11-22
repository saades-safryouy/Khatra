# Khatra API — Express + MySQL backend

Backend for the Khatra B2B coffee marketplace frontend (React + Vite).
Implements the contract in `~/workspace/hosting/khatra/BACKEND_SPEC.md`:
JWT auth, public catalog endpoints, admin CRUD with image uploads,
inquiries/quote, Google reviews, and a French-fallback translate endpoint.

## Run locally

```bash
cd server
npm install
cp .env.example .env   # fill in your DB credentials + secrets
npm run seed           # create tables + seed catalog, stores, admin user
npm start              # listens on PORT (default 5000)
```

Health check: `GET /api/health` → `{ "data": { "ok": true } }`.

## Env vars

| Var | Required | Purpose |
|---|---|---|
| `PORT` | no (5000) | Listen port |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | yes | MySQL connection (TiDB Cloud works — add `DB_SSL=true`, `DB_SSL_CA` for the CA cert path) |
| `JWT_SECRET` | yes | Secret used to sign auth tokens |
| `JWT_EXPIRES_IN` | no (7d) | Token lifetime |
| `ADMIN_EMAIL` | no (admin@khatra.ma) | Admin user created by the seed |
| `ADMIN_PASSWORD` **or** `ADMIN_PASSWORD_HASH` | yes, for the seed | Admin password (plain, hashed at seed) or a bcrypt hash. No hardcoded fallback password exists anywhere. |
| `CORS_ORIGIN` | no | Comma-separated allowed frontend origins (empty = reflect any origin, dev only) |
| `GOOGLE_PLACES_API_KEY`, `GOOGLE_PLACE_ID` | no | Without these, `GET /reviews/google` returns `configured: false` |
| `TRANSLATE_API_KEY` | no | Without a provider, `POST /translate` returns the French texts unchanged |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `INQUIRY_EMAIL` | no | Without SMTP, inquiries are stored only (`emailDelivery.configured: false`) |

## Endpoints

All responses are wrapped: `{ "data": ..., "meta": ... }`.
List endpoints return `meta: { page, limit, total, pages }` (12/page).

Public (`/api`): `GET /products` (pagination, `?category=<slug>`, `?search=`),
`GET /products/:slug`, `GET /categories`, `GET /categories/:slug`,
`GET /stores`, `GET /stores/:id`, `GET /locations`, `GET /locations/:slug`,
`GET /franchises`, `GET /franchises/:slug`, `GET /reviews/google`,
`POST /inquiries/quote`, `POST /inquiries`, `POST /translate`.

Auth (`/api/auth`): `POST /login`, `GET /me`, `POST /logout` (Bearer JWT).

Admin (`/api/admin`, Bearer + `ADMIN` role): `GET/POST/PUT/DELETE /products`
(multipart, repeat the `images` field), `GET/POST/PUT/DELETE /stores`
(multipart, single `image` field), `GET /categories` (read-only).

Uploads are stored under `public/uploads/` and served as `/uploads/...`
(use a persistent volume on Railway so they survive redeploys).

## Seed data

`seed-data.json` holds 3 categories, 11 products (copied from the frontend's
`src/data/products.js` — **no prices**: `price` is `null` = "Prix sur demande",
set prices via the admin API), 5 stores, 4 locations and 2 franchise concepts.
The seed is idempotent — re-running it only fills empty tables.
