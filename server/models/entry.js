const mongoose = require('mongoose');

const Entry = mongoose.model('Entry', {
  text: {
    type: String,
    required: true,
    minLength: 1,
    trim: true
  },
  private: {
    type: Boolean,
    default: false
  },
  privatisedAt: {
    type: Number,
    default: null
  }
});

// let newEntry = new Entry ({
//   text: 'went for run.'
// });
// newEntry.save().then((doc) => {
//   console.log('Saved Entry', doc);
// }, (e) => {
//   console.log('error', e);
// });
//
// let otherEntry = new Entry({
//   text: '  hi    ',
//   // private: true,
//   // privatisedAt: 123
// });
//
// otherEntry.save().then((doc) => {
//   console.log(JSON.stringify(doc, undefined, 2));
// }, (e) => {
//   console.log(e);
// });

module.exports = {Entry}
