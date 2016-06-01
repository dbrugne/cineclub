const { request, fixtures } = require('../../lib/util/tests');

const app = require('../../lib/server/index');
app.locals.tmdbApiKey = fixtures.tmdb;

describe('REST API index', () => {
  it('GET /api/', done => {
    request(app)
      .get('/api/')
      .set('Accept', 'application/json')
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
          },
          links: {
            self: 'http://127.0.0.1/api/',
          },
        });
      })
      .expect(200, done);
  });
});
