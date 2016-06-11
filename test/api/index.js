const {
  request,
  expressApp,
} = require('../../lib/util/tests');

describe('REST API index', () => {
  it('GET /api/', done => {
    request(expressApp)
      .get('/api/')
      .set('Accept', 'application/vnd.api+json')
      .expect('Content-Type', /json/)
      .expect(res => {
        const body = res.body;
        body.should.be.an('object').and.have.properties({
          data: {
            whatsnew: {
              links: {
                self: 'http://127.0.0.1/api/whatsnew',
              },
            },
            medias: {
              links: {
                self: 'http://127.0.0.1/api/medias',
              },
            },
            tmdb: {
              links: {
                self: 'http://127.0.0.1/api/tmdb',
              },
            },
          },
          links: {
            self: 'http://127.0.0.1/api/',
          },
        });
      })
      .expect(200, done);
  });
});
