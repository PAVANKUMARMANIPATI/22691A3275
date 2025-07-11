const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
});
clicks: [
  {
    timestamp: { type: Date, default: Date.now },
    ip: String,
    referrer: String
  }
]


module.exports = mongoose.model('Url', urlSchema);
