const router = require('express').Router();
const Budget = require('../models/Budget');
const { wrap } = require('../middleware/handlers');

const parse = (year, month) => {
  const y = Number(year), m = Number(month);
  return Number.isInteger(y) && y > 2000 && Number.isInteger(m) && m >= 1 && m <= 12 ? { y, m } : null;
};

// GET /api/budget?year=2026&month=10
router.get('/', wrap(async (req, res) => {
  const p = parse(req.query.year, req.query.month);
  if (!p) return res.status(400).json({ message: 'Valid year and month are required' });
  const budget = await Budget.findOne({ year: p.y, month: p.m });
  res.json({ year: p.y, month: p.m, amount: budget ? budget.amount : 0 });
}));

// PUT /api/budget  body: { year, month, amount }  (creates or updates)
router.put('/', wrap(async (req, res) => {
  const p = parse(req.body.year, req.body.month);
  if (!p) return res.status(400).json({ message: 'Valid year and month are required' });
  const budget = await Budget.findOneAndUpdate(
    { year: p.y, month: p.m }, { amount: req.body.amount },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
  );
  res.json({ year: budget.year, month: budget.month, amount: budget.amount });
}));

module.exports = router;
