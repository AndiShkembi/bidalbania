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

// NEW: Search requests by title or description
exports.searchRequests = (req, res) => {
  const { query } = req.query;
  if (!query) return res.json([]);
  Request.search(query, (err, results) => {
    if (err) return res.status(500).json({ message: 'Gabim në kërkim.' });
    res.json(results);
  });
};

// NEW: Get requests by category
exports.getByCategory = (req, res) => {
  const { category } = req.params;
  if (!category) return res.status(400).json({ message: 'Kategoria mungon.' });
  Request.findByCategory(category, (err, results) => {
    if (err) return res.status(500).json({ message: 'Gabim në filtrimin e kërkesave.' });
    res.json(results);
  });
}; 