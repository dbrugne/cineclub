const {
  should,
  request,
  beforeHelper,
  beforeEachHelper,
  afterHelper,
  collections,
  inject,
  fixtures,
} = require('../../lib/util/tests');

const app = require('../../lib/server/index');
app.locals.tmdbApiKey = fixtures.tmdb;

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
      request(app)
        .get('/api/medias')
        .set('Accept', 'application/json')
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
          body.data[0].should.be.an('object').and.have.properties({
            path: '/file1.txt',
            removed: false,
            category: 'movie',
            poster: 'http://placehold.it/342?text=no+image',
          });
          body.data[0].should.have.property('id')
            .and.match(/^[a-fA-F0-9]{24}$/);
          body.data[0].should.have.property('created')
            .and.match(/^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.(\d+)Z$/);

          body.data[0].links.should.be.an('object')
            .and.have.property('self')
            .and.match(/^http:\/\/127\.0\.0\.1\/api\/medias\/[a-fA-F0-9]{24}$/);

          body.data[1].should.be.an('object').and.have.property('path', '/file2.txt');
          body.data[2].should.be.an('object').and.have.property('path', '/undecorated.txt');
          body.data[3].should.be.an('object').and.have.property('path', '/file4.txt');
          body.data[4].should.be.an('object').and.have.property('path', '/old.txt');
        })
        .expect(200, done);
    });
    it('decorate', done => {
      request(app)
        .get('/api/medias')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(res => {
          const body = res.body;
          body.should.be.an('object');
          body.data.should.be.an('array').and.have.lengthOf(5);
          body.data[2].should.be.an('object').and.have.properties({
            path: '/undecorated.txt',
            category: 'movie',
            title: 'decorated',
            overview: 'overview',
          });
        })
        .expect(200, done);
    });
    it('empty result', done => {
      // empty collections
      beforeEachHelper(() => {
        request(app)
          .get('/api/medias?page%5Bnumber%5D=1&page%5Bsize%5D=10')
          .set('Accept', 'application/json')
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
      request(app)
        .get('/api/medias?page%5Bnumber%5D=1&page%5Bsize%5D=2')
        .set('Accept', 'application/json')
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
          body.data[0].should.be.an('object').and.have.property('path', '/file1.txt');
          body.data[1].should.be.an('object').and.have.property('path', '/file2.txt');
        })
        .expect(200, done);
    });
    it('page 2', done => {
      request(app)
        .get('/api/medias?page%5Bnumber%5D=2&page%5Bsize%5D=2')
        .set('Accept', 'application/json')
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
          body.data[0].should.be.an('object').and.have.property('path', '/undecorated.txt');
          body.data[1].should.be.an('object').and.have.property('path', '/file4.txt');
        })
        .expect(200, done);
    });
    it('last page', done => {
      request(app)
        .get('/api/medias?page%5Bnumber%5D=3&page%5Bsize%5D=2')
        .set('Accept', 'application/json')
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
      request(app)
        .get('/api/medias?page%5Bnumber%5D=4&page%5Bsize%5D=2')
        .set('Accept', 'application/json')
        .expect(404, done);
    });
    it('invalid page size value', done => {
      request(app)
        .get('/api/medias?page%5Bnumber%5D=4&page%5Bsize%5D=200')
        .set('Accept', 'application/json')
        .expect(400, done);
    });
    it('search', done => {
      request(app)
        .get('/api/medias?filter%5Bsearch%5D=foo')
        .set('Accept', 'application/json')
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
          body.data[0].should.be.an('object').and.have.property('path', '/file1.txt');
          body.data[1].should.be.an('object').and.have.property('path', '/file2.txt');
        })
        .expect(200, done);
    });
    it('category', done => {
      request(app)
        .get('/api/medias?filter%5Bcategory%5D=movie')
        .set('Accept', 'application/json')
        .expect(res => {
          const body = res.body;
          body.should.be.an('object');
          body.should.have.property('meta');
          body.meta.should.have.property('total-pages', 1);
          body.links.should.have.property('self',
            'http://127.0.0.1/api/medias/?page%5Bnumber%5D=1&page%5Bsize%5D=10&filter%5Bcategory%5D=movie');
          body.links.should.not.have.property('first');
          body.links.should.not.have.property('last');
          body.links.should.not.have.property('prev');
          body.links.should.not.have.property('next');
          body.data.should.be.an('array').and.have.lengthOf(1);
          body.data[0].should.be.an('object').and.have.property('path', '/file1.txt');
        })
        .expect(200, done);
    });
    it('invalid category', done => {
      request(app)
        .get('/api/medias?filter%5Bcategory%5D=foo')
        .set('Accept', 'application/json')
        .expect(400, done);
    });
  });
  describe('GET /medias/:id', () => {
    it('exists', done => {
      collections.media.findOne({ path: '/file1.txt' }).exec()
        .then(doc => {
          request(app)
            .get(`/api/medias/${doc.id}`)
            .set('Accept', 'application/json')
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
    it('decorate', done => {
      collections.media.findOne({ path: '/undecorated.txt' }).exec()
        .then(doc => {
          should.not.exist(doc.info);
          request(app)
            .get(`/api/medias/${doc.id}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(res => {
              const body = res.body;
              body.should.be.an('object').and.have.property('data');
              body.data.should.be.an('object')
                .and.have.properties({
                  path: '/undecorated.txt',
                  id: doc.id,
                  removed: false,
                  category: 'movie',
                  poster: 'http://placehold.it/342?text=no+image',
                  title: 'decorated',
                  overview: 'overview',
                });
            })
            .expect(200, done);
        })
        .catch(done);
    });
    it('not exists', done => {
      request(app)
        .get('/api/medias/1042c88d282c219c2373d0fd')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404, done);
    });
    it('invalid period', done => {
      request(app)
        .get('/api/medias/not-valid-id')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400, done);
    });
  });
});
