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

const extract = require('../../lib/decorate/extract');

describe('decorate/extract', () => {
  before(beforeHelper);
  beforeEach(beforeEachHelper);
  after(afterHelper);

  it('is function', () => {
    extract.should.be.a('function');
  });
  it('returns promise', () => {
    const promise = extract('/file.mkv', opts);
    promise.should.be.a('promise');
  });
  it('api required', () => extract('/file.mkv').should.be.rejected);
  it('unknown', (done) => {
    extract(fixtures.tmdb.unknown.file, opts)
      .then(r => {
        r.should.be.an('object');
        const keys = Object.keys(r);
        keys.should.be.an('array').that.has.lengthOf(0);
        done();
      })
      .catch(done);
  });
  it('movie', (done) => {
    extract(fixtures.tmdb.alien.file, opts)
      .then(r => {
        should.exist(r);
        r.should.have.properties(fixtures.tmdb.alien.done);
        done();
      })
      .catch(done);
  });
  it('tv', (done) => {
    extract(fixtures.tmdb['mad men'].file, opts)
      .then(r => {
        should.exist(r);
        r.should.have.properties(fixtures.tmdb['mad men'].done);
        done();
      })
      .catch(done);
  });
  it('multi', (done) => {
    extract(fixtures.tmdb.jfk.file, opts)
      .then(r => {
        should.exist(r);
        r.should.have.properties(fixtures.tmdb.jfk.done);
        done();
      })
      .catch(done);
  });
  it('force category for series/', (done) => {
    extract(`/series/${fixtures.tmdb.jfk.file}`, opts)
      .then(r => {
        should.exist(r);
        r.should.property('category', 'tv');
        done();
      })
      .catch(done);
  });
});
