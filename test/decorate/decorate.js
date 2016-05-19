const should = require('chai').should();

const util = require('../../lib/util/tests');
const fixtures = require('../fixtures/data.json');
const opts = {
  api: util.tmdbMockup(fixtures.tmdb),
};

const Media = require('../../lib/models/media');
const decorate = require('../../lib/decorate/index');

describe('decorate/index', () => {
  before(util.before);
  beforeEach(util.beforeEach);
  after(util.after);

  it('is function', () => {
    decorate.should.be.a('function');
  });
  it('returns promise', () => {
    decorate([]).should.be.a('promise');
  });
  it('api required', () => decorate([]).should.be.rejected);
  describe('empty', () => {
    it('array', (done) => {
      decorate([], opts)
        .then(r => {
          r.should.deep.equal([]);
          done();
        })
        .catch(err => done(new Error(err)));
    });
    it('undefined', (done) => {
      decorate([], opts)
        .then(r => {
          r.should.deep.equal([]);
          done();
        })
        .catch(err => done(new Error(err)));
    });
  });
  it('1 doc', (done) => {
    const doc = new Media({
      path: fixtures.tmdb.alien.file,
      created: Date.now(),
    });
    should.not.exist(doc.info);
    decorate([doc], opts)
      .then(r => {
        r.should.be.an('array');
        r.length.should.equal(1);
        doc.isNew.should.be.false;
        should.exist(doc.info);
        const info = doc.info;
        info.should.deep.equal(fixtures.tmdb.alien.result.results[0]);
        (r[0] === doc).should.true; // same object
        done();
      })
      .catch(err => done(err));
  });
  it('n docs', (done) => {
    const docs = [
      new Media({
        path: fixtures.tmdb.alien.file,
        created: Date.now(),
      }),
      new Media({
        path: fixtures.tmdb.jfk.file,
        created: Date.now(),
      }),
    ];
    decorate(docs, opts)
      .then(r => {
        r.should.be.an('array');
        r.length.should.equal(2);

        // doc 1
        should.exist(docs[0]);
        docs[0].isNew.should.be.false;
        docs[0].info.should.deep.equal(fixtures.tmdb.alien.result.results[0]);
        (r[0] === docs[0]).should.true; // same object

        // doc 2
        should.exist(docs[1]);
        docs[1].isNew.should.be.false;
        docs[1].info.should.deep.equal(fixtures.tmdb.jfk.result.results[0]);
        (r[1] === docs[1]).should.true; // same object

        done();
      })
      .catch(err => done(err));
  });
  it('unable to decorate', (done) => {
    const doc = new Media({
      path: 'invalid.mkv',
      created: Date.now(),
    });
    decorate([doc], opts)
      .then(r => {
        r.should.be.an('array');
        r.length.should.equal(1);
        doc.isNew.should.be.true;
        should.not.exist(doc.info);
        (r[0] === doc).should.true; // same object
        done();
      })
      .catch(err => done(err));
  });
  describe('already decorated', () => {
    it('1 doc', (done) => {
      const doc = new Media({
        path: fixtures.tmdb.alien.file,
        created: Date.now(),
        info: fixtures.tmdb.alien.result.results[0],
      });
      decorate([doc], opts)
        .then(r => {
          r.should.be.an('array');
          r.length.should.equal(1);
          (r[0] === doc).should.true; // same object
          doc.isNew.should.be.true;
          done();
        })
        .catch(err => done(err));
    });
    it('n docs', (done) => {
      const docs = [
        new Media({
          path: fixtures.tmdb.alien.file,
          created: Date.now(),
          info: fixtures.tmdb.alien.result.results[0],
        }),
        new Media({
          path: fixtures.tmdb.jfk.file,
          created: Date.now(),
        }),
      ];
      decorate(docs, opts)
        .then(r => {
          r.should.be.an('array');
          r.length.should.equal(2);

          // doc 1
          should.exist(docs[0]);
          docs[0].isNew.should.be.true;
          (r[0] === docs[0]).should.true; // same object

          // doc 2
          should.exist(docs[1]);
          docs[1].isNew.should.be.false;
          should.exist(docs[1].info);
          (r[1] === docs[1]).should.true; // same object

          done();
        })
        .catch(err => done(err));
    });
  });
});
