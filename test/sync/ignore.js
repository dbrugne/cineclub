const should = require('chai').should();

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
    ignore(`${fixtures}foo`).should.be.true;
    ignore(`${fixtures}/foo`).should.be.true;
    ignore(`${fixtures}/bar/foo`).should.be.true;
    ignore(`${fixtures}/bar/foo/bar.txt`).should.be.true;
    ignore(`${fixtures}/bar/bar/bar.foo`).should.be.true;
    ignore(`${fixtures}/bar/bar.txt`).should.be.false;
  });
  it('wildcard rule', () => {
    const ignore = factory('foo*bar', fixtures);
    ignore(`${fixtures}/foo/bar`).should.be.true;
    ignore(`${fixtures}/foobar`).should.be.true;
    ignore(`${fixtures}/foo/bar.txt`).should.be.true;
    ignore(`${fixtures}/foo_file_bar.txt`).should.be.true;

    ignore(`${fixtures}/foo`).should.be.false;
    ignore(`${fixtures}/bar`).should.be.false;
  });
  it('directory rule', () => {
    const ignore = factory('/foo', fixtures);
    ignore(`${fixtures}/foo`).should.be.true;
    ignore(`${fixtures}/foo/`).should.be.true;
    ignore(`${fixtures}/foo/file1.txt`).should.be.true;
    ignore(`${fixtures}/fo1`).should.be.false;
    ignore(`${fixtures}/fo1/file1.txt`).should.be.false;
    ignore(`${fixtures}/bar/foo/file1.txt`).should.be.false;
  });
  it('1+ rules', () => {
    const ignore = factory('/foo,bar', fixtures);
    ignore(`${fixtures}/foo`).should.be.true;
    ignore(`${fixtures}/bar`).should.be.true;
    ignore(`${fixtures}/test/bar.txt`).should.be.true;
    ignore(`${fixtures}/foo/bar.txt`).should.be.true;
    ignore(`${fixtures}/test/foo.txt`).should.be.false;
  });
});
