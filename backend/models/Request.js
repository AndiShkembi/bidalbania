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
    
    try {
      const stmt = db.prepare(sql);
      const result = stmt.run([
        userId, title, description, category, city, address, postalCode, 
        desiredDate, budget, budgetType, urgency, propertyType, propertySize, 
        contactPreference, additionalRequirements, photos
      ]);
      callback(null, { id: result.lastInsertRowid, ...request });
    } catch (err) {
      callback(err);
    }
  },

  findByUserId: (userId, callback) => {
    try {
      const stmt = db.prepare('SELECT * FROM requests WHERE userId = ? ORDER BY createdAt DESC');
      const rows = stmt.all([userId]);
      callback(null, rows);
    } catch (err) {
      callback(err);
    }
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
    
    try {
      const stmt = db.prepare(sql);
      const rows = stmt.all([q, q, q, q, q, q, q, q]);
      callback(null, rows);
    } catch (err) {
      callback(err);
    }
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
    
    try {
      const stmt = db.prepare(sql);
      const rows = stmt.all([category]);
      callback(null, rows);
    } catch (err) {
      callback(err);
    }
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
    
    try {
      const stmt = db.prepare(sql);
      const rows = stmt.all();
      callback(null, rows);
    } catch (err) {
      callback(err);
    }
  },

  // NEW: Get request by ID with user info
  findById: (id, callback) => {
    const sql = `
      SELECT r.*, u.firstName, u.lastName, u.email, u.phone, u.city as userCity 
      FROM requests r 
      LEFT JOIN users u ON r.userId = u.id 
      WHERE r.id = ?
    `;
    
    try {
      const stmt = db.prepare(sql);
      const row = stmt.get([id]);
      callback(null, row);
    } catch (err) {
      callback(err);
    }
  },

  // NEW: Update request views count
  incrementViews: (id, callback) => {
    try {
      const stmt = db.prepare('UPDATE requests SET views = views + 1 WHERE id = ?');
      stmt.run([id]);
      callback(null);
    } catch (err) {
      callback(err);
    }
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

    try {
      const stmt = db.prepare(sql);
      const rows = stmt.all([...params, pageSize, offset]);
      const countStmt = db.prepare(countSql);
      const countRow = countStmt.get(params);
      callback(null, { requests: rows, total: countRow ? countRow.total : 0 });
    } catch (err) {
      callback(err);
    }
  }
};

module.exports = Request; 