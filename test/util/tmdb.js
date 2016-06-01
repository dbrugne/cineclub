const { fixtures } = require('../../lib/util/tests');
const tmdb = require('../../lib/util/tmdb');

describe('tmdb', () => {
  describe('stub', () => {
    const api = tmdb(fixtures.tmdb);
    it('is function and return promise', () => {
      api.should.be.a('function');
      api('searchMovie', 'foo').should.be.a('promise');
      api('searchTv', 'foo').should.be.a('promise');
      api('searchMulti', 'foo').should.be.a('promise');
    });
    it('searchMovie', done => {
      api('searchMovie', { query: 'alien' })
        .then(res => {
          res.should.be.an('object')
            .and.have.property('results')
            .that.is.an('array')
            .that.has.lengthOf(2);
          res.results[0].should.be.an('object').and.have.property('title', 'Alien');
        })
        .then(() => done())
        .catch(done);
    });
    it('searchTv', done => {
      api('searchTv', { query: 'mad men' })
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
      api('searchMulti', { query: 'jfk' })
        .then(res => {
          res.should.be.an('object')
            .and.have.property('results')
            .that.is.an('array')
            .that.has.lengthOf(1);
          res.results[0].should.be.an('object');
          res.results[0].should.have.property('title', 'JFK');
          res.results[0].should.have.property('media_type', 'movie');
        })
        .then(() => done())
        .catch(done);
    });
  });
  describe('regular', () => {
    const api = tmdb('tmdb-api-key');
    it('is function and return promise', () => {
      api.should.be.a('function');
      api('searchMovie', 'foo').should.be.a('promise');
      api('searchTv', 'foo').should.be.a('promise');
      api('searchMulti', 'foo').should.be.a('promise');
    });
  });
});
