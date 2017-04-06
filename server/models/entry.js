const mongoose = require('mongoose');

const Entry = mongoose.model('Entry', {
  text: {
    type: String,
    required: true,
    minLength: 1,
    trim: true
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  privatisedAt: {
    type: Number,
    default: null
  }
});

module.exports = {Entry};
