const Request = require('../models/Request');

exports.createRequest = (req, res) => {
  const userId = req.user.id;
  const { 
    title, description, category, city, address, postalCode, 
    desiredDate, budget, budgetType, urgency, propertyType, propertySize, 
    contactPreference, additionalRequirements, photos 
  } = req.body;
  
  if (!title || !description || !category || !city) {
    return res.status(400).json({ message: 'Ju lutem plotësoni të gjitha fushat e detyrueshme!' });
  }
  
  Request.create({ 
    userId, title, description, category, city, address, postalCode, 
    desiredDate, budget, budgetType, urgency, propertyType, propertySize, 
    contactPreference, additionalRequirements, photos 
  }, (err, request) => {
    if (err) return res.status(500).json({ message: 'Gabim në ruajtjen e kërkesës.' });
    res.status(201).json({ message: 'Kërkesa u postua me sukses!', request });
  });
};

exports.getUserRequests = (req, res) => {
  const userId = req.user.id;
  Request.findByUserId(userId, (err, requests) => {
    if (err) return res.status(500).json({ message: 'Gabim në marrjen e kërkesave.' });
    res.json(requests);
  });
};

// IMPROVED: Search requests by title, description, category, or city
exports.searchRequests = (req, res) => {
  const { query } = req.query;
  if (!query || query.trim().length < 2) {
    return res.json([]);
  }
  
  Request.search(query.trim(), (err, results) => {
    if (err) return res.status(500).json({ message: 'Gabim në kërkim.' });
    res.json(results);
  });
};

// IMPROVED: Get requests by category
exports.getByCategory = (req, res) => {
  const { category } = req.params;
  if (!category) return res.status(400).json({ message: 'Kategoria mungon.' });
  
  Request.findByCategory(category, (err, results) => {
    if (err) return res.status(500).json({ message: 'Gabim në filtrimin e kërkesave.' });
    res.json(results);
  });
};

// NEW: Get all requests (public)
exports.getAllRequests = (req, res) => {
  Request.getAll((err, results) => {
    if (err) return res.status(500).json({ message: 'Gabim në marrjen e kërkesave.' });
    res.json(results);
  });
};

// NEW: Get request by ID (public)
exports.getRequestById = (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: 'ID e kërkesës mungon.' });
  
  // Increment views
  Request.incrementViews(id, (err) => {
    if (err) console.error('Error incrementing views:', err);
  });
  
  Request.findById(id, (err, result) => {
    if (err) return res.status(500).json({ message: 'Gabim në marrjen e kërkesës.' });
    if (!result) return res.status(404).json({ message: 'Kërkesa nuk u gjet.' });
    res.json(result);
  });
};

// NEW: Get popular categories
exports.getPopularCategories = (req, res) => {
  const sql = `
    SELECT category, COUNT(*) as count 
    FROM requests 
    GROUP BY category 
    ORDER BY count DESC 
    LIMIT 10
  `;
  
  const db = require('../config/database');
  db.all(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Gabim në marrjen e kategorive.' });
    res.json(results);
  });
};

// NEW: Get recent requests
exports.getRecentRequests = (req, res) => {
  const limit = req.query.limit || 10;
  const sql = `
    SELECT r.*, u.firstName, u.lastName, u.city as userCity 
    FROM requests r 
    LEFT JOIN users u ON r.userId = u.id 
    ORDER BY r.createdAt DESC 
    LIMIT ?
  `;
  
  const db = require('../config/database');
  db.all(sql, [limit], (err, results) => {
    if (err) return res.status(500).json({ message: 'Gabim në marrjen e kërkesave.' });
    res.json(results);
  });
}; 