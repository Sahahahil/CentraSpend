const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  preferredCurrency: { type: String, default: 'USD' },
});

module.exports = mongoose.model('User', userSchema);
