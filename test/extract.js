const should = require('chai').should();

const util = require('../lib/util/tests');
const fixtures = require('./fixtures.json');
const opts = {
  api: util.tmdbMockup(fixtures.tmdb),
};

const extract = require('../lib/decorate/extract');

describe('decorate::extract', () => {
  before(util.before);
  beforeEach(util.beforeEach);
  after(util.after);

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
      .then((r) => {
        should.not.exist(r);
        done();
      })
      .catch(err => done(new Error(err)));
  });
  it('movie', (done) => {
    extract(fixtures.tmdb.alien.file, opts)
      .then((r) => {
        should.exist(r);
        r.should.deep.equal(fixtures.tmdb.alien.result.results[0]);
        r.should.property('category', 'movie');
        done();
      })
      .catch(err => done(new Error(err)));
  });
  it('tv', (done) => {
    extract(fixtures.tmdb['mad men'].file, opts)
      .then((r) => {
        should.exist(r);
        r.should.deep.equal(fixtures.tmdb['mad men'].result.results[0]);
        r.should.property('category', 'tv');
        done();
      })
      .catch(done);
  });
  it('multi', (done) => {
    extract(fixtures.tmdb.jfk.file, opts)
      .then((r) => {
        should.exist(r);
        r.should.deep.equal(fixtures.tmdb.jfk.result.results[0]);
        r.should.property('category', 'movie');
        done();
      })
      .catch(err => done(new Error(err)));
  });
  it('get from cache', (done) => {
    // 1st call
    extract(fixtures.tmdb.jfk.file, opts)
      .then(first => {
        should.exist(first);
        first.should.deep.equal(fixtures.tmdb.jfk.result.results[0]);

        // 2nd call
        extract(fixtures.tmdb.jfk.file, opts)
          .then(second => {
            should.exist(second);
            const fromCache = Object.assign(
              { from_cache: true },
              fixtures.tmdb.jfk.result.results[0]
            );
            second.should.deep.equal(fromCache);
            done();
          })
          .catch(err => done(new Error(err)));
      })
      .catch(err => done(new Error(err)));
  });
  it('force category for series/', (done) => {
    extract(`/series/${fixtures.tmdb.jfk.file}`, opts)
      .then((r) => {
        should.exist(r);
        r.should.deep.equal(fixtures.tmdb.jfk.result.results[0]);
        r.should.property('category', 'tv');
        done();
      })
      .catch(err => done(new Error(err)));
  });
});
