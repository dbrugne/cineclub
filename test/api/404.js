const { request } = require('../../lib/util/tests');

const app = require('../../lib/server/index');

describe('404 errors', () => {
  it('404 (outside API)', (done) => {
    request(app)
      .get('/not-exists')
      .expect('Content-Type', /html/)
      .expect(404, done);
  });
  it('404 (from API)', (done) => {
    request(app)
      .get('/api/not-exists')
      .set('Accept', 'application/vnd.api+json')
      .expect('Content-Type', /json/)
      .expect(res => {
        const body = res.body;
        body.should.be.an('object').that.not.have.property('data');
        body.should.have.a.property('errors')
          .that.is.an('array')
          .and.have.lengthOf(1);
        body.errors[0].should.be.an('object').that.has.properties({
          status: 404,
          title: 'Not Found',
        });
      })
      .expect(404, done);
  });
});
