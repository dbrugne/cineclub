const should = require('chai').should();

const fixtures = require('../fixtures/data');

const parser = require('../../lib/decorate/parse');

describe('decorate/parse', () => {
  it('is function', () => {
    parser.should.be.a('function');
  });
  it('invalid', () => {
    const r = parser(fixtures.torrent.invalid.file);
    r.should.be.an('object');
    r.should.deep.equal(fixtures.torrent.invalid.result);
  });
  it('valid movie', () => {
    const r = parser(fixtures.torrent.movie.file);
    r.should.be.an('object');
    r.should.deep.equal(fixtures.torrent.movie.result);
  });
  it('valid tv', () => {
    const p = fixtures.torrent.tv.file;
    const r = parser(p);
    r.should.be.an('object');
    r.should.deep.equal(fixtures.torrent.tv.result);
  });
  it('no dot', () => {
    const r = parser(fixtures.torrent.nodot.file);
    r.should.be.an('object');
    r.should.deep.equal(fixtures.torrent.nodot.result);
  });
  it('parent parsing', () => {
    const r = parser(fixtures.torrent.parent.file);
    r.should.be.an('object');
    r.should.deep.equal(fixtures.torrent.parent.result);
  });
});
