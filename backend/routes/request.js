const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const auth = require('../middleware/auth');

// Create a new request
router.post('/', auth, requestController.createRequest);

// Get requests for the logged-in user
router.get('/', auth, requestController.getUserRequests);

// NEW: Search requests (public)
router.get('/search', requestController.searchRequests);

// NEW: Get requests by category (public)
router.get('/category/:category', requestController.getByCategory);

module.exports = router; 