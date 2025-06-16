const db = require('../config/database');

const Request = {
  create: (request, callback) => {
    const { userId, title, description, category, city, address, desiredDate, budget } = request;
    const sql = `INSERT INTO requests (userId, title, description, category, city, address, desiredDate, budget) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    db.run(sql, [userId, title, description, category, city, address, desiredDate, budget], function(err) {
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