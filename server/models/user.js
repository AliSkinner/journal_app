const mongoose = require('mongoose');

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

module.exports = {User}
