const { request } = require('../../lib/util/tests');

const app = require('../../lib/server/index');

describe('404 errors', () => {
  it('get 404 (html)', (done) => {
    request(app)
      .get('/not-exists')
      .expect('Content-Type', /html/)
      .expect(404, done);
  });
  it('get 404 (json)', (done) => {
    request(app)
      .get('/not-exists')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404, done);
  });
  it('get 404 from API', (done) => {
    request(app)
      .get('/api/not-exists')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404, done);
  });
});
