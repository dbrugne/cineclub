const chai = require('chai');
chai.should();

const Ignore = require('../lib/sync/ignore');
const fixtures = '/sub/dir';

describe('sync::ignore', function () {
  it('is function', () => {
    Ignore.should.be.a('function');
  });
  it('return function', () => {
    Ignore().should.be.a('function');
  });

  it('ignore regular rule', () => {
    const ignore = new Ignore('foo', fixtures);
    ignore(fixtures + 'foo').should.be.true;
    ignore(fixtures + '/foo').should.be.true;
    ignore(fixtures + '/bar/foo').should.be.true;
    ignore(fixtures + '/bar/foo/bar.txt').should.be.true;
    ignore(fixtures + '/bar/bar/bar.foo').should.be.true;
    ignore(fixtures + '/bar/bar.txt').should.be.false;
  });

  it('ignore wildcard rule', () => {
    const ignore = new Ignore('foo*bar', fixtures);
    ignore(fixtures + '/foo/bar').should.be.true;
    ignore(fixtures + '/foobar').should.be.true;
    ignore(fixtures + '/foo/bar.txt').should.be.true;
    ignore(fixtures + '/foo_file_bar.txt').should.be.true;

    ignore(fixtures + '/foo').should.be.false;
    ignore(fixtures + '/bar').should.be.false;
  });

  it('ignore directory rule', () => {
    const ignore = new Ignore('/foo', fixtures);
    ignore(fixtures + '/foo').should.be.true;
    ignore(fixtures + '/foo/').should.be.true;
    ignore(fixtures + '/foo/file1.txt').should.be.true;
    ignore(fixtures + '/fo1').should.be.false;
    ignore(fixtures + '/fo1/file1.txt').should.be.false;
    ignore(fixtures + '/bar/foo/file1.txt').should.be.false;
  });

  it('ignore 1+ rules', () => {
    const ignore = new Ignore('/foo,bar', fixtures);
    ignore(fixtures + '/foo').should.be.true;
    ignore(fixtures + '/bar').should.be.true;
    ignore(fixtures + '/test/bar.txt').should.be.true;
    ignore(fixtures + '/foo/bar.txt').should.be.true;
    ignore(fixtures + '/test/foo.txt').should.be.false;
  });
});
