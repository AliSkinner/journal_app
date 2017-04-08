const mongoose = require('mongoose');

const Entry = mongoose.model('Entry', {
  _creator: {
    required: true,
    type: mongoose.Schema.Types.ObjectId
  },
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
