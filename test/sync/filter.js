const { should } = require('../../lib/util/tests');

const filter = require('../../lib/sync/filter');

describe('sync/filter', () => {
  it('is function', () => {
    filter.should.be.a('function');
  });
  it('empty call', () => {
    should.not.exist(filter());
  });
  it('filter', () => {
    const r = filter([
      { path: 'file1.txt', file: { ext: 'txt' } },
      { path: 'file1.mkv', file: { ext: 'mkv' } },
      { path: 'file1.MKV', file: { ext: 'MKV' } },
      { path: 'file.mkv.txt', file: { ext: 'txt' } },
      { path: 'file1', file: { ext: '' } },
    ]);

    r.should.be.an('array');
    r.length.should.equal(2);
    r[0].should.property('path', 'file1.mkv');
    r[1].should.property('path', 'file1.MKV');

    r[0].should.property('file');
    r[0].file.should.property('ext', 'mkv');
  });
});
