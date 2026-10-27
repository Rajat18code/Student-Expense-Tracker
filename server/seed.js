// npm run seed        -> adds demo expenses (only once)
// npm run seed:clear  -> removes ONLY demo expenses (isSample: true)
require('dotenv').config();
const mongoose = require('mongoose');
const Expense = require('./models/Expense');

const items = [ // [title, amount, category, daysAgo, paymentMethod]
  ['Lunch', 120, 'Food', 0, 'UPI'], ['Bus fare', 40, 'Transportation', 1, 'Cash'],
  ['Notebook', 80, 'Education', 2, 'Cash'], ['Movie ticket', 250, 'Entertainment', 3, 'UPI'],
  ['Canteen snacks', 60, 'Food', 4, 'Cash'], ['Metro card recharge', 300, 'Transportation', 6, 'UPI'],
  ['Online course', 499, 'Education', 8, 'Card'], ['T-shirt', 699, 'Shopping', 10, 'Card'],
  ['Hostel rent', 3500, 'Accommodation', 12, 'Net Banking'], ['Dinner with friends', 450, 'Food', 15, 'UPI'],
  ['Printouts', 50, 'Education', 20, 'Cash'], ['Auto fare', 90, 'Transportation', 27, 'Cash'],
  ['Headphones', 899, 'Shopping', 33, 'UPI'], ['Breakfast', 70, 'Food', 38, 'Cash']
];

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  if (process.argv.includes('--clear')) {
    const r = await Expense.deleteMany({ isSample: true });
    console.log(`Removed ${r.deletedCount} sample expenses.`);
  } else if (await Expense.exists({ isSample: true })) {
    console.log('Sample data already exists. Run "npm run seed:clear" first to reset it.');
  } else {
    const t = new Date();
    const docs = items.map(([title, amount, category, ago, paymentMethod]) => ({
      title, amount, category, paymentMethod, isSample: true,
      date: new Date(Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate() - ago))
    }));
    await Expense.insertMany(docs);
    console.log(`Inserted ${docs.length} sample expenses.`);
  }
  await mongoose.disconnect();
})().catch((e) => { console.error(e.message); process.exit(1); });
