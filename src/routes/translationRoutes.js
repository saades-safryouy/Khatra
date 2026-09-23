const express = require('express');
const c = require('../controllers/translationController');
const r = express.Router();
r.post('/translate', c.translate);
module.exports = r;
