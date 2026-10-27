const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  year: { type: Number, required: true },
  month: { type: Number, required: true, min: 1, max: 12 },
  amount: { type: Number, required: [true, 'Budget amount is required'], min: [1, 'Budget must be greater than zero'] }
});
budgetSchema.index({ year: 1, month: 1 }, { unique: true }); // one budget per month

module.exports = mongoose.model('Budget', budgetSchema);
