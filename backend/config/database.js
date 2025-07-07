const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, '../db.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Nuk u lidh me databazën:', err.message);
  } else {
    console.log('Lidhja me databazën SQLite u krye me sukses.');
  }
});

// Krijo tabelën e userave nëse nuk ekziston
const userTable = `CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  phone TEXT,
  userType TEXT,
  city TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
)`;

db.run(userTable, (err) => {
  if (err) {
    console.error('Gabim në krijimin e tabelës users:', err.message);
  }
});

// Krijo user default admin nëse nuk ekziston
db.get('SELECT * FROM users WHERE email = ?', ['admin@admin.com'], (err, row) => {
  if (!row) {
    bcrypt.hash('admin', 10, (err, hash) => {
      if (!err) {
        db.run(
          `INSERT INTO users (firstName, lastName, email, password, phone, userType, city) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          ['Admin', 'Admin', 'admin@admin.com', hash, '', 'admin', 'Tiranë']
        );
        console.log('Useri default admin u krijua: admin@admin.com / admin');
      }
    });
  }
});

// Krijo tabelën e kërkesave nëse nuk ekziston
const requestTable = `CREATE TABLE IF NOT EXISTS requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT,
  postalCode TEXT,
  desiredDate TEXT,
  budget TEXT,
  budgetType TEXT DEFAULT 'fixed',
  urgency TEXT DEFAULT 'normal',
  propertyType TEXT,
  propertySize TEXT,
  contactPreference TEXT DEFAULT 'phone',
  additionalRequirements TEXT,
  photos TEXT,
  status TEXT DEFAULT 'pending',
  views INTEGER DEFAULT 0,
  responses INTEGER DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
)`;

db.run(requestTable, (err) => {
  if (err) {
    console.error('Gabim në krijimin e tabelës requests:', err.message);
  }
});

module.exports = db; 