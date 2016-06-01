const { request } = require('../../lib/util/tests');

const app = require('../../lib/server/index');

describe('/api/', () => {
  it('GET /', done => {
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
