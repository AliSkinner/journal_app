require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Entry} = require('./models/entry');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');
const bcrypt = require('bcryptjs');

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/entries', (req, res) => {
  let entry = new Entry({
    text: req.body.text
  })

  entry.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/entries', (req, res) => {
  Entry.find().then((entries) => {
    res.send({entries});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/entries/:id', (req, res) => {
  let id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Entry.findById(id).then((entry) =>{
    if (!entry) {
      return res.status(404).send();
    }
    res.status(200).send(entry);
  }).catch((e) => res.send(400));
});

app.delete('/entries/:id', (req, res) => {
  let id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Entry.findByIdAndRemove(id).then((entry) => {
    if(!entry) {
      return res.status(404).send();
    }

    res.status(200).send({entry});
  }).catch((e) => res.status(400).send());

});

app.patch('/entries/:id', (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ['text', 'isPrivate']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if(_.isBoolean(body.isPrivate) && body.isPrivate) {
    body.privatisedAt = new Date().getTime();
  } else {
    body.isPrivate = false;
    body.privatisedAt = null;
  }

  Entry.findByIdAndUpdate(id, {$set: body}, {new: true}).then((entry) => {
    if (!entry) {
      return res.status(404).send();
    }

    res.send({entry})

  }).catch((e) => {
    res.status(400).send();
  })
});

app.post('/users', (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);
  let user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken()
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((err) => {
    res.status(400).send(err);
  });
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.post('/users/login', (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((err) => {
    console.log(err)
    res.status(400).send();
  });

})

app.listen(port, () => {
  console.log(`listening on ${port}`);
});

module.exports = {app};
