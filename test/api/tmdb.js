const {
  request,
  expressApp,
  beforeHelper,
  beforeEachHelper,
  afterHelper,
  fixtures,
} = require('../../lib/util/tests');

describe('REST API tmdb', () => {
  before(beforeHelper);
  beforeEach(beforeEachHelper);
  after(afterHelper);

  describe('GET /api/tmdb', () => {
    it('search is required', done => {
      request(expressApp)
        .get('/api/tmdb')
        .set('Accept', 'application/vnd.api+json')
        .expect(res => {
          const body = res.body;
          body.should.be.an('object').that.not.have.property('data');
          body.should.have.a.property('errors')
            .that.is.an('array')
            .and.have.lengthOf(1);
          body.errors[0].should.be.an('object').that.has.properties({
            status: 400,
            title: 'search is required',
            source: {
              pointer: '/query/filter/search',
            },
          });
        })
        .expect(400, done);
    });
    it('empty result', done => {
      // empty collections
      beforeEachHelper(() => {
        request(expressApp)
          .get('/api/tmdb?filter%5Bsearch%5D=unknown')
          .set('Accept', 'application/vnd.api+json')
          .expect(res => {
            const body = res.body;
            body.should.be.an('object');
            body.should.have.property('meta');
            body.meta.should.have.property('total-pages', 0);
            body.meta.should.have.property('from-cache', false);
            body.links.should.have.property('self',
              'http://127.0.0.1/api/tmdb/?page%5Bnumber%5D=1&filter%5Bsearch%5D=unknown');
            body.links.should.not.have.property('first');
            body.links.should.not.have.property('last');
            body.links.should.not.have.property('prev');
            body.links.should.not.have.property('next');

            body.data.should.be.an('array').and.have.lengthOf(0);
          })
          .expect(200, done);
      });
    });
    it('with results', done => {
      beforeEachHelper(() => {
        request(expressApp)
          .get('/api/tmdb?filter%5Bsearch%5D=alien')
          .set('Accept', 'application/vnd.api+json')
          .expect(res => {
            const body = res.body;
            body.should.be.an('object');
            body.should.have.property('meta');
            body.meta.should.have.property('total-pages', 1);
            body.meta.should.have.property('from-cache', false);
            body.links.should.have.property('self',
              'http://127.0.0.1/api/tmdb/?page%5Bnumber%5D=1&filter%5Bsearch%5D=alien');
            body.links.should.not.have.property('first');
            body.links.should.not.have.property('last');
            body.links.should.not.have.property('prev');
            body.links.should.not.have.property('next');

            body.data.should.be.an('array').and.have.lengthOf(2);
            body.data.should.have.properties(fixtures.tmdb.alien.result.results);
          })
          .expect(200, done);
      });
    });
    it('first page', done => {
      beforeEachHelper(() => {
        request(expressApp)
          .get('/api/tmdb?filter%5Bsearch%5D=page1')
          .set('Accept', 'application/vnd.api+json')
          .expect(res => {
            const body = res.body;
            body.should.be.an('object');
            body.should.have.property('meta');
            body.meta.should.have.property('total-pages', 2);
            body.meta.should.have.property('from-cache', false);
            body.links.should.have.property('self',
              'http://127.0.0.1/api/tmdb/?page%5Bnumber%5D=1&filter%5Bsearch%5D=page1');
            body.links.should.have.property('first',
              'http://127.0.0.1/api/tmdb/?page%5Bnumber%5D=1&filter%5Bsearch%5D=page1');
            body.links.should.have.property('last',
              'http://127.0.0.1/api/tmdb/?page%5Bnumber%5D=2&filter%5Bsearch%5D=page1');
            body.links.should.not.have.property('prev');
            body.links.should.have.property('next',
              'http://127.0.0.1/api/tmdb/?page%5Bnumber%5D=2&filter%5Bsearch%5D=page1');

            body.data.should.be.an('array').and.have.lengthOf(2);
          })
          .expect(200, done);
      });
    });
    it('second page', done => {
      beforeEachHelper(() => {
        request(expressApp)
          .get('/api/tmdb?page%5Bnumber%5D=2&filter%5Bsearch%5D=page2')
          .set('Accept', 'application/vnd.api+json')
          .expect(res => {
            const body = res.body;
            body.should.be.an('object');
            body.should.have.property('meta');
            body.meta.should.have.property('total-pages', 2);
            body.meta.should.have.property('from-cache', false);
            body.links.should.have.property('self',
              'http://127.0.0.1/api/tmdb/?page%5Bnumber%5D=2&filter%5Bsearch%5D=page2');
            body.links.should.have.property('first',
              'http://127.0.0.1/api/tmdb/?page%5Bnumber%5D=1&filter%5Bsearch%5D=page2');
            body.links.should.have.property('last',
              'http://127.0.0.1/api/tmdb/?page%5Bnumber%5D=2&filter%5Bsearch%5D=page2');
            body.links.should.have.property('prev',
              'http://127.0.0.1/api/tmdb/?page%5Bnumber%5D=1&filter%5Bsearch%5D=page2');
            body.links.should.not.have.property('next');

            body.data.should.be.an('array').and.have.lengthOf(1);
          })
          .expect(200, done);
      });
    });
  });
});
