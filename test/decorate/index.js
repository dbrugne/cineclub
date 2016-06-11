const {
  should,
  beforeHelper,
  beforeEachHelper,
  afterHelper,
  tmdbStub,
  tmdbStubSetLimit,
  fixtures,
} = require('../../lib/util/tests');

const opts = {
  api: tmdbStub,
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
    it('array', done => {
      decorate([], opts)
        .then(r => {
          r.should.be.an('array').and.to.have.lengthOf(0);
          done();
        })
        .catch(done);
    });
    it('undefined', done => {
      decorate(undefined, opts)
        .then(r => {
          should.not.exist(r);
          done();
        })
        .catch(done);
    });
  });
  it('1 doc', done => {
    const doc = new Medias({
      path: fixtures.tmdb.alien.file,
      created: Date.now(),
    });
    doc.should.not.to.have.ownProperty('info');
    decorate([doc], opts)
      .then(r => {
        r.should.be.an('array').and.to.have.lengthOf(1);
        doc.should.have.property('isNew', false);
        doc.should.have.property('decoration', 'decorated');
        doc.info.should.have.properties(fixtures.tmdb.alien.done);
        doc.should.equal(r[0]);
        done();
      })
      .catch(done);
  });
  it('n docs', done => {
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
        docs[0].should.have.property('decoration', 'decorated');
        docs[0].info.should.have.properties(fixtures.tmdb.alien.done);
        docs[0].should.equal(r[0]);

        // doc 2
        docs[1].should.have.property('isNew', false);
        docs[1].should.have.property('decoration', 'decorated');
        docs[1].info.should.have.properties(fixtures.tmdb.jfk.done);
        docs[1].should.equal(r[1]);

        done();
      })
      .catch(done);
  });
  describe('failed', () => {
    it('with no info', done => {
      const doc = new Medias({
        path: 'invalid.mkv',
        created: Date.now(),
      });
      decorate([doc], opts)
        .then(r => {
          r.should.be.an('array').and.to.have.lengthOf(1);
          doc.should.have.property('isNew', false);
          doc.should.have.property('decoration', 'failed');
          doc.should.have.property('info', undefined);
          r[0].should.equal(doc);
          done();
        })
        .catch(done);
    });
    it('with info', done => {
      const doc = new Medias({
        path: fixtures.tmdb.unknowncategory.file,
        decoration: 'undecorated',
        created: Date.now(),
      });
      decorate([doc], opts)
        .then(r => {
          r.should.be.an('array').and.to.have.lengthOf(1);
          doc.should.have.property('isNew', false);
          doc.should.have.property('decoration', 'failed');
          doc.should.have.property('info').that.have.properties(fixtures.tmdb.unknowncategory.done);
          r[0].should.equal(doc);
          done();
        })
        .catch(done);
    });
  });
  describe('already decorated', () => {
    it('1 doc', done => {
      const doc = new Medias({
        path: fixtures.tmdb.alien.file,
        created: Date.now(),
        decoration: 'decorated',
        info: fixtures.tmdb.alien.done,
      });
      decorate([doc], opts)
        .then(r => {
          r.should.be.an('array').and.to.have.lengthOf(1);
          r[0].should.equal(doc);
          doc.should.have.property('isNew', true);
          doc.should.have.property('decoration', 'decorated');
          done();
        })
        .catch(done);
    });
    it('n docs', done => {
      const docs = [
        new Medias({
          path: fixtures.tmdb.alien.file,
          created: Date.now(),
          decoration: 'decorated',
          info: fixtures.tmdb.alien.done,
        }),
        new Medias({
          path: fixtures.tmdb.jfk.file,
          decoration: 'undecorated',
          created: Date.now(),
        }),
      ];
      decorate(docs, opts)
        .then(r => {
          r.should.be.an('array').and.to.have.lengthOf(2);

          // doc 1
          should.exist(docs[0]);
          docs[0].should.have.property('isNew', true);
          docs[0].should.have.property('decoration', 'decorated');
          r[0].should.equal(docs[0]);

          // doc 2
          should.exist(docs[1]);
          docs[1].should.have.property('isNew', false);
          docs[1].should.have.property('decoration', 'decorated');
          docs[1].should.have.property('info');
          r[1].should.equal(docs[1]);

          done();
        })
        .catch(done);
    });
  });
  it('filter keys', done => {
    const docs = [
      new Medias({
        path: fixtures.tmdb.alien.file,
        created: Date.now(),
      }),
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
        r.should.be.an('array').that.has.lengthOf(3);
        r[0].info.should.not.have.property('ratelimit');
        r[0].info.should.not.have.property('from_cache');
        r[1].info.should.not.have.property('ratelimit');
        r[1].info.should.not.have.property('from_cache');
        r[2].info.should.not.have.property('ratelimit');
        r[2].info.should.not.have.property('from_cache');
      })
      .then(done)
      .catch(done);
  });
  it('sequential run', done => {
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
      .catch(done);
  });
  it('ratelimit', done => {
    tmdbStubSetLimit(2);
    const docs = [
      new Medias({ path: fixtures.tmdb.alien.file }),
      new Medias({ path: fixtures.tmdb['mad men'].file }),
      new Medias({ path: fixtures.tmdb.jfk.file }),
    ];
    decorate(docs, { api: tmdbStub })
      .then(r => {
        r[0].decoration.should.equal('decorated');
        r[1].decoration.should.equal('decorated');
        r[2].decoration.should.equal('undecorated');
      })
      .then(done)
      .catch(done);
  });
});
