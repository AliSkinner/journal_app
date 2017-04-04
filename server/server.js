const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/JournalApp');

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
  archivedAt: {
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
//   // archivedAt: 123
// });
//
// otherEntry.save().then((doc) => {
//   console.log(JSON.stringify(doc, undefined, 2));
// }, (e) => {
//   console.log(e);
// });

const User = mongoose.model('User', {
  name: {
    type: String,
    required: true,
    trim: true,
    minLength: 1
  },
  email: {
    type: String,
    required: true,
    trim: true,
    minLength: 1
  }
})

// let newUser = new User({
//   name: 'Ali',
//   email: 'test@test.com'
// })
//
// newUser.save().then((doc) => {
//     console.log(JSON.stringify(doc, undefined, 2));
// }, (err) => {
//   console.log(err);
// })
