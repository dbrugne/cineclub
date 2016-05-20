const chai = require('chai');
const should = chai.should();
chai.use(require('chai-properties'));

const diff = require('../../lib/sync/diff');

describe('sync/diff', () => {
  it('is function', () => {
    diff.should.be.a('function');
  });
  it('empty', () => {
    diff([], []).should.deep.equal({ added: [], removed: [] });
  });

  const twoFiles = [
    { path: 'dir/file1.mkv' },
    { path: 'dir/file2.mkv' },
  ];
  const oneFile = [
    { path: 'dir/file1.mkv' },
  ];
  describe('added', () => {
    it('all', () => {
      diff(twoFiles, []).should.deep.equal({ added: twoFiles, removed: [] });
    });
    it('no one', () => {
      diff(twoFiles, twoFiles).should.deep.equal({ added: [], removed: [] });
    });
    it('only one', () => {
      diff(twoFiles, oneFile)
        .should.deep.equal({ added: [{ path: 'dir/file2.mkv' }], removed: [] });
    });
  });
  describe('removed', () => {
    it('all', () => {
      diff([], twoFiles).should.deep.equal({ added: [], removed: twoFiles });
    });
    it('no one', () => {
      diff(twoFiles, twoFiles).should.deep.equal({ added: [], removed: [] });
    });
    it('only one', () => {
      diff(oneFile, twoFiles)
        .should.deep.equal({ added: [], removed: [{ path: 'dir/file2.mkv' }] });
    });
  });
});
