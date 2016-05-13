const chai = require('chai');
chai.should();

const diff = require('../lib/sync/diff');

describe('sync::diff', () => {
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
  it('added', () => {
    diff(twoFiles, []).should.deep.equal({ added: twoFiles, removed: [] });
    diff(twoFiles, twoFiles).should.deep.equal({ added: [], removed: [] });
    diff(twoFiles, oneFile).should.deep.equal({ added: [{ path: 'dir/file2.mkv' }], removed: [] });
  });
  it('removed', () => {
    diff([], twoFiles).should.deep.equal({ added: [], removed: twoFiles });
    diff(twoFiles, twoFiles).should.deep.equal({ added: [], removed: [] });
    diff(oneFile, twoFiles).should.deep.equal({ added: [], removed: [{ path: 'dir/file2.mkv' }] });
  });
});
