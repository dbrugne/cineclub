const {
  beforeHelper,
  beforeEachHelper,
  afterHelper,
  tmdbStub,
} = require('../../lib/util/tests');
const tmdb = require('../../lib/tmdb/index');

describe('tmdb', () => {
  before(beforeHelper);
  beforeEach(beforeEachHelper);
  after(afterHelper);

  describe('real', () => {
    const api = tmdb('tmdb-api-key');
    it('is function and return promise', () => {
      api.should.be.a('function');
      api('searchMovie', 'foo').should.be.a('promise');
      api('searchTv', 'foo').should.be.a('promise');
      api('searchMulti', 'foo').should.be.a('promise');
    });
  });
  describe('stub', () => {
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
          res.should.have.property('ratelimit').that.is.a('number');
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
          res.should.have.property('ratelimit').that.is.a('number');
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
          res.should.have.property('ratelimit').that.is.a('number');
        })
        .then(done)
        .catch(done);
    });
  });
});
