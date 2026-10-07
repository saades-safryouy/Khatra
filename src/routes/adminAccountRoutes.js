const express = require('express');
const controller = require('../controllers/adminAccountController');
const { protect, requireAdmin } = require('../middleware/auth');

const router = express.Router();
router.get('/admin/accounts', protect, requireAdmin, controller.list);
router.post('/admin/accounts', protect, requireAdmin, controller.create);
router.patch('/admin/accounts/:id', protect, requireAdmin, controller.update);
router.put('/admin/accounts/:id/password', protect, requireAdmin, controller.changePassword);
router.delete('/admin/accounts/:id', protect, requireAdmin, controller.remove);

module.exports = router;
