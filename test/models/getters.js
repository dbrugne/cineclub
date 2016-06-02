const {
  should,
  beforeHelper,
  beforeEachHelper,
  afterHelper,
  inject,
  fixtures,
} = require('../../lib/util/tests');

const Media = require('../../lib/models/media');

describe('models/media', () => {
  before(beforeHelper);
  beforeEach(done => {
    beforeEachHelper(() => {
      inject(fixtures.models.getters)
        .then(() => done());
    });
  });
  after(afterHelper);

  it('is object and has expected functions', () => {
    const doc = new Media({});
    doc.getPosterUrl.should.be.a('function');
    doc.getGenres.should.be.a('function');
    doc.getApiData.should.be.a('function');
  });
  describe('getPosterUrl', () => {
    it('default size', () => {
      const doc = new Media({
        path: '',
        info: { poster_path: '/9bmXpKDJv2kdtD4QNexErjGTIOz.jpg' },
      });
      doc.getPosterUrl()
        .should.equal('https://image.tmdb.org/t/p/w92/9bmXpKDJv2kdtD4QNexErjGTIOz.jpg');
    });
    it('custom size', () => {
      const doc = new Media({
        path: '',
        info: { poster_path: '/9bmXpKDJv2kdtD4QNexErjGTIOz.jpg' },
      });
      doc.getPosterUrl(92)
        .should.equal('https://image.tmdb.org/t/p/w92/9bmXpKDJv2kdtD4QNexErjGTIOz.jpg');
      doc.getPosterUrl(154)
        .should.equal('https://image.tmdb.org/t/p/w154/9bmXpKDJv2kdtD4QNexErjGTIOz.jpg');
    });
    it('default poster', () => {
      const withoutInfo = new Media({
        path: '',
      });
      withoutInfo.getPosterUrl().should.equal('http://placehold.it/92?text=no+image');
      withoutInfo.getPosterUrl(154).should.equal('http://placehold.it/154?text=no+image');

      const withoutPoster = new Media({
        path: '',
        info: {},
      });
      withoutPoster.getPosterUrl().should.equal('http://placehold.it/92?text=no+image');
    });
  });
  describe('getGenres', () => {
    it('no info', () => {
      const doc = new Media({
        path: '',
      });
      doc.getGenres().should.be.an('array').and.have.lengthOf(0);
    });
    it('no info.genre_ids', () => {
      const doc = new Media({
        path: '',
        info: {},
      });
      doc.getGenres().should.be.an('array').and.have.lengthOf(0);
    });
    it('empty info.genre_ids', () => {
      const doc = new Media({
        path: '',
        info: { genre_ids: [] },
      });
      doc.getGenres().should.be.an('array').and.have.lengthOf(0);
    });
    it('unknow category', () => {
      const doc = new Media({
        path: '',
        info: { category: 'person', genre_ids: [28] },
      });
      doc.getGenres().should.be.an('array').and.have.lengthOf(0);
    });
    it('unknow genre', () => {
      const doc = new Media({
        path: '',
        info: { category: 'movie', genre_ids: [-1] },
      });
      doc.getGenres().should.be.an('array').and.have.lengthOf(0);
    });
    it('one movie genre', () => {
      const doc = new Media({
        path: '',
        info: { category: 'movie', genre_ids: [28] },
      });
      const genres = doc.getGenres();
      should.exist(genres);
      genres.should.deep.equal(['Action']);
    });
    it('n genres', () => {
      const doc = new Media({
        path: '',
        info: { category: 'movie', genre_ids: [28, 12] },
      });
      const genres = doc.getGenres();
      should.exist(genres);
      genres.should.deep.equal(['Action', 'Adventure']);
    });
    it('one tv genre', () => {
      const doc = new Media({
        path: '',
        info: { category: 'tv', genre_ids: [16] },
      });
      const genres = doc.getGenres();
      should.exist(genres);
      genres.should.deep.equal(['Animation']);
    });
  });
  describe('getApiData', () => {
    it('empty', () => {
      const doc = new Media({});
      const data = doc.getApiData();
      data.should.be.an('object').and.have.properties({
        id: doc.id,
        category: 'unknown',
        poster: 'http://placehold.it/342?text=no+image',
        removed: false,
      });
      data.should.not.have.property('genres');
      data.should.not.have.property('size');
    });
    it('simple fields', () => {
      const data = new Media({
        path: '/path/to/file.mkv',
        file: {
          dir: '/path/to',
          base: 'file.mkv',
        },
        info: {
          popularity: '1.000',
          excess: 'MULTI',
        },
      }).getApiData();
      data.should.have.properties({
        path: '/path/to/file.mkv',
        poster: 'http://placehold.it/342?text=no+image',
        dir: '/path/to',
        base: 'file.mkv',
        popularity: '1.000',
        language: 'MULTI',
      });
    });
    it('created', () => {
      const date = new Date();
      new Media({ created: date }).getApiData().should.have.property('created', date.toISOString());
    });
    it('removed', () => {
      new Media({}).getApiData().should.have.property('removed', false);
      const date = new Date();
      new Media({ removed: date }).getApiData().should.have.property('removed', date.toISOString());
    });
    it('category', () => {
      new Media({ info: { category: 'movie' } }).getApiData()
        .should.have.property('category', 'movie');
      new Media({ info: { category: 'tv' } }).getApiData()
        .should.have.property('category', 'tv');
      new Media({ info: { category: 'other' } }).getApiData()
        .should.have.property('category', 'unknown');
      new Media({}).getApiData()
        .should.have.property('category', 'unknown');
    });
    it('titles', () => {
      let data;
      // movie + title + original
      data = new Media({
        info: {
          category: 'movie',
          title: 'Title 1',
          original_title: 'Original title 1',
        },
      }).getApiData();
      data.should.have.property('title', 'Title 1');
      data.should.have.property('original_title', 'Original title 1');
      // movie + title
      data = new Media({
        info: {
          category: 'movie',
          title: 'Title 1',
        },
      }).getApiData();
      data.should.have.property('title', 'Title 1');
      data.should.not.have.property('original_title');
      // movie + title + same original
      data = new Media({
        info: {
          category: 'movie',
          title: 'Title 1',
          original_title: 'Title 1',
        },
      }).getApiData();
      data.should.have.property('title', 'Title 1');
      data.should.not.have.property('original_title');
      // tv + title + original
      data = new Media({
        info: {
          category: 'tv',
          name: 'Title 1',
          original_name: 'Original title 1',
        },
      }).getApiData();
      data.should.have.property('title', 'Title 1');
      data.should.have.property('original_title', 'Original title 1');
      // tv + title
      data = new Media({
        info: {
          category: 'tv',
          name: 'Title 1',
        },
      }).getApiData();
      data.should.have.property('title', 'Title 1');
      data.should.not.have.property('original_title');
      // tv + title + same original
      data = new Media({
        info: {
          category: 'tv',
          name: 'Title 1',
          original_name: 'Title 1',
        },
      }).getApiData();
      data.should.have.property('title', 'Title 1');
      data.should.not.have.property('original_title');
    });
    it('season / episode', () => {
      new Media({
        info: {
          category: 'tv',
          season: '1',
          episode: '1',
        },
      }).getApiData().should.have.properties({
        season: '1',
        episode: '1',
      });
    });
    it('year', () => {
      new Media({
        info: {
          category: 'movie',
          release_date: '2016-01-01',
        },
      }).getApiData().should.have.properties({ year: '2016' });
    });
    it('genres', () => {
      new Media({
        info: {
          category: 'movie',
          genre_ids: [16, 22, 5, 99],
        },
      }).getApiData().should.have.properties({ genres: 'Animation, Documentary' });
      new Media({
        info: {
          category: 'movie',
          genre_ids: [22],
        },
      }).getApiData().should.not.have.property('genres');
    });
    it('votes', () => {
      new Media({
        info: {
          vote_average: 5.3000,
          vote_count: 10,
        },
      }).getApiData().should.have.properties({ votes: '5.3/10 on 10 vote(s)' });
      new Media({ info: { vote_average: 5.3000 } }).getApiData().should.not.have.property('votes');
      new Media({ info: { vote_count: 10 } }).getApiData().should.not.have.property('votes');
      new Media({ info: { vote_average: 10, vote_count: 0 } }).getApiData()
        .should.have.property('votes', '0 vote');
    });
    it('codec', () => {
      new Media({ info: { codec: 'MP4', audio: 'AC3' } }).getApiData()
        .should.have.property('codec', 'MP4, AC3');
      new Media({ info: { codec: 'MP4' } }).getApiData().should.have.property('codec', 'MP4');
      new Media({ info: { audio: 'AC3' } }).getApiData().should.have.property('codec', 'AC3');
    });
    it('quality', () => {
      new Media({ info: { quality: 'bluray', resolution: '1080p' } }).getApiData()
        .should.have.property('quality', 'bluray, 1080p');
      new Media({ info: { quality: 'bluray' } }).getApiData()
        .should.have.property('quality', 'bluray');
      new Media({ info: { resolution: '1080p' } }).getApiData()
        .should.have.property('quality', '1080p');
    });
    it('size', () => {
      new Media({ file: {} }).getApiData().should.not.have.property('size');
      new Media({ file: { size: 0 } }).getApiData().should.have.property('size', 0);
      new Media({ file: { size: 14 } }).getApiData().should.have.property('size', '14o');
      new Media({ file: { size: 1024 + 134 } }).getApiData().should.have.property('size', '1.13ko');
      new Media({ file: { size: 1024 * 1024 + 134000 } }).getApiData()
        .should.have.property('size', '1.13Mo');
      new Media({ file: { size: 1024 * 1024 * 1024 + 134000000 } }).getApiData()
        .should.have.property('size', '1.12Go');
    });
  });
});
