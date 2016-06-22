const {
  request,
  expressApp,
  dropCollections,
  beforeHelper,
  beforeEachHelper,
  afterHelper,
  inject,
  fixtures,
} = require('../../lib/util/tests');

describe('REST API whatsnew', () => {
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
          request(expressApp)
            .get('/api/whatsnew')
            .set('Accept', 'application/vnd.api+json')
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
      request(expressApp)
        .get('/api/whatsnew')
        .set('Accept', 'application/vnd.api+json')
        .expect('Content-Type', /json/)
        .expect(res => {
          const body = res.body;
          body.should.be.an('object');
          body.should.have.property('links').that.is.an('object');
          body.links.should.have.property('self', 'http://127.0.0.1/api/whatsnew?period=1');

          body.should.have.property('data').that.is.an('object');
          const data = body.data;

          // movies
          data.should.have.property('movies').that.is.an('array').with.lengthOf(1);
          data.movies[0].data.path.should.equal('/file1.txt');

          // series
          data.should.have.property('series').that.is.an('array').with.lengthOf(0);

          // removed
          data.should.have.property('removed').that.is.an('array').with.lengthOf(1);
          data.removed[0].data.path.should.equal('/removed.txt');

          // unknown
          data.should.have.property('unknown').that.is.an('array').with.lengthOf(3);
          data.unknown[0].data.path.should.equal('/file2.txt');
          data.unknown[1].data.path.should.equal('/undecorated.txt');
          data.unknown[2].data.path.should.equal('/file4.txt');
        })
        .expect(200, done);
    });
  });
  it('longer period', done => {
    request(expressApp)
      .get('/api/whatsnew?period=4')
      .set('Accept', 'application/vnd.api+json')
      .expect('Content-Type', /json/)
      .expect(res => {
        const body = res.body;
        body.should.be.an('object');
        body.should.have.property('links').that.is.an('object');
        body.links.should.have.property('self', 'http://127.0.0.1/api/whatsnew?period=4');

        body.should.have.property('data').that.is.an('object');
        const data = body.data;
        data.should.have.property('movies').that.is.an('array').with.lengthOf(1);
        data.should.have.property('series').that.is.an('array').with.lengthOf(0);
        data.should.have.property('removed').that.is.an('array').with.lengthOf(1);
        data.should.have.property('unknown').that.is.an('array').with.lengthOf(4);
        data.unknown[0].data.path.should.equal('/file2.txt');
        data.unknown[1].data.path.should.equal('/undecorated.txt');
        data.unknown[2].data.path.should.equal('/file4.txt');
        data.unknown[3].data.path.should.equal('/old.txt');
      })
      .expect(200, done);
  });
  it('invalid period', done => {
    request(expressApp)
      .get('/api/whatsnew?period=100')
      .set('Accept', 'application/vnd.api+json')
      .expect('Content-Type', /json/)
      .expect(res => {
        const body = res.body;
        body.should.be.an('object').that.not.have.property('data');
        body.should.have.a.property('errors')
          .that.is.an('array')
          .and.have.lengthOf(1);
        body.errors[0].should.be.an('object').that.has.properties({
          status: 400,
          title: 'page size should be in 1-10 range',
          source: {
            pointer: '/query/period',
          },
        });
      })
      .expect(400, done);
  });
});
