const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Entry} = require('./../models/entry');
const {User} = require('./../models/user');

const {entries, populateEntries, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateEntries);

describe('POST /entries', () => {
  it('should create a new entry',  (done) => {
      let text = 'Some test text for an Entry';

      request(app)
        .post('/entries')
        .send({text})
        .expect(200)
        .expect((res) => {
          expect(res.body.text).toBe(text)
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          Entry.find({text}).then((entries) => {
            expect(entries.length).toBe(1);
            expect(entries[0].text).toBe(text);
            done();
          }).catch((e) => done(e));

        })
  });

  it('should not create Entry with invalid body data', (done) => {

    request(app)
      .post('/entries')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Entry.find().then((entries) => {
          expect(entries.length).toBe(2);
          done()
        }).catch((e) => done(e));

      });
  });
});

describe('GET /entries', () => {
  it('should get all entries', (done) => {
      request(app)
        .get('/entries')
        .expect(200)
        .expect((res) => {
          expect(res.body.entries.length).toBe(2)
        })
        .end(done);
  });
});


describe('GET /entries/:id', () => {

  it('should return entry doc', (done) => {
    request(app)
      .get(`/entries/${entries[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(entries[0].text)
      })
      .end(done);
  });

  it('should return a 404', (done) => {
    request(app)
      .get(`/entries/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .get('/entries/123')
      .expect(404)
      .end(done);
  });
});

describe('DELETE /entries/:id', () => {

  it('should remove an entry', (done) => {
    let id = entries[1]._id.toHexString();
    request(app)
      .delete(`/entries/${id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.entry._id).toBe(id)
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Entry.findById(id).then((entry) => {
          expect(entry).toNotExist();
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return a 404 if entry not found', (done) => {
    let id = new ObjectID().toHexString();
    request(app)
      .delete(`/entries/${id}`)
      .expect(404)
      .end(done);
  });

  it('should remove return 404 if entry id is invalid', (done) => {
    let id = 'abc';

    request(app)
      .delete(`/entries/${id}`)
      .expect(404)
      .end(done);
  });
});


describe('PATCH /entries/:id', () => {

  it('should update the entry', (done) => {
    let id = entries[0]._id.toHexString();
    let text = 'some new text';
    let isPrivate = true;

    request(app)
      .patch(`/entries/${id}`)
      .send({text, isPrivate})
      .expect(200)
      .expect((res) => {
        expect(res.body.entry.text).toBe(text);
        expect(res.body.entry.isPrivate).toBe(true);
        expect(res.body.entry.privatisedAt).toBeA('number');
      }).end(done);

  });

  it('should clear privatisedAt when not isPrivate', (done) => {
    let id = entries[1]._id.toHexString();
    let isPrivate = false;

    request(app)
      .patch(`/entries/${id}`)
      .send({isPrivate})
      .expect(200)
      .expect((res) => {
        expect(res.body.entry.isPrivate).toBe(false);
        expect(res.body.entry.privatisedAt).toBe(null);
      }).end(done);
  });
});

describe('GET /users/me', () => {
  it('should return a user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email)
      })
      .end(done);
  });

  it('should return a 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /users', () => {
  it('should create a user', (done) => {
    let email = 'test3@test.com';
    let password = 'testpassword123';

    request(app)
      .post('/users/')
      .send({email, password})
      .expect(200)
      .expect((res) => {
          expect(res.headers['x-auth']).toExist();
          expect(res.body._id).toExist();
          expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }
        User.findOne({email}).then((user) => {
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        });
      });
  });

  it('should return validation errors if request invalid', (done) => {
    let email = 'blah';
    let password = 'testpassword123';
    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end((err) => {
        if (err) {
          return done(err);
        }
        done();
      });
  });

  it('should not create user if email in use', (done) => {
    let email = users[0].email
    let password = 'somepassword'
    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);
  });
});
