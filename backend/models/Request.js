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
  },

  // NEW: Get all requests with pagination, filtra dhe total
  getAllPaginated: (options, callback) => {
    const { page = 1, pageSize = 20, search = '', category = '', city = '', sort = 'newest' } = options;
    const offset = (page - 1) * pageSize;
    let where = [];
    let params = [];

    if (search && search.trim()) {
      where.push(`(r.title LIKE ? OR r.description LIKE ? OR r.category LIKE ? OR r.city LIKE ? OR r.propertyType LIKE ?)`);
      const q = `%${search.trim()}%`;
      params.push(q, q, q, q, q);
    }
    if (category) {
      where.push('r.category = ?');
      params.push(category);
    }
    if (city) {
      where.push('r.city = ?');
      params.push(city);
    }

    let whereSql = where.length ? 'WHERE ' + where.join(' AND ') : '';

    let orderBy = 'r.createdAt DESC';
    if (sort === 'oldest') orderBy = 'r.createdAt ASC';
    if (sort === 'budget-high') orderBy = 'CAST(r.budget AS INTEGER) DESC';
    if (sort === 'budget-low') orderBy = 'CAST(r.budget AS INTEGER) ASC';
    if (sort === 'urgent') orderBy = `CASE WHEN r.urgency = 'urgent' THEN 0 ELSE 1 END, r.createdAt DESC`;

    // Query for paginated data
    const sql = `
      SELECT r.*, u.firstName, u.lastName, u.city as userCity
      FROM requests r
      LEFT JOIN users u ON r.userId = u.id
      ${whereSql}
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `;
    // Query for total count
    const countSql = `
      SELECT COUNT(*) as total
      FROM requests r
      ${whereSql}
    `;

    const db = require('../config/database');
    db.all(sql, [...params, pageSize, offset], (err, rows) => {
      if (err) return callback(err);
      db.get(countSql, params, (err2, countRow) => {
        if (err2) return callback(err2);
        callback(null, { requests: rows, total: countRow ? countRow.total : 0 });
      });
    });
  }
};

module.exports = Request; 