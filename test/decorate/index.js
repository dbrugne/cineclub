const {
  should,
  beforeHelper,
  beforeEachHelper,
  afterHelper,
  tmdbStub,
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
  it('api required', done => {
    decorate([]).then(() => done(new Error('not rejected'))).catch(() => done());
  });
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
      path: fixtures.torrent.alien.file,
      created: Date.now(),
    });
    doc.should.not.to.have.ownProperty('info');
    decorate([doc], opts)
      .then(r => {
        r.should.be.an('array').and.to.have.lengthOf(1);
        doc.should.equal(r[0]);
        doc.should.have.property('isNew', false);
        doc.should.have.property('decoration', 'decorated');
        doc.torrent.should.have.properties(fixtures.torrent.alien.result);
        doc.info.should.have.properties(fixtures.tmdb.get.movie[0]);
        done();
      })
      .catch(done);
  });
  it('n docs', done => {
    const docs = [
      new Medias({
        path: fixtures.torrent.alien.file,
        created: Date.now(),
      }),
      new Medias({
        path: fixtures.torrent['mad men'].file,
        created: Date.now(),
      }),
    ];
    decorate(docs, opts)
      .then(r => {
        r.should.be.an('array').and.to.have.lengthOf(2);

        // doc 1
        docs[0].should.equal(r[0]);
        docs[0].should.have.property('isNew', false);
        docs[0].should.have.property('decoration', 'decorated');
        docs[0].torrent.should.have.properties(fixtures.torrent.alien.result);
        docs[0].info.should.have.properties(fixtures.tmdb.get.movie[0]);

        // doc 2
        docs[1].should.equal(r[1]);
        docs[1].should.have.property('isNew', false);
        docs[1].should.have.property('decoration', 'decorated');
        docs[1].info.should.have.properties(fixtures.tmdb.get.tv[0]);

        done();
      })
      .catch(done);
  });
  describe('failed', () => {
    it('not found', done => {
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
    it('invalid media_type', done => {
      const doc = new Medias({
        path: fixtures.tmdb.search.multi.unknowncategory.file,
        decoration: 'undecorated',
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
  });
  describe('already decorated', () => {
    it('1 doc', done => {
      const doc = new Medias({
        path: fixtures.tmdb.search.movie.alien.file,
        created: Date.now(),
        decoration: 'decorated',
        info: fixtures.tmdb.search.movie.alien.done,
      });
      decorate([doc], opts)
        .then(r => {
          r.should.be.an('array').and.to.have.lengthOf(1);
          r[0].should.equal(doc);
          doc.should.have.property('isNew', false);
          doc.should.have.property('torrent');
          doc.should.have.property('decoration', 'decorated');
          done();
        })
        .catch(done);
    });
    it('n docs', done => {
      const docs = [
        new Medias({
          path: fixtures.torrent.alien.file,
          created: Date.now(),
          decoration: 'decorated',
          info: fixtures.tmdb.search.movie.alien.done,
        }),
        new Medias({
          path: fixtures.tmdb.search.multi.jfk.file,
          decoration: 'undecorated',
          created: Date.now(),
          file: {
            name: 'JFK',
          },
        }),
      ];
      decorate(docs, opts)
        .then(r => {
          r.should.be.an('array').and.to.have.lengthOf(2);

          // doc 1
          should.exist(docs[0]);
          docs[0].should.have.property('isNew', false);
          docs[0].should.have.property('torrent');
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
        path: fixtures.torrent.alien.file,
        created: Date.now(),
      }),
      new Medias({
        path: fixtures.torrent.alien.file,
        created: Date.now(),
      }),
      new Medias({
        path: fixtures.torrent['mad men'].file,
        created: Date.now(),
      }),
    ];
    decorate(docs, opts)
      .then(r => {
        r.should.be.an('array').that.has.lengthOf(3);
        r[0].info.should.not.have.property('from_cache');
        r[1].info.should.not.have.property('from_cache');
        r[2].info.should.not.have.property('from_cache');
      })
      .then(done)
      .catch(done);
  });
  it('sequential run', done => {
    const sameDocs = [
      new Medias({
        path: fixtures.torrent.alien.file,
        created: Date.now(),
      }),
      new Medias({
        path: fixtures.torrent.alien.file,
        created: Date.now(),
      }),
    ];
    decorate(sameDocs, opts)
      .then(r => {
        r.should.be.an('array').with.lengthOf(2);
      })
      .then(() => Cache.where({}).count().exec())
      .then(count => {
        count.should.equal(2); // search + fetch
        done();
      })
      .catch(done);
  });
  it('ratelimit', done => {
    tmdbStub.setLimit(5);
    const docs = [
      new Medias({ path: fixtures.torrent.alien.file }),
      new Medias({ path: fixtures.torrent['mad men'].file }),
      new Medias({ path: fixtures.tmdb.search.multi.jfk.file, file: { name: 'JFK' } }),
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
