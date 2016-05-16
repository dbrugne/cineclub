const should = require('chai').should();

const util = require('../lib/util/tests');
const opts = {
  api: util.tmdbMockup({
    movie: { total_results: 1, results: [{ title: 'Mune Le Gardien De La Lune', year: 2014 }] },
    tv: { total_results: 1, results: [{ title: 'Mad Men', season: 7, episode: 2 }] },
    multi: { total_results: 1, results: [{ title: 'Title 1' }] },
    two: { total_results: 2, results: [{ title: 'Title 2' }, { title: 'Title 1' }] },
    empty: { total_results: 0 },
    known: { total_results: 1, results: [{ title: 'Title 1', media_type: 'movie' }] },
  }),
};
const extract = require('../lib/decorate/extract');

describe('decorate::extract', () => {
  before(util.before);
  beforeEach(util.beforeEach);
  after(util.after);

  it('is function', () => {
    extract.should.be.a('function');
  });
  it('returns promise', () => {
    const promise = extract('/file.mkv', opts);
    promise.should.be.a('promise');
  });
  it('api required', () => extract('/file.mkv').should.be.rejected);

  it('unknown', (done) => {
    extract('/file.mkv', opts)
      .then((r) => {
        should.exist(r);
        r.should.deep.equal({ title: 'Title 1' });
        done();
      })
      .catch(done);
  });
  it('movie', (done) => {
    extract('/Mune.Le.Gardien.De.La.Lune.2014.FRENCH.1080p.BluRay.x264-PiNKPANTERS.mkv', opts)
      .then((r) => {
        should.exist(r);
        r.should.deep.equal({
          title: 'Mune Le Gardien De La Lune',
          category: 'movie',
          year: 2014,
        });
        done();
      })
      .catch(done);
  });
  it('tv', (done) => {
    extract('/Mad.Men.S07E02.VOSTFR.720p.WEB-DL.DD5.1.H.264-FANATiK.mkv', opts)
      .then((r) => {
        should.exist(r);
        r.should.deep.equal({
          title: 'Mad Men',
          category: 'tv',
          season: 7,
          episode: 2,
        });
        done();
      })
      .catch(done);
  });
  it('multi', (done) => {
    extract('/Title.1.FASTSUB.VOSTFR.1080p.HDTV.x264.AAC-GOBO2S.mkv', opts)
      .then((r) => {
        should.exist(r);
        r.should.deep.equal({ title: 'Title 1' });
        done();
      })
      .catch(done);
  });
  it('consider only 1st result', (done) => {
    extract('/two.mkv', opts)
      .then((r) => {
        should.exist(r);
        r.should.be.an('object')
          .and.property('title', 'Title 2');
        done();
      })
      .catch(done);
  });
  it('no result from API', (done) => {
    extract('/empty.mkv', opts)
      .then((r) => {
        should.not.exist(r);
        done();
      })
      .catch(done);
  });
  it('get from cache', (done) => {
    const path = '/Mune.Le.Gardien.De.La.Lune.2014.FRENCH.1080p.BluRay.x264-PiNKPANTERS.mkv';
    extract(path, opts)
      .then(noCache => {
        should.exist(noCache);
        noCache.should.deep.equal({
          title: 'Mune Le Gardien De La Lune',
          category: 'movie',
          year: 2014,
        });

        extract(path, opts)
          .then((withCache) => {
            should.exist(withCache);
            withCache.should.deep.equal({
              title: 'Mune Le Gardien De La Lune',
              category: 'movie',
              year: 2014,
              from_cache: true,
            });
            done();
          })
          .catch(done);
      })
      .catch(done);
  });
  describe('category', () => {
    it('series/', (done) => {
      extract('/series/unknown.mkv', opts)
        .then((r) => {
          should.exist(r);
          r.should.be.an('object')
            .and.property('category', 'tv');
          done();
        })
        .catch(done);
    });
    it('multi search', (done) => {
      extract('/known.mkv', opts)
        .then((r) => {
          should.exist(r);
          r.should.be.an('object')
            .and.property('category', 'movie');
          done();
        })
        .catch(done);
    });
  });
});
