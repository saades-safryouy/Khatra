require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,

  // Local development
  /^http:\/\/localhost:\d+$/,

  // Production
  'https://khatra-drab.vercel.app/',
  'https://khatra-git-admindashboard-mazozisaad-8056s-projects.vercel.app/',
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(
  '/uploads',
  express.static(path.join(__dirname, '..', 'uploads'))
);

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    data: { status: 'ok' },
  });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api', require('./routes/adminAnalyticsRoutes'));
app.use('/api', require('./routes/adminAccountRoutes'));
app.use('/api', require('./routes/productRoutes'));
app.use('/api', require('./routes/googleReviewsRoutes'));
app.use('/api', require('./routes/categoryRoutes'));
app.use('/api', require('./routes/locationRoutes'));
app.use('/api', require('./routes/storeRoutes'));
app.use('/api', require('./routes/franchiseRoutes'));
app.use('/api', require('./routes/inquiryRoutes'));
app.use('/api', require('./routes/translationRoutes'));

app.use(notFound);
app.use(errorHandler);

module.exports = app;