const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const auth = require('../middleware/auth');

// Create a new request (requires auth)
router.post('/', auth, requestController.createRequest);

// Get requests for the logged-in user (requires auth)
router.get('/', auth, requestController.getUserRequests);

// Public routes (no auth required)
router.get('/search', requestController.searchRequests);
router.get('/category/:category', requestController.getByCategory);
router.get('/all', requestController.getAllRequests);
router.get('/recent', requestController.getRecentRequests);
router.get('/popular-categories', requestController.getPopularCategories);
router.get('/:id', requestController.getRequestById);

module.exports = router; 