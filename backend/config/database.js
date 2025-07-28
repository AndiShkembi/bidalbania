const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, '../db.sqlite');
const db = new Database(dbPath);

console.log('Lidhja me databazën SQLite u krye me sukses.');

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

db.exec(userTable);

// Krijo user default admin nëse nuk ekziston
const adminExists = db.prepare('SELECT * FROM users WHERE email = ?').get(['admin@admin.com']);
if (!adminExists) {
  bcrypt.hash('admin', 10, (err, hash) => {
    if (!err) {
      db.prepare(
        `INSERT INTO users (firstName, lastName, email, password, phone, userType, city) VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).run(['Admin', 'Admin', 'admin@admin.com', hash, '', 'admin', 'Tiranë']);
      console.log('Useri default admin u krijua: admin@admin.com / admin');
    }
  });
}

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

db.exec(requestTable);

module.exports = db; 