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
  }
};

module.exports = Request; 