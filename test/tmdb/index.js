const {
  should,
  beforeHelper,
  beforeEachHelper,
  afterHelper,
  fixtures,
  tmdbStub,
} = require('../../lib/util/tests');
const tmdb = require('../../lib/tmdb/index');

describe('tmdb API wrapper', () => {
  before(beforeHelper);
  beforeEach(beforeEachHelper);
  after(afterHelper);

  describe('with real API', () => {
    const api = tmdb('tmdb-api-key');
    it('is function and return promise', () => {
      api.should.be.a('function');
      api('searchMovie', 'foo').should.be.a('promise');
      api('searchTv', 'foo').should.be.a('promise');
      api('searchMulti', 'foo').should.be.a('promise');
    });
  });
  describe('with stub API', () => {
    it('is function and return promise', () => {
      tmdbStub.should.be.a('function');
      tmdbStub('searchMovie', 'foo').should.be.a('promise');
      tmdbStub('searchTv', 'foo').should.be.a('promise');
      tmdbStub('searchMulti', 'foo').should.be.a('promise');
    });
    it('searchMovie', done => {
      tmdbStub('searchMovie', { query: 'alien' })
        .then(res => {
          res.should.be.an('object')
            .and.have.property('results')
            .that.is.an('array')
            .that.has.lengthOf(2);
          res.results[0].should.be.an('object').and.have.property('title', 'Alien');
        })
        .then(done)
        .catch(done);
    });
    it('searchTv', done => {
      tmdbStub('searchTv', { query: 'mad men' })
        .then(res => {
          res.should.be.an('object')
            .and.have.property('results')
            .that.is.an('array')
            .that.has.lengthOf(2);
          res.results[0].should.be.an('object').and.have.property('name', 'Mad Men');
        })
        .then(() => done())
        .catch(done);
    });
    it('searchMulti', done => {
      tmdbStub('searchMulti', { query: 'jfk' })
        .then(res => {
          res.should.be.an('object')
            .and.have.property('results')
            .that.is.an('array')
            .that.has.lengthOf(1);
          res.results[0].should.be.an('object');
          res.results[0].should.have.property('title', 'JFK');
          res.results[0].should.have.property('media_type', 'movie');
        })
        .then(done)
        .catch(done);
    });
    it('set and get cache', done => tmdbStub('searchMulti', { query: 'jfk' }) // 1st call
      .then(first => {
        should.exist(first);
        first.should.have.properties(fixtures.tmdb.search.multi.jfk.result);

        return tmdbStub('searchMulti', { query: 'jfk' }) // 2nd call
          .then(second => {
            should.exist(second);
            second.should.have.properties(fixtures.tmdb.search.multi.jfk.result);
            done();
          });
      })
      .catch(done)
    );
    it('ratelimit exceeded', done => {
      tmdbStub.setLimit(2);
      tmdbStub('searchMulti', { query: 'jfk' })
        .then(r => {
          should.exist(r);
          r.should.not.property('from_cache');
          return tmdbStub('searchMulti', { query: 'alien' });
        })
        .then(r => {
          should.exist(r);
          r.should.not.property('from_cache');
          return tmdbStub('searchMulti', { query: 'mad men' });
        })
        .then(() => done('Last request wasn\'t supposed to be done'))
        .catch(err => {
          if (err.name === 'TmdbRateLimitError') {
            return done();
          }

          return done(err);
        });
    });
  });
});
