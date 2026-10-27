const mongoose = require('mongoose');

// Rejects malformed MongoDB ids with 400 instead of crashing
exports.validateId = (req, res, next, id) => {
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid expense id' });
  next();
};

// Lets async route functions send errors to the error handler
exports.wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);

exports.errorHandler = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: Object.values(err.errors).map((e) => e.message).join(', ') });
  }
  if (err.name === 'CastError') return res.status(400).json({ message: `Invalid value for ${err.path}` });
  console.error(err);
  res.status(500).json({ message: 'Something went wrong on the server' });
};
