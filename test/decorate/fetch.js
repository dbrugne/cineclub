const {
  beforeHelper,
  beforeEachHelper,
  afterHelper,
  tmdbStub,
  fixtures,
} = require('../../lib/util/tests');

const fetch = require('../../lib/decorate/fetch');

describe('decorate/fetch', () => {
  before(beforeHelper);
  beforeEach(beforeEachHelper);
  after(afterHelper);

  it('is function', () => {
    fetch.should.be.a('function');
  });
  it('returns promise', () => {
    fetch().should.be.a('promise');
  });
  it('api required', done => {
    fetch()
      .then(() => done(new Error('not rejected'))).catch(() => done());
  });
  it('type required', done => {
    fetch(tmdbStub)
      .then(() => done(new Error('not rejected'))).catch(() => done());
  });
  it('invalid type', done => {
    fetch(tmdbStub, 'person')
      .then(() => done(new Error('not rejected'))).catch(() => done());
  });
  it('id required', done => {
    fetch(tmdbStub, 'movie')
      .then(() => done(new Error('not rejected'))).catch(() => done());
  });
  it('movie', (done) => {
    fetch(tmdbStub, 'movie', 348)
      .then(r => {
        r.should.be.an('object').that.have.properties(fixtures.tmdb.get.movie[0]);
        r.should.have.property('appended', 'credits,images,videos,reviews');
        r.should.have.property('category', 'movie');
        done();
      })
      .catch(done);
  });
  it('tv', (done) => {
    fetch(tmdbStub, 'tv', 1104)
      .then(r => {
        r.should.be.an('object').that.have.properties(fixtures.tmdb.get.tv[0]);
        r.should.have.property('appended', 'credits,images,videos');
        r.should.have.property('category', 'tv');
        done();
      })
      .catch(done);
  });
  it('not found', (done) => {
    fetch(tmdbStub, 'movie', 100)
      .then(r => {
        r.should.be.an('object').and.deep.equal({});
        done();
      })
      .catch(done);
  });
});
