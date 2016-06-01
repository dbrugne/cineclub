const {
  should,
  beforeHelper,
  beforeEachHelper,
  afterHelper,
  tmdbMockup,
  fixtures,
} = require('../../lib/util/tests');

const opts = {
  api: tmdbMockup,
};

const Medias = require('../../lib/models/media');
const Cache = require('../../lib/models/cache');
const decorate = require('../../lib/decorate/index');

describe('decorate/index', () => {
  before(beforeHelper);
  beforeEach(beforeEachHelper);
  after(afterHelper);

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
          r.should.be.an('array').and.to.have.lengthOf(0);
          done();
        })
        .catch(done);
    });
    it('undefined', (done) => {
      decorate([], opts)
        .then(r => {
          r.should.be.an('array').and.to.have.lengthOf(0);
          done();
        })
        .catch(done);
    });
  });
  it('1 doc', (done) => {
    const doc = new Medias({
      path: fixtures.tmdb.alien.file,
      created: Date.now(),
    });
    doc.should.not.to.have.ownProperty('info');
    decorate([doc], opts)
      .then(r => {
        r.should.be.an('array').and.to.have.lengthOf(1);
        doc.should.have.property('isNew', false);
        doc.info.should.have.properties(fixtures.tmdb.alien.done);
        doc.should.equal(r[0]);
        done();
      })
      .catch(err => done(err));
  });
  it('n docs', (done) => {
    const docs = [
      new Medias({
        path: fixtures.tmdb.alien.file,
        created: Date.now(),
      }),
      new Medias({
        path: fixtures.tmdb.jfk.file,
        created: Date.now(),
      }),
    ];
    decorate(docs, opts)
      .then(r => {
        r.should.be.an('array').and.to.have.lengthOf(2);

        // doc 1
        docs[0].should.have.property('isNew', false);
        docs[0].info.should.have.properties(fixtures.tmdb.alien.done);
        docs[0].should.equal(r[0]);

        // doc 2
        docs[1].should.have.property('isNew', false);
        docs[1].info.should.have.properties(fixtures.tmdb.jfk.done);
        docs[1].should.equal(r[1]);

        done();
      })
      .catch(err => done(err));
  });
  it('unable to decorate', (done) => {
    const doc = new Medias({
      path: 'invalid.mkv',
      created: Date.now(),
    });
    decorate([doc], opts)
      .then(r => {
        r.should.be.an('array').and.to.have.lengthOf(1);
        doc.should.have.property('isNew', true);
        doc.should.not.have.ownProperty('info');
        r[0].should.equal(doc);
        done();
      })
      .catch(err => done(err));
  });
  describe('already decorated', () => {
    it('1 doc', (done) => {
      const doc = new Medias({
        path: fixtures.tmdb.alien.file,
        created: Date.now(),
        info: fixtures.tmdb.alien.done,
      });
      decorate([doc], opts)
        .then(r => {
          r.should.be.an('array').and.to.have.lengthOf(1);
          r[0].should.equal(doc);
          doc.should.have.property('isNew', true);
          done();
        })
        .catch(err => done(err));
    });
    it('n docs', (done) => {
      const docs = [
        new Medias({
          path: fixtures.tmdb.alien.file,
          created: Date.now(),
          info: fixtures.tmdb.alien.done,
        }),
        new Medias({
          path: fixtures.tmdb.jfk.file,
          created: Date.now(),
        }),
      ];
      decorate(docs, opts)
        .then(r => {
          r.should.be.an('array').and.to.have.lengthOf(2);

          // doc 1
          should.exist(docs[0]);
          docs[0].should.have.property('isNew', true);
          r[0].should.equal(docs[0]);

          // doc 2
          should.exist(docs[1]);
          docs[1].should.have.property('isNew', false);
          docs[1].should.have.property('info');
          r[1].should.equal(docs[1]);

          done();
        })
        .catch(err => done(err));
    });
  });
  it('sequential run', (done) => {
    const sameDocs = [
      new Medias({
        path: fixtures.tmdb.alien.file,
        created: Date.now(),
      }),
      new Medias({
        path: fixtures.tmdb.alien.file,
        created: Date.now(),
      }),
    ];
    decorate(sameDocs, opts)
      .then(r => {
        r.should.be.an('array');
        r.length.should.equal(2);
      })
      .then(() => Cache.where({}).count().exec())
      .then(count => {
        count.should.equal(1);
        done();
      })
      .catch(err => done(err));
  });
});
