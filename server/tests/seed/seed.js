const {ObjectID} = require('mongodb');
const {Entry} = require('./../../models/entry');
const {User} = require('./../../models/user');
const jwt = require('jsonwebtoken')

const entries =[{
  _id: new ObjectID(),
  text: 'first test entry',
}, {
  _id: new ObjectID(),
  text: 'second test entry',
  isPrivate: true,
  privatisedAt: 333
}]

const populateEntries = (done) => {
  Entry.remove({}).then(() => {
    return Entry.insertMany(entries);
  }).then(() => done());
};


const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users =[{
  _id: userOneId,
  email: 'test@test.com',
  password: 'testpassword',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
  }]
}, {
  _id: userTwoId,
  email: 'test2@test.com',
  password: 'testpassword2'
}]

const populateUsers = (done) => {
  User.remove({}).then(() => {
    let userOne = new User(users[0]).save()
    let userTwo = new User(users[1]).save()
    return Promise.all([userOne, userTwo])
  }).then(() => done());
};

module.exports = {entries, populateEntries, users, populateUsers}
