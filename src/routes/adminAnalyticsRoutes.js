const express = require('express');
const controller = require('../controllers/adminAnalyticsController');
const { protect, requireAdmin } = require('../middleware/auth');

const router = express.Router();
router.get('/admin/analytics', protect, requireAdmin, controller.overview);

module.exports = router;
