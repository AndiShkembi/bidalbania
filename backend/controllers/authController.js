const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'sekretshumefshehte';

exports.register = (req, res) => {
  console.log('Regjistrim i ri:', req.body);
  
  const { firstName, lastName, email, password, phone, userType, city } = req.body;
  
  // Validation
  if (!firstName || !lastName || !email || !password) {
    console.log('Fushat e detyrueshme mungojnë');
    return res.status(400).json({ message: 'Ju lutem plotësoni të gjitha fushat e detyrueshme!' });
  }

  if (password.length < 8) {
    console.log('Fjalëkalimi shumë i shkurtër');
    return res.status(400).json({ message: 'Fjalëkalimi duhet të ketë të paktën 8 karaktere!' });
  }

  // Check if user already exists
  User.findByEmail(email, (err, user) => {
    if (err) {
      console.error('Gabim në kërkimin e userit:', err);
      return res.status(500).json({ message: 'Gabim në server.' });
    }
    
    if (user) {
      console.log('Email ekziston:', email);
      return res.status(409).json({ message: 'Ky email ekziston tashmë!' });
    }

    // Hash password
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        console.error('Gabim në hashing:', err);
        return res.status(500).json({ message: 'Gabim në server.' });
      }

      // Create user
      const userData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase().trim(),
        password: hash,
        phone: phone ? phone.trim() : null,
        userType: userType || 'customer',
        city: city || null
      };

      console.log('Duke krijuar userin:', { ...userData, password: '[HIDDEN]' });

      User.create(userData, (err, newUser) => {
        if (err) {
          console.error('Gabim në krijimin e userit:', err);
          return res.status(500).json({ message: 'Gabim në regjistrim. Provoni përsëri.' });
        }

        console.log('User u krijua me sukses:', newUser.id);
        res.status(201).json({ 
          message: 'Regjistrimi u krye me sukses! Tani mund të identifikoheni.',
          userId: newUser.id
        });
      });
    });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Plotësoni email dhe fjalëkalim!' });
  }
  User.findByEmail(email, (err, user) => {
    if (err || !user) return res.status(401).json({ message: 'Email ose fjalëkalim i gabuar!' });
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err || !isMatch) return res.status(401).json({ message: 'Email ose fjalëkalim i gabuar!' });
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '2h' });
      res.json({
        message: 'Login i suksesshëm!',
        token,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          userType: user.userType,
          city: user.city
        }
      });
    });
  });
};

exports.profile = (req, res) => {
  const userId = req.user.id;
  User.findById(userId, (err, user) => {
    if (err || !user) return res.status(404).json({ message: 'User nuk u gjet!' });
    // Mos kthe password-in
    const { password, ...userData } = user;
    res.json(userData);
  });
}; 