# Khatra Admin Dashboard

Premium B2B administration platform for the Khatra catalogue, points of sale, franchise concepts, and business inquiries.

This app is **separate** from the public website (`Frontend/`) and talks only to the existing backend API.

## Setup

```bash
cd Admin_Dashboard
npm install
npm run dev
```

The dashboard runs on `http://localhost:5174`.

## Environment

```env
VITE_API_URL=http://localhost:5000/api
VITE_UPLOADS_URL=http://localhost:5000
VITE_PUBLIC_SITE_URL=http://localhost:5173
```

Start the backend first (`Backend/` on port 5000).

## Login

Use the seeded admin credentials from `Backend/.env`:

- Email: `admin@khatra.ma`
- Password: value of `ADMIN_PASSWORD`
