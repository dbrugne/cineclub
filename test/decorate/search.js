const {
  beforeHelper,
  beforeEachHelper,
  afterHelper,
  tmdbStub,
} = require('../../lib/util/tests');

const search = require('../../lib/decorate/search');

describe('decorate/search', () => {
  before(beforeHelper);
  beforeEach(beforeEachHelper);
  after(afterHelper);

  it('is function', () => {
    search.should.be.a('function');
  });
  it('returns promise', () => {
    search().should.be.a('promise');
  });
  it('api required', done => {
    search()
      .then(() => done(new Error('not rejected'))).catch(() => done());
  });
  it('method required', done => {
    search(tmdbStub)
      .then(() => done(new Error('not rejected'))).catch(() => done());
  });
  it('search required', done => {
    search(tmdbStub, 'searchMulti')
      .then(() => done(new Error('not rejected'))).catch(() => done());
  });
  it('searchMovie', done => {
    search(tmdbStub, 'searchMovie', { query: 'alien' })
      .then(r => {
        r.should.be.an('object').with.properties({
          type: 'movie',
          id: 348,
        });
        done();
      })
      .catch(done);
  });
  it('searchMovie with year', done => {
    search(tmdbStub, 'searchMovie', { query: 'alien', year: '1979' })
      .then(r => {
        r.should.be.an('object').with.properties({
          type: 'movie',
          id: 348,
        });
        done();
      })
      .catch(done);
  });
  it('searchTv', done => {
    search(tmdbStub, 'searchTv', { query: 'mad men' })
      .then(r => {
        r.should.be.an('object').with.properties({
          type: 'tv',
          id: 1104,
        });
        done();
      })
      .catch(done);
  });
  it('searchMulti', done => {
    search(tmdbStub, 'searchMulti', { query: 'jfk' })
      .then(r => {
        r.should.be.an('object').with.properties({
          type: 'movie',
          id: 820,
        });
        done();
      })
      .catch(done);
  });
  it('not found', done => {
    search(tmdbStub, 'searchMulti', { query: 'truc' })
      .then(r => {
        r.should.be.an('object');
        r.should.not.have.property('type');
        r.should.not.have.property('id');
        done();
      })
      .catch(done);
  });
});
