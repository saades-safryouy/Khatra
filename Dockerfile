# Khatra frontend — React + Vite, served with `vite preview` on Railway.
FROM node:20-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . ./

# Vite bakes VITE_* variables into the bundle at build time. Railway provides
# VITE_API_URL / VITE_UPLOADS_URL as service variables (they take precedence
# over .env files); .env.production carries the live URLs as a fallback.
RUN npm run build

EXPOSE 4173
CMD ["sh", "-c", "npm run preview -- --port ${PORT:-4173} --host 0.0.0.0"]
