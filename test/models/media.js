const should = require('chai').should();

const util = require('../../lib/util/tests');
const Media = require('../../lib/models/media');

describe('models/cache', () => {
  before(util.before);
  beforeEach((done) => {
    util.beforeEach(() => {
      const timestamp = Date.now();
      Media.collection.insert([
        {
          path: '/added.txt',
          created: new Date(),
          file: {},
        },
        {
          path: '/old.txt',
          created: new Date(timestamp - 1000 * 3600 * 24 * 2),
          file: {},
        },
        {
          path: '/removed.txt',
          created: new Date(),
          removed: new Date(),
          file: {},
        },
        {
          path: '/purge.txt',
          created: new Date(),
          removed: new Date(timestamp - 1000 * 3600 * 24 * 8),
          file: {},
        },
        {
          path: '/purge_other.txt',
          created: new Date(),
          removed: new Date(timestamp - 1000 * 3600 * 24 * 10),
          file: {},
        },
      ]).then(() => done());
    });
  });
  after(util.after);

  it('is object and has expected functions', () => {
    Media.should.be.an('function').and.property('schema');
    Media.retrieveActive.should.be.a('function');
    Media.retrieveAdded.should.be.a('function');
    Media.retrieveRemoved.should.be.a('function');
    Media.createNewMedias.should.be.a('function');
    Media.tagRemoved.should.be.a('function');
    Media.purge.should.be.a('function');

    const doc = new Media({});
    doc.addInfo.should.be.a('function');
  });
  it('retrieveActive', (done) => {
    Media.retrieveActive()
      .then((docs) => {
        docs.should.be.an('array');
        docs.length.should.equal(2);
        docs[0].should.property('path', '/added.txt');
        docs[1].should.property('path', '/old.txt');
        done();
      })
      .catch(done);
  });
  it('retrieveAdded', (done) => {
    Media.retrieveAdded(1)
      .then((docs) => {
        docs.should.be.an('array');
        docs.length.should.equal(1);
        docs[0].should.property('path', '/added.txt');
        done();
      })
      .catch(done);
  });
  it('retrieveRemoved', (done) => {
    Media.retrieveRemoved(1)
      .then((docs) => {
        docs.should.be.an('array');
        docs.length.should.equal(1);
        docs[0].should.property('path', '/removed.txt');
        done();
      })
      .catch(done);
  });
  it('createNewMedias', (done) => {
    const list = [
      {
        path: '/title1',
        file: {
          mtime: new Date(Date.now() - 1000 * 3600 * 1),
        },
      },
      {
        path: '/title2',
        file: {
          mtime: new Date(Date.now() - 1000 * 3600 * 2),
        },
      },
    ];
    Media.createNewMedias(list)
      .then(result => {
        result.result.ok.should.equal(1);
        Media.find({ path: { $in: ['/title1', '/title2'] } }).exec()
          .then(docs => {
            docs.should.be.an('array');
            docs.length.should.equal(2);

            // doc 1
            docs[0].isNew.should.be.false;
            docs[0].should.property('path', list[0].path);
            docs[0].created.getTime().should.equal(list[0].file.mtime.getTime());
            docs[0].file.should.deep.equal(list[0].file);

            // doc 2
            docs[1].isNew.should.be.false;
            docs[1].should.property('path', list[1].path);
            docs[1].created.getTime().should.equal(list[1].file.mtime.getTime());
            docs[1].file.should.deep.equal(list[1].file);

            done();
          })
          .catch(done);
      })
      .catch(done);
  });
  it('tagRemoved', (done) => {
    Media.tagRemoved([{ path: '/added.txt' }])
      .then(() => {
        Media.retrieveRemoved(1)
          .then((docs) => {
            docs.should.be.an('array');
            docs.length.should.equal(2);
            docs[0].should.property('path', '/added.txt');
            docs[1].should.property('path', '/removed.txt');
            done();
          })
          .catch(done);
      })
      .catch(done);
  });
  it('purge', (done) => {
    Media.purge()
      .then(() => Media.find({}).exec())
      .then((docs) => {
        docs.should.be.an('array');
        docs.length.should.equal(3);
        done();
      })
      .catch(done);
  });
  it('addInfo', (done) => {
    const info = { title: 'Title 1' };
    let docWithoutInfo;
    Media.findOne({ path: '/added.txt' }).exec()
      .then(doc => {
        docWithoutInfo = doc;
        return doc.addInfo(info);
      })
      .then(docWithInfo => {
        should.exist(docWithInfo);
        docWithInfo.info.should.deep.equal(info);
        (docWithoutInfo === docWithInfo).should.true; // same object
        done();
      })
      .catch(done);
  });
  it('poster', () => {
    const withPoster = new Media({
      path: '',
      info: { poster_path: '/9bmXpKDJv2kdtD4QNexErjGTIOz.jpg' },
    });
    withPoster.getPosterUrl()
      .should.equal('https://image.tmdb.org/t/p/w92/9bmXpKDJv2kdtD4QNexErjGTIOz.jpg');
    withPoster.getPosterUrl(92)
      .should.equal('https://image.tmdb.org/t/p/w92/9bmXpKDJv2kdtD4QNexErjGTIOz.jpg');
    withPoster.getPosterUrl(154)
      .should.equal('https://image.tmdb.org/t/p/w154/9bmXpKDJv2kdtD4QNexErjGTIOz.jpg');

    const withoutInfo = new Media({
      path: '',
    });
    should.not.exist(withoutInfo.getPosterUrl());

    const withoutPoster = new Media({
      path: '',
      info: {},
    });
    should.not.exist(withoutInfo.getPosterUrl());
  });
});
