const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {Entry} = require('./models/entry');
const {User} = require('./models/user');

const app = express()

app.use(bodyParser.json());

app.post('/entries', (req, res) => {

  console.log(req.body);

  let entry = new Entry({
    text: req.body.text
  })

  entry.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  })
});

app.listen(3000, () => {
  console.log('listening on 3000');
});
