const Request = require('../models/Request');

exports.createRequest = (req, res) => {
  const userId = req.user.id;
  const { title, description, category, city, address, desiredDate, budget } = req.body;
  if (!title || !description || !category || !city) {
    return res.status(400).json({ message: 'Ju lutem plotësoni të gjitha fushat e detyrueshme!' });
  }
  Request.create({ userId, title, description, category, city, address, desiredDate, budget }, (err, request) => {
    if (err) return res.status(500).json({ message: 'Gabim në ruajtjen e kërkesës.' });
    res.status(201).json({ message: 'Kërkesa u postua me sukses!', request });
  });
};

exports.getUserRequests = (req, res) => {
  const userId = req.user.id;
  Request.findByUserId(userId, (err, requests) => {
    if (err) return res.status(500).json({ message: 'Gabim në marrjen e kërkesave.' });
    res.json(requests);
  });
}; 