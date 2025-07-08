const db = require('../config/database');

const Request = {
  create: (request, callback) => {
    const { 
      userId, title, description, category, city, address, postalCode, 
      desiredDate, budget, budgetType, urgency, propertyType, propertySize, 
      contactPreference, additionalRequirements, photos 
    } = request;
    
    const sql = `INSERT INTO requests (
      userId, title, description, category, city, address, postalCode, 
      desiredDate, budget, budgetType, urgency, propertyType, propertySize, 
      contactPreference, additionalRequirements, photos
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    db.run(sql, [
      userId, title, description, category, city, address, postalCode, 
      desiredDate, budget, budgetType, urgency, propertyType, propertySize, 
      contactPreference, additionalRequirements, photos
    ], function(err) {
      if (err) return callback(err);
      callback(null, { id: this.lastID, ...request });
    });
  },

  findByUserId: (userId, callback) => {
    db.all('SELECT * FROM requests WHERE userId = ? ORDER BY createdAt DESC', [userId], (err, rows) => {
      if (err) return callback(err);
      callback(null, rows);
    });
  },

  // IMPROVED: Search requests by title, description, category, or city
  search: (query, callback) => {
    const q = `%${query}%`;
    const sql = `
      SELECT r.*, u.firstName, u.lastName, u.city as userCity 
      FROM requests r 
      LEFT JOIN users u ON r.userId = u.id 
      WHERE r.title LIKE ? 
         OR r.description LIKE ? 
         OR r.category LIKE ? 
         OR r.city LIKE ? 
         OR r.propertyType LIKE ?
      ORDER BY 
        CASE 
          WHEN r.title LIKE ? THEN 1
          WHEN r.category LIKE ? THEN 2
          WHEN r.city LIKE ? THEN 3
          ELSE 4
        END,
        r.createdAt DESC 
      LIMIT 20
    `;
    
    db.all(sql, [q, q, q, q, q, q, q, q], (err, rows) => {
      if (err) return callback(err);
      callback(null, rows);
    });
  },

  // IMPROVED: Find requests by category with user info
  findByCategory: (category, callback) => {
    const sql = `
      SELECT r.*, u.firstName, u.lastName, u.city as userCity 
      FROM requests r 
      LEFT JOIN users u ON r.userId = u.id 
      WHERE r.category = ? 
      ORDER BY r.createdAt DESC
    `;
    
    db.all(sql, [category], (err, rows) => {
      if (err) return callback(err);
      callback(null, rows);
    });
  },

  // NEW: Get all requests with user info (for public browsing)
  getAll: (callback) => {
    const sql = `
      SELECT r.*, u.firstName, u.lastName, u.city as userCity 
      FROM requests r 
      LEFT JOIN users u ON r.userId = u.id 
      ORDER BY r.createdAt DESC 
      LIMIT 50
    `;
    
    db.all(sql, (err, rows) => {
      if (err) return callback(err);
      callback(null, rows);
    });
  },

  // NEW: Get request by ID with user info
  findById: (id, callback) => {
    const sql = `
      SELECT r.*, u.firstName, u.lastName, u.email, u.phone, u.city as userCity 
      FROM requests r 
      LEFT JOIN users u ON r.userId = u.id 
      WHERE r.id = ?
    `;
    
    db.get(sql, [id], (err, row) => {
      if (err) return callback(err);
      callback(null, row);
    });
  },

  // NEW: Update request views count
  incrementViews: (id, callback) => {
    db.run('UPDATE requests SET views = views + 1 WHERE id = ?', [id], (err) => {
      if (err) return callback(err);
      callback(null);
    });
  }
};

module.exports = Request; 