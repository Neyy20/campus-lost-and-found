const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide an item title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide an item description'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Please specify type: LOST or FOUND'],
    enum: ['LOST', 'FOUND']
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: [
      'ID Card',
      'Wallet',
      'Bottle',
      'Bag',
      'Books/Notebook',
      'Keys',
      'Electronics',
      'Other'
    ]
  },
  location: {
    type: String,
    required: [true, 'Please specify campus location'],
    enum: [
      'Library',
      'Canteen',
      'Classroom',
      'Parking',
      'Ground',
      'Hostel',
      'Other'
    ]
  },
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'RESOLVED'],
    default: 'ACTIVE'
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Item', ItemSchema);
