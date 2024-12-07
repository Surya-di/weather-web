const mongoose = require('mongoose');

const searchSchema = new mongoose.Schema({
  city: String,
  temperature: Number,
  description: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Search', searchSchema);
