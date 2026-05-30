const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  colorHex: { type: String, default: '#4f46e5' }, // Tailwind indigo fallback
  iconName: { type: String, default: 'FiShoppingBag' }, // Heroicon name reference
});

module.exports = mongoose.model('Category', categorySchema);
