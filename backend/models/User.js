const db = require('../config/database');

const User = {
  create: (user, callback) => {
    const { firstName, lastName, email, password, phone, userType, city } = user;
    const sql = `INSERT INTO users (firstName, lastName, email, password, phone, userType, city) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    
    console.log('Duke ekzekutuar SQL:', sql);
    console.log('Vlerat:', [firstName, lastName, email, '[HIDDEN]', phone, userType, city]);
    
    db.run(sql, [firstName, lastName, email, password, phone, userType, city], function(err) {
      if (err) {
        console.error('Gabim në INSERT:', err);
        return callback(err);
      }
      console.log('User u shtua me ID:', this.lastID);
      callback(null, { id: this.lastID, ...user });
    });
  },

  findByEmail: (email, callback) => {
    console.log('Duke kërkuar email:', email);
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
      if (err) {
        console.error('Gabim në kërkimin e email:', err);
        return callback(err);
      }
      console.log('Rezultati i kërkimit:', row ? 'U gjet' : 'Nuk u gjet');
      callback(null, row);
    });
  },

  findById: (id, callback) => {
    console.log('Duke kërkuar user me ID:', id);
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
      if (err) {
        console.error('Gabim në kërkimin e ID:', err);
        return callback(err);
      }
      callback(null, row);
    });
  }
};

module.exports = User; 