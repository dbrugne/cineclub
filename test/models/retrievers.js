const {
  beforeHelper,
  beforeEachHelper,
  afterHelper,
  inject,
  fixtures,
} = require('../../lib/util/tests');

const Media = require('../../lib/models/media');

describe('models/media:retrieve', () => {
  before(beforeHelper);
  beforeEach(done => {
    beforeEachHelper(() => {
      inject(fixtures.models.retrievers)
        .then(() => done());
    });
  });
  after(afterHelper);

  it('is object and has expected functions', () => {
    Media.should.be.an('function').and.property('schema');
    Media.countAll.should.be.a('function');
    Media.retrieve.should.be.a('function');
  });
  describe('countAll', () => {
    it('no parameters', done => {
      Media.countAll()
        .then((count) => {
          count.should.equal(4);
          done();
        })
        .catch(done);
    });
    it('search', done => {
      Media.countAll('foo')
        .then((count) => {
          count.should.equal(2);
          done();
        })
        .catch(done);
    });
    it('category', done => {
      Media.countAll(null, 'movie')
        .then((count) => {
          count.should.equal(1);
          done();
        })
        .catch(done);
    });
    it('search & category', done => {
      Media.countAll('foo', 'movie')
        .then((count) => {
          count.should.equal(1);
          done();
        })
        .catch(done);
    });
  });
  describe('retrieve', () => {
    describe('search & category', () => {
      it('search', (done) => {
        Media.retrieve('foo')
          .then((docs) => {
            docs.should.be.an('array').and.have.lengthOf(2);
            docs[0].should.property('path', '/media1.txt');
            docs[1].should.property('path', '/media2.txt');
            done();
          })
          .catch(done);
      });
      it('category', (done) => {
        Media.retrieve(null, 'movie')
          .then((docs) => {
            docs.should.be.an('array').and.have.lengthOf(1);
            docs[0].should.property('path', '/media1.txt');
            done();
          })
          .catch(done);
      });
      it('search & category', (done) => {
        Media.retrieve('foo', 'movie')
          .then((docs) => {
            docs.should.be.an('array').and.have.lengthOf(1);
            docs[0].should.property('path', '/media1.txt');
            done();
          })
          .catch(done);
      });
    });
    describe('pagination', () => {
      it('no parameters', (done) => {
        Media.retrieve()
          .then((docs) => {
            docs.should.be.an('array').and.have.lengthOf(4);
            docs[0].should.property('path', '/media1.txt');
            docs[1].should.property('path', '/media2.txt');
            docs[2].should.property('path', '/media3.txt');
            docs[3].should.property('path', '/media4.txt');
            done();
          })
          .catch(done);
      });
      it('limit', (done) => {
        Media.retrieve(null, null, 2, 0)
          .then((docs) => {
            docs.should.be.an('array').and.have.lengthOf(2);
            docs[0].should.property('path', '/media1.txt');
            docs[1].should.property('path', '/media2.txt');
            done();
          })
          .catch(done);
      });
      it('limit & skip', (done) => {
        Media.retrieve(null, null, 2, 2)
          .then((docs) => {
            docs.should.be.an('array').and.have.lengthOf(2);
            docs[0].should.property('path', '/media3.txt');
            docs[1].should.property('path', '/media4.txt');
            done();
          })
          .catch(done);
      });
      it('skip', (done) => {
        Media.retrieve(null, null, 0, 1)
          .then((docs) => {
            docs.should.be.an('array').and.have.lengthOf(3);
            docs[0].should.property('path', '/media2.txt');
            docs[1].should.property('path', '/media3.txt');
            docs[2].should.property('path', '/media4.txt');
            done();
          })
          .catch(done);
      });
    });
    it('criteria & pagination', (done) => {
      Media.retrieve('foo', null, 1, 1)
        .then((docs) => {
          docs.should.be.an('array').and.have.lengthOf(1);
          docs[0].should.property('path', '/media2.txt');
          done();
        })
        .catch(done);
    });
  });
});
