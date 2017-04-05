const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Entry} = require('./models/entry');
const {User} = require('./models/user');

const app = express()
const port = process.env.PORT || 3000;

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
  let body = _.pick(req.body, ['text', 'private']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if(_.isBoolean(body.private) && body.private) {
    body.privatisedAt = new Date().getTime();
  } else {
    body.private = false;
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


app.listen(port, () => {
  console.log(`listening on ${port}`);
});

module.exports = {app};
