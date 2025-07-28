const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const requestRoutes = require('./routes/request');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 7700;

app.use(cors({
  origin: [
    'http://localhost:8085', 
    'http://localhost:8080', 
    'http://127.0.0.1:8085', 
    'http://127.0.0.1:8080',
    'http://192.168.1.237:8080',
    'http://192.168.1.237:8085',
    'http://192.168.1.237:7700',
    'http://localhost:7700',
    'http://161.35.211.94:8080',
    'http://161.35.211.94:8085',
    'http://161.35.211.94:7700',
    'https://161.35.211.94:8080',
    'https://161.35.211.94:8085',
    'https://161.35.211.94:7700',
    'https://bidalbania.al',
    'https://www.bidalbania.al',
    'http://bidalbania.al',
    'http://www.bidalbania.al',
    'http://bidalbania.al:7700',
    'http://www.bidalbania.al:7700',
    'http://bidalbania.al:8085',
    'http://www.bidalbania.al:8085'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept']
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