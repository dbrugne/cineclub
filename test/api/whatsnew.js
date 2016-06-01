const {
  request,
  dropCollections,
  beforeHelper,
  beforeEachHelper,
  afterHelper,
  inject,
  fixtures,
} = require('../../lib/util/tests');

const app = require('../../lib/server/index');
app.locals.tmdbApiKey = fixtures.tmdb;

describe('REST API index', () => {
  before(beforeHelper);
  beforeEach(done => {
    beforeEachHelper(() => {
      inject(fixtures.api.medias)
        .then(() => done());
    });
  });
  after(afterHelper);

  describe('GET /api/whatsnew', () => {
    it('empty', done => {
      dropCollections()
        .then(() => {
          request(app)
            .get('/api/whatsnew')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(res => {
              const body = res.body;
              body.should.be.an('object').and.have.property('data');

              body.should.have.property('links').that.is.an('object');
              body.links.should.have.property('self', 'http://127.0.0.1/api/whatsnew?period=1');

              const data = body.data;
              data.should.have.property('movies').that.is.an('array').with.lengthOf(0);
              data.should.have.property('series').that.is.an('array').with.lengthOf(0);
              data.should.have.property('removed').that.is.an('array').with.lengthOf(0);
              data.should.have.property('unknown').that.is.an('array').with.lengthOf(0);
            })
            .expect(200, done);
        })
        .catch(done);
    });
    it('simple', done => {
      request(app)
        .get('/api/whatsnew')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(res => {
          const body = res.body;
          body.should.be.an('object');
          body.should.have.property('links').that.is.an('object');
          body.links.should.have.property('self', 'http://127.0.0.1/api/whatsnew?period=1');

          body.should.have.property('data').that.is.an('object');
          const data = body.data;

          // movies
          data.should.have.property('movies').that.is.an('array').with.lengthOf(2);
          data.movies[0].data.path.should.equal('/file1.txt');
          data.movies[1].data.path.should.equal('/undecorated.txt');

          // series
          data.should.have.property('series').that.is.an('array').with.lengthOf(0);

          // removed
          data.should.have.property('removed').that.is.an('array').with.lengthOf(1);
          data.removed[0].data.path.should.equal('/removed.txt');

          // unknown
          data.should.have.property('unknown').that.is.an('array').with.lengthOf(2);
          data.unknown[0].data.path.should.equal('/file2.txt');
          data.unknown[1].data.path.should.equal('/file4.txt');
        })
        .expect(200, done);
    });
  });
  it('longer period', done => {
    request(app)
      .get('/api/whatsnew?period=4')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(res => {
        const body = res.body;
        body.should.be.an('object');
        body.should.have.property('links').that.is.an('object');
        body.links.should.have.property('self', 'http://127.0.0.1/api/whatsnew?period=4');

        body.should.have.property('data').that.is.an('object');
        const data = body.data;
        data.should.have.property('movies').that.is.an('array').with.lengthOf(2);
        data.should.have.property('series').that.is.an('array').with.lengthOf(0);
        data.should.have.property('removed').that.is.an('array').with.lengthOf(1);
        data.should.have.property('unknown').that.is.an('array').with.lengthOf(3);
        data.unknown[0].data.path.should.equal('/file2.txt');
        data.unknown[1].data.path.should.equal('/file4.txt');
        data.unknown[2].data.path.should.equal('/old.txt');
      })
      .expect(200, done);
  });
  it('invalid period', done => {
    request(app)
      .get('/api/whatsnew?period=100')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400, done);
  });
});
