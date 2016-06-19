const {
  request,
  expressApp,
  beforeHelper,
  beforeEachHelper,
  afterHelper,
  collections,
  inject,
  fixtures,
} = require('../../lib/util/tests');

describe('REST API medias', () => {
  before(beforeHelper);
  beforeEach(done => {
    beforeEachHelper(() => {
      inject(fixtures.api.medias)
        .then(() => done());
    });
  });
  after(afterHelper);

  describe('GET /api/medias', () => {
    it('no parameters', done => {
      request(expressApp)
        .get('/api/medias')
        .set('Accept', 'application/vnd.api+json')
        .expect('Content-Type', /json/)
        .expect(res => {
          const body = res.body;
          body.should.be.an('object');
          body.should.have.property('meta');
          body.meta.should.have.property('total-pages', 1);
          body.links.should.have.property('self',
            'http://127.0.0.1/api/medias/?page%5Bnumber%5D=1&page%5Bsize%5D=10');
          body.links.should.not.have.property('first');
          body.links.should.not.have.property('last');
          body.links.should.not.have.property('prev');
          body.links.should.not.have.property('next');

          body.data.should.be.an('array').and.have.lengthOf(5);
          const subject = body.data[3];
          subject.should.be.an('object').and.have.properties({
            path: '/file1.txt',
            removed: false,
            category: 'movie',
            poster: 'http://placehold.it/342?text=no+image',
          });
          subject.should.have.property('id')
            .and.match(/^[a-fA-F0-9]{24}$/);
          subject.should.have.property('created')
            .and.match(/^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.(\d+)Z$/);

          subject.links.should.be.an('object')
            .and.have.property('self')
            .and.match(/^http:\/\/127\.0\.0\.1\/api\/medias\/[a-fA-F0-9]{24}$/);

          body.data[0].should.be.an('object').and.have.property('path', '/file4.txt');
          body.data[1].should.be.an('object').and.have.property('path', '/undecorated.txt');
          body.data[2].should.be.an('object').and.have.property('path', '/file2.txt');
          body.data[4].should.be.an('object').and.have.property('path', '/old.txt');
        })
        .expect(200, done);
    });
    it('empty result', done => {
      // empty collections
      beforeEachHelper(() => {
        request(expressApp)
          .get('/api/medias?page%5Bnumber%5D=1&page%5Bsize%5D=10')
          .set('Accept', 'application/vnd.api+json')
          .expect(res => {
            const body = res.body;
            body.should.be.an('object');
            body.should.have.property('meta');
            body.meta.should.have.property('total-pages', 0);
            body.links.should.have.property('self',
              'http://127.0.0.1/api/medias/?page%5Bnumber%5D=1&page%5Bsize%5D=10');
            body.links.should.not.have.property('first');
            body.links.should.not.have.property('last');
            body.links.should.not.have.property('prev');
            body.links.should.not.have.property('next');

            body.data.should.be.an('array').and.have.lengthOf(0);
          })
          .expect(200, done);
      });
    });
    it('first page', done => {
      request(expressApp)
        .get('/api/medias?page%5Bnumber%5D=1&page%5Bsize%5D=2')
        .set('Accept', 'application/vnd.api+json')
        .expect(res => {
          const body = res.body;
          body.should.be.an('object');
          body.should.have.property('meta');
          body.meta.should.have.property('total-pages', 3);
          body.links.should.have.property('self',
            'http://127.0.0.1/api/medias/?page%5Bnumber%5D=1&page%5Bsize%5D=2');
          body.links.should.have.property('first',
            'http://127.0.0.1/api/medias/?page%5Bnumber%5D=1&page%5Bsize%5D=2');
          body.links.should.have.property('last',
            'http://127.0.0.1/api/medias/?page%5Bnumber%5D=3&page%5Bsize%5D=2');
          body.links.should.have.property('next',
            'http://127.0.0.1/api/medias/?page%5Bnumber%5D=2&page%5Bsize%5D=2');
          body.links.should.not.have.property('prev');
          body.data.should.be.an('array').and.have.lengthOf(2);
          body.data[0].should.be.an('object').and.have.property('path', '/file4.txt');
          body.data[1].should.be.an('object').and.have.property('path', '/undecorated.txt');
        })
        .expect(200, done);
    });
    it('page 2', done => {
      request(expressApp)
        .get('/api/medias?page%5Bnumber%5D=2&page%5Bsize%5D=2')
        .set('Accept', 'application/vnd.api+json')
        .expect(res => {
          const body = res.body;
          body.should.be.an('object');
          body.should.have.property('meta');
          body.meta.should.have.property('total-pages', 3);
          body.links.should.have.property('self',
            'http://127.0.0.1/api/medias/?page%5Bnumber%5D=2&page%5Bsize%5D=2');
          body.links.should.have.property('first',
            'http://127.0.0.1/api/medias/?page%5Bnumber%5D=1&page%5Bsize%5D=2');
          body.links.should.have.property('last',
            'http://127.0.0.1/api/medias/?page%5Bnumber%5D=3&page%5Bsize%5D=2');
          body.links.should.have.property('prev',
            'http://127.0.0.1/api/medias/?page%5Bnumber%5D=1&page%5Bsize%5D=2');
          body.links.should.have.property('next',
            'http://127.0.0.1/api/medias/?page%5Bnumber%5D=3&page%5Bsize%5D=2');
          body.data.should.be.an('array').and.have.lengthOf(2);
          body.data[0].should.be.an('object').and.have.property('path', '/file2.txt');
          body.data[1].should.be.an('object').and.have.property('path', '/file1.txt');
        })
        .expect(200, done);
    });
    it('last page', done => {
      request(expressApp)
        .get('/api/medias?page%5Bnumber%5D=3&page%5Bsize%5D=2')
        .set('Accept', 'application/vnd.api+json')
        .expect(res => {
          const body = res.body;
          body.should.be.an('object');
          body.should.have.property('meta');
          body.meta.should.have.property('total-pages', 3);
          body.links.should.have.property('self',
            'http://127.0.0.1/api/medias/?page%5Bnumber%5D=3&page%5Bsize%5D=2');
          body.links.should.have.property('first',
            'http://127.0.0.1/api/medias/?page%5Bnumber%5D=1&page%5Bsize%5D=2');
          body.links.should.have.property('last',
            'http://127.0.0.1/api/medias/?page%5Bnumber%5D=3&page%5Bsize%5D=2');
          body.links.should.have.property('prev',
            'http://127.0.0.1/api/medias/?page%5Bnumber%5D=2&page%5Bsize%5D=2');
          body.links.should.not.have.property('next');
          body.data.should.be.an('array').and.have.lengthOf(1);
          body.data[0].should.be.an('object').and.have.property('path', '/old.txt');
        })
        .expect(200, done);
    });
    it('out of range', done => {
      request(expressApp)
        .get('/api/medias?page%5Bnumber%5D=4&page%5Bsize%5D=2')
        .set('Accept', 'application/vnd.api+json')
        .expect(res => {
          const body = res.body;
          body.should.be.an('object').that.not.have.property('data');
          body.should.have.a.property('errors')
            .that.is.an('array')
            .and.have.lengthOf(1);
          body.errors[0].should.be.an('object').that.has.properties({
            status: 404,
            title: 'Out of pagination range',
            source: {
              pointer: '/query/page/number',
            },
          });
        })
        .expect(404, done);
    });
    it('invalid page size value', done => {
      request(expressApp)
        .get('/api/medias?page%5Bnumber%5D=4&page%5Bsize%5D=200')
        .set('Accept', 'application/vnd.api+json')
        .expect(res => {
          const body = res.body;
          body.should.be.an('object').that.not.have.property('data');
          body.should.have.a.property('errors')
            .that.is.an('array')
            .and.have.lengthOf(1);
          body.errors[0].should.be.an('object').that.has.properties({
            status: 400,
            title: 'page[size] should be in 1-30 range',
            source: {
              pointer: '/query/page/size',
            },
          });
        })
        .expect(400, done);
    });
    describe('search', () => {
      it('word', done => {
        request(expressApp)
          .get('/api/medias?filter%5Bsearch%5D=foo')
          .set('Accept', 'application/vnd.api+json')
          .expect(res => {
            const body = res.body;
            body.should.be.an('object');
            body.should.have.property('meta');
            body.meta.should.have.property('total-pages', 1);
            body.links.should.have.property('self',
              'http://127.0.0.1/api/medias/?page%5Bnumber%5D=1&page%5Bsize%5D=10&filter%5Bsearch%5D=foo');
            body.links.should.not.have.property('first');
            body.links.should.not.have.property('last');
            body.links.should.not.have.property('prev');
            body.links.should.not.have.property('next');
            body.data.should.be.an('array').and.have.lengthOf(2);
            body.data[0].should.be.an('object').and.have.property('path', '/file2.txt');
            body.data[1].should.be.an('object').and.have.property('path', '/file1.txt');
          })
          .expect(200, done);
      });
      it('with spaces', done => {
        request(expressApp)
          .get('/api/medias?filter%5Bsearch%5D=with%20spaces')
          .set('Accept', 'application/vnd.api+json')
          .expect(res => {
            const body = res.body;
            body.should.be.an('object');
            body.should.have.property('meta');
            body.meta.should.have.property('total-pages', 1);
            body.links.should.have.property('self',
              'http://127.0.0.1/api/medias/?page%5Bnumber%5D=1&page%5Bsize%5D=10&filter%5Bsearch%5D=with%20spaces'
            );
            body.data.should.be.an('array').and.have.lengthOf(1);
            body.data[0].should.be.an('object').and.have.property('path', '/file1.txt');
          })
          .expect(200, done);
      });
    });
    it('type', done => {
      request(expressApp)
        .get('/api/medias?filter%5Btype%5D=movie')
        .set('Accept', 'application/vnd.api+json')
        .expect(res => {
          const body = res.body;
          body.should.be.an('object');
          body.should.have.property('meta');
          body.meta.should.have.property('total-pages', 1);
          body.links.should.have.property('self',
            'http://127.0.0.1/api/medias/?page%5Bnumber%5D=1&page%5Bsize%5D=10&filter%5Btype%5D=movie');
          body.links.should.not.have.property('first');
          body.links.should.not.have.property('last');
          body.links.should.not.have.property('prev');
          body.links.should.not.have.property('next');
          body.data.should.be.an('array').and.have.lengthOf(1);
          body.data[0].should.be.an('object').and.have.property('path', '/file1.txt');
        })
        .expect(200, done);
    });
    it('invalid type', done => {
      request(expressApp)
        .get('/api/medias?filter%5Btype%5D=foo')
        .set('Accept', 'application/vnd.api+json')
        .expect(res => {
          const body = res.body;
          body.should.be.an('object').that.not.have.property('data');
          body.should.have.a.property('errors')
            .that.is.an('array')
            .and.have.lengthOf(1);
          body.errors[0].should.be.an('object').that.has.properties({
            status: 400,
            title: 'type should be undecorated, decorated, movie, tv or failed',
            source: {
              pointer: '/query/filter/type',
            },
          });
        })
        .expect(400, done);
    });
  });
  describe('GET /medias/:id', () => {
    it('exists', done => {
      collections.media.findOne({ path: '/file1.txt' }).exec()
        .then(doc => {
          request(expressApp)
            .get(`/api/medias/${doc.id}`)
            .set('Accept', 'application/vnd.api+json')
            .expect('Content-Type', /json/)
            .expect(res => {
              const body = res.body;
              body.should.be.an('object');
              body.should.have.property('links');
              body.links.should.have.property('self',
                `http://127.0.0.1/api/medias/${doc.id}`
              );
              body.data.should.be.an('object').and.have.properties({
                path: '/file1.txt',
                id: doc.id,
                removed: false,
                category: 'movie',
                poster: 'http://placehold.it/342?text=no+image',
              });
              body.data.should.have.property('created')
                .and.match(/^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.(\d+)Z$/);
            })
            .expect(200, done);
        })
        .catch(done);
    });
    it('not exists', done => {
      request(expressApp)
        .get('/api/medias/1042c88d282c219c2373d0fd')
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
    it('invalid id', done => {
      request(expressApp)
        .get('/api/medias/not-valid-id')
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
            title: 'invalid id',
            source: {
              pointer: '/query/id',
            },
          });
        })
        .expect(400, done);
    });
  });
  describe('PATCH /medias/:id', () => {
    it('not found', done => {
      request(expressApp)
        .patch('/api/medias/1042c88d282c219c2373d0fd')
        .set('Content-Type', 'application/vnd.api+json')
        .set('Accept', 'application/vnd.api+json')
        .send(JSON.stringify({ info: { title: 'Title 1' } }))
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
    it('without info', done => {
      request(expressApp)
        .patch('/api/medias/1042c88d282c219c2373d0fd')
        .set('Content-Type', 'application/vnd.api+json')
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
            title: 'missing or invalid info parameter',
            source: {
              pointer: '/body/info',
            },
          });
        })
        .expect(400, done);
    });
    it('empty info', done => {
      request(expressApp)
        .patch('/api/medias/1042c88d282c219c2373d0fd')
        .set('Content-Type', 'application/vnd.api+json')
        .set('Accept', 'application/vnd.api+json')
        .send(JSON.stringify({ info: {} }))
        .expect('Content-Type', /json/)
        .expect(res => {
          const body = res.body;
          body.should.be.an('object').that.not.have.property('data');
          body.should.have.a.property('errors')
            .that.is.an('array')
            .and.have.lengthOf(1);
          body.errors[0].should.be.an('object').that.has.properties({
            status: 400,
            title: 'missing or invalid info parameter',
            source: {
              pointer: '/body/info',
            },
          });
        })
        .expect(400, done);
    });
    it('works', done => {
      collections.media.findOne({ path: '/file1.txt' }).exec()
        .then(doc => {
          request(expressApp)
            .patch(`/api/medias/${doc.id}`)
            .set('Content-Type', 'application/vnd.api+json')
            .set('Accept', 'application/vnd.api+json')
            .send(JSON.stringify({
              info: {
                title: 'Title 1',
                media_type: 'tv',
                original_name: 'name',
              },
            }))
            .expect('Content-Type', /json/)
            .expect(res => {
              const body = res.body;
              body.should.be.an('object')
                .and.have.property('links')
                .that.have.property('self', `http://127.0.0.1/api/medias/${doc.id}`);
              body.data.should.be.an('object').and.have.properties({
                path: '/file1.txt',
                id: doc.id,
                decoration: 'decorated',
                removed: false,
                category: 'tv',
                poster: 'http://placehold.it/342?text=no+image',
                original_title: 'name',
              });
            })
            .expect(200, done);
        })
        .catch(done);
    });
  });
});
