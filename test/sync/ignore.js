require('../../lib/util/tests');

const fixtures = '/sub/dir';

const factory = require('../../lib/sync/ignore');

describe('sync/ignore', () => {
  it('is function', () => {
    factory.should.be.a('function');
  });
  it('return function', () => {
    factory().should.be.a('function');
  });
  it('regular rule', () => {
    const ignore = factory('foo', fixtures);
    ignore(`${fixtures}foo`).should.equal(true);
    ignore(`${fixtures}/foo`).should.equal(true);
    ignore(`${fixtures}/bar/foo`).should.equal(true);
    ignore(`${fixtures}/bar/foo/bar.txt`).should.equal(true);
    ignore(`${fixtures}/bar/bar/bar.foo`).should.equal(true);
    ignore(`${fixtures}/bar/bar.txt`).should.equal(false);
  });
  it('wildcard rule', () => {
    const ignore = factory('foo*bar', fixtures);
    ignore(`${fixtures}/foo/bar`).should.equal(true);
    ignore(`${fixtures}/foobar`).should.equal(true);
    ignore(`${fixtures}/foo/bar.txt`).should.equal(true);
    ignore(`${fixtures}/foo_file_bar.txt`).should.equal(true);

    ignore(`${fixtures}/foo`).should.equal(false);
    ignore(`${fixtures}/bar`).should.equal(false);
  });
  it('directory rule', () => {
    const ignore = factory('/foo', fixtures);
    ignore(`${fixtures}/foo`).should.equal(true);
    ignore(`${fixtures}/foo/`).should.equal(true);
    ignore(`${fixtures}/foo/file1.txt`).should.equal(true);
    ignore(`${fixtures}/fo1`).should.equal(false);
    ignore(`${fixtures}/fo1/file1.txt`).should.equal(false);
    ignore(`${fixtures}/bar/foo/file1.txt`).should.equal(false);
  });
  it('1+ rules', () => {
    const ignore = factory('/foo,bar', fixtures);
    ignore(`${fixtures}/foo`).should.equal(true);
    ignore(`${fixtures}/bar`).should.equal(true);
    ignore(`${fixtures}/test/bar.txt`).should.equal(true);
    ignore(`${fixtures}/foo/bar.txt`).should.equal(true);
    ignore(`${fixtures}/test/foo.txt`).should.equal(false);
  });
});
