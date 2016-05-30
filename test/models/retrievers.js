const { beforeHelper, beforeEachHelper, afterHelper } = require('../../lib/util/tests');

const Media = require('../../lib/models/media');

describe('models/media:retrieve', () => {
  before(beforeHelper);
  beforeEach((done) => {
    beforeEachHelper(() => {
      Media.collection.insert([
        {
          path: '/media1.txt',
          created: new Date(),
          file: {},
        },
        {
          path: '/media2.txt',
          created: new Date(),
          file: {},
        },
        {
          path: '/media3.txt',
          created: new Date(),
          file: {},
        },
        {
          path: '/media4.txt',
          created: new Date(),
          file: {},
        },
        {
          path: '/removed.txt',
          created: new Date(),
          removed: new Date(),
          file: {},
        },
      ]).then(() => done());
    });
  });
  after(afterHelper);

  it('is object and has expected functions', () => {
    Media.should.be.an('function').and.property('schema');
    Media.countAll.should.be.a('function');
    Media.retrieve.should.be.a('function');
  });
  it('countAll', (done) => {
    Media.countAll()
      .then((count) => {
        count.should.equal(4);
        done();
      })
      .catch(done);
  });
  describe('retrieve', () => {
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
      Media.retrieve(2, 0)
        .then((docs) => {
          docs.should.be.an('array').and.have.lengthOf(2);
          docs[0].should.property('path', '/media1.txt');
          docs[1].should.property('path', '/media2.txt');
          done();
        })
        .catch(done);
    });
    it('limit & skip', (done) => {
      Media.retrieve(2, 2)
        .then((docs) => {
          docs.should.be.an('array').and.have.lengthOf(2);
          docs[0].should.property('path', '/media3.txt');
          docs[1].should.property('path', '/media4.txt');
          done();
        })
        .catch(done);
    });
    it('skip', (done) => {
      Media.retrieve(0, 1)
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
});
