const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Entry} = require('./../models/entry');

const entries =[{
  text: 'first test entry'
}, {
  text: 'second test entry'
}]

beforeEach((done) => {
  Entry.remove({}).then(() => {
    return Entry.insertMany(entries);
  }).then(() => done());
});

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
