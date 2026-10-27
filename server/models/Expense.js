const mongoose = require('mongoose');

const CATEGORIES = ['Food', 'Transportation', 'Education', 'Shopping', 'Entertainment', 'Accommodation', 'Other'];
const METHODS = ['Cash', 'UPI', 'Card', 'Net Banking'];

const expenseSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: 100 },
  amount: { type: Number, required: [true, 'Amount is required'], min: [0.01, 'Amount must be greater than zero'] },
  category: { type: String, required: [true, 'Category is required'], enum: { values: CATEGORIES, message: 'Invalid category' } },
  date: { type: Date, required: [true, 'Date is required'] },
  paymentMethod: { type: String, required: [true, 'Payment method is required'], enum: { values: METHODS, message: 'Invalid payment method' } },
  description: { type: String, trim: true, maxlength: 300, default: '' },
  isSample: { type: Boolean, default: false }   // true only for demo data created by seed.js
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
