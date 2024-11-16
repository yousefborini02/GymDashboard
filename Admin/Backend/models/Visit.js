const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gymSectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GymSection',
    required: true
  },
  visitDateTime: {
    type: Date,
    default: Date.now
  }
});

// Add an index to improve query performance
visitSchema.index({ gymSectionId: 1, visitDateTime: -1 });

module.exports = mongoose.model('Visit', visitSchema);