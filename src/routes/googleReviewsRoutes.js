const express = require('express');
const controller = require('../controllers/googleReviewsController');

const router = express.Router();
router.get('/reviews/google', controller.list);

module.exports = router;
