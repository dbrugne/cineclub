const should = require('chai').should();

const path = require('path');
const fs = require('fs');
const tree = require('../../lib/sync/tree');
const Filesystem = require('../../lib/sync/filesystem');
const factory = require('../../lib/sync/ignore');

const fixtures = path.join(__dirname, '../fixtures/remote');

describe('sync/tree', () => {
  before(done => {
    // git doesn't version empty dir
    const emptyDir = `${fixtures}/empty`;
    fs.access(emptyDir, fs.F_OK, (notExists) => {
      if (notExists) {
        fs.mkdirSync(emptyDir);
      }

      // check that folder is really empty
      const existingFiles = fs.readdirSync(emptyDir);
      if (existingFiles.length) {
        return done(new Error('empty/ is not empty'));
      }

      return done();
    });
  });

  it('is function', () => {
    tree.should.be.a('function');
  });
  it('returns promise', () => {
    tree().should.be.a('promise');
  });

  const filesystem = new Filesystem();

  it('file tree', (done) => {
    tree(filesystem, () => {}, fixtures)
      .then(files => {
        files.should.be.an('array');
        files.length.should.equal(3);

        // all files
        files[0].should.property('path');
        files[0].path.replace(fixtures, '').should.equal('/file1.txt');
        files[1].should.property('path');
        files[1].path.replace(fixtures, '').should.equal('/file2.txt');
        files[2].should.property('path');
        files[2].path.replace(fixtures, '').should.equal('/foo/subFile1.txt');

        // meta infos
        files[0].should.property('file');
        files[0].file.should.be.an('object');
        const file = files[0].file;

        file.should.property('size', '0');
        file.should.property('dir', fixtures);
        file.should.property('mtime');
        file.mtime.should.be.a('date');
        file.should.property('base', 'file1.txt');
        file.should.property('ext', '.txt');
        file.should.property('name', 'file1');

        done();
      })
      .catch(err => done(new Error(err)));
  });

  it('ignore', (done) => {
    const ignore = factory('/foo', fixtures);
    tree(filesystem, ignore, fixtures)
      .then(files => {
        files.should.be.an('array');
        files.length.should.equal(2);
        done();
      })
      .catch(err => done(new Error(err)));
  });
});
