const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const requestRoutes = require('./routes/request');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 7700;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);

app.get('/', (req, res) => {
  res.send('API e BidAlbania është aktive!');
});

app.listen(PORT, () => {
  console.log(`Serveri po dëgjon në portën ${PORT}`);
}); 