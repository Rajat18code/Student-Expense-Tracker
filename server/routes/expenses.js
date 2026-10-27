const router = require('express').Router();
const Expense = require('../models/Expense');
const { validateId, wrap } = require('../middleware/handlers');

router.param('id', validateId);

// Only these fields can be set by the client
const pick = (b) => ({ title: b.title, amount: b.amount, category: b.category, date: b.date, paymentMethod: b.paymentMethod, description: b.description });

// GET /api/expenses?search=&category=&from=&to=&sort=date|amount&order=asc|desc&page=1&limit=10
router.get('/', wrap(async (req, res) => {
  const { search, category, from, to, sort = 'date', order = 'desc', page = 1, limit = 10 } = req.query;
  const q = {};
  if (search) q.title = { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
  if (category) q.category = category;
  if (from || to) {
    q.date = {};
    if (from) q.date.$gte = new Date(from);
    if (to) q.date.$lte = new Date(to + 'T23:59:59.999Z');
  }
  const p = Math.max(Number(page) || 1, 1);
  const l = Math.min(Math.max(Number(limit) || 10, 1), 100);
  const sortField = sort === 'amount' ? 'amount' : 'date';
  const [data, total] = await Promise.all([
    Expense.find(q).sort({ [sortField]: order === 'asc' ? 1 : -1, _id: -1 }).skip((p - 1) * l).limit(l),
    Expense.countDocuments(q)
  ]);
  res.json({ data, total, page: p, pages: Math.ceil(total / l) });
}));

// GET /api/expenses/stats?year=&month=  -> totals used by dashboard and analytics
router.get('/stats', wrap(async (req, res) => {
  const now = new Date();
  const year = Number(req.query.year) || now.getFullYear();
  const month = Number(req.query.month) || now.getMonth() + 1;
  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(year, month, 1));
  const inMonth = { $match: { date: { $gte: start, $lt: end } } };
  const [totals, cats, months] = await Promise.all([
    Expense.aggregate([inMonth, { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }]),
    Expense.aggregate([inMonth, { $group: { _id: '$category', total: { $sum: '$amount' } } }, { $sort: { total: -1 } }]),
    Expense.aggregate([
      { $match: { date: { $gte: new Date(Date.UTC(year, 0, 1)), $lt: new Date(Date.UTC(year + 1, 0, 1)) } } },
      { $group: { _id: { $month: '$date' }, total: { $sum: '$amount' } } }
    ])
  ]);
  const total = totals[0]?.total || 0;
  const count = totals[0]?.count || 0;
  const isCurrent = year === now.getFullYear() && month === now.getMonth() + 1;
  const days = isCurrent ? now.getDate() : new Date(year, month, 0).getDate();
  res.json({
    year, month, total, count,
    avgDaily: total / days,
    topCategory: cats[0] ? { category: cats[0]._id, total: cats[0].total } : null,
    byCategory: cats.map((c) => ({ category: c._id, total: c.total })),
    byMonth: Array.from({ length: 12 }, (_, i) => ({ month: i + 1, total: months.find((m) => m._id === i + 1)?.total || 0 }))
  });
}));

router.get('/:id', wrap(async (req, res) => {
  const expense = await Expense.findById(req.params.id);
  if (!expense) return res.status(404).json({ message: 'Expense not found' });
  res.json(expense);
}));

router.post('/', wrap(async (req, res) => {
  const expense = await Expense.create(pick(req.body));
  res.status(201).json(expense);
}));

router.put('/:id', wrap(async (req, res) => {
  const expense = await Expense.findById(req.params.id);
  if (!expense) return res.status(404).json({ message: 'Expense not found' });
  expense.set(pick(req.body));
  await expense.save(); // runs the schema validation
  res.json(expense);
}));

router.delete('/:id', wrap(async (req, res) => {
  const expense = await Expense.findByIdAndDelete(req.params.id);
  if (!expense) return res.status(404).json({ message: 'Expense not found' });
  res.json({ message: 'Expense deleted' });
}));

module.exports = router;
