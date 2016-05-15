const chai = require('chai');
chai.should();

const parser = require('../lib/util/parse');

describe('util::parse', () => {
  it('is function', () => {
    parser.should.be.a('function');
  });

  it('valid movie', () => {
    const r = parser('dir/subdir/Divergente.2.2015.TRUEFRENCH.720p.mHD.AC3.x264-ROMKENT.mkv');
    r.should.be.an('object');
    r.should.deep.equal({
      year: 2015,
      resolution: '720p',
      codec: 'x264',
      audio: 'AC3',
      group: 'ROMKENT',
      title: 'Divergente 2',
      excess: [
        'TRUEFRENCH',
        'mHD',
      ],
    });
  });

  it('valid tv', () => {
    const p = 'dir/sub/The.Big.Bang.Theory.S09E18.FASTSUB.VOSTFR.1080p.HDTV.x264.AAC-GOBO2S.mkv';
    const r = parser(p);
    r.should.be.an('object');
    r.should.deep.equal({
      season: 9,
      episode: 18,
      resolution: '1080p',
      quality: 'TS',
      codec: 'x264',
      audio: 'AAC',
      group: 'GOBO2S',
      title: 'The Big Bang Theory',
      excess: [
        'FASUB.VOSTFR',
        'HDTV',
      ],
    });
  });

  it('no dot', () => {
    const r = parser('Divergente 2 2015 TRUEFRENCH 720p mHD AC3 x264 ROMKENT.mkv');
    r.should.be.an('object');
    r.should.deep.equal({
      year: 2015,
      resolution: '720p',
      codec: 'x264',
      audio: 'AC3',
      title: 'Divergente 2',
      group: 'ROMKENT',
      excess: [
        'TRUEFRENCH',
        'mHD',
      ],
    });
  });

  it('parent parsing', () => {
    const r = parser('Braquo.S03E08.FiNAL.FRENCH.720p.BluRay.x264-JMT/episode.mkv');
    r.should.be.an('object');
    r.should.deep.equal({
      season: 3,
      episode: 8,
      resolution: '720p',
      quality: 'BluRay',
      codec: 'x264',
      group: 'JMT',
      title: 'Braquo',
      episodeName: 'FiNAL FRENCH',
    });
  });

  it('invalid', () => {
    const r = parser('invalid.mkv');
    r.should.be.an('object');
    r.should.deep.equal({});
  });
});
