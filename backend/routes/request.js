const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const auth = require('../middleware/auth');

// Krijo një kërkesë të re
router.post('/', auth, requestController.createRequest);

// Merr të gjitha kërkesat e përdoruesit
router.get('/', auth, requestController.getUserRequests);

module.exports = router; 