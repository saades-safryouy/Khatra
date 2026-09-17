require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const app = express();
app.use(cors({
  // CAVEMAN: Vite changes ports when one is busy. Allow local dev ports so browser no block API.
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    process.env.ADMIN_URL || 'http://localhost:5174',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
  ],
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.get('/api/health', (req,res)=>res.json({ success:true, data:{ status:'ok' } }));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api', require('./routes/productRoutes'));
app.use('/api', require('./routes/categoryRoutes'));
app.use('/api', require('./routes/locationRoutes'));
app.use('/api', require('./routes/storeRoutes'));
app.use('/api', require('./routes/franchiseRoutes'));
app.use('/api', require('./routes/inquiryRoutes'));
app.use(notFound);
app.use(errorHandler);
module.exports = app;
