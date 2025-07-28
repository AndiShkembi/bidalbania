const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const requestRoutes = require('./routes/request');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 7700;

app.use(cors({
  origin: ['http://localhost:8085', 'http://localhost:8080', 'http://127.0.0.1:8085', 'http://127.0.0.1:8080'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);

app.get('/', (req, res) => {
  res.send('API e BidAlbania është aktive!');
});

app.listen(PORT, () => {
  console.log(`Serveri po dëgjon në portën ${PORT}`);
}); 