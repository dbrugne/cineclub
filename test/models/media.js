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
      inject(fixtures.models.media)
        .then(() => done());
    });
  });
  after(afterHelper);

  it('is object and has expected functions', () => {
    Media.should.be.an('function').and.property('schema');
    Media.countAll.should.be.a('function');
    Media.retrieve.should.be.a('function');
    Media.retrieveActive.should.be.a('function');
    Media.retrieveForDecoration.should.be.a('function');
    Media.retrieveAdded.should.be.a('function');
    Media.retrieveRemoved.should.be.a('function');
    Media.createNewMedias.should.be.a('function');
    Media.tagRemoved.should.be.a('function');
    Media.purge.should.be.a('function');

    const doc = new Media({});
    doc.setDecoration.should.be.a('function');
    doc.shouldDecorate.should.be.a('function');
    doc.getPosterUrl.should.be.a('function');
    doc.getGenres.should.be.a('function');
    doc.getApiData.should.be.a('function');
  });
  it('retrieveActive', done => {
    Media.retrieveActive()
      .then(docs => {
        docs.should.be.an('array');
        docs.length.should.equal(2);
        docs[0].should.property('path', '/added.txt');
        docs[1].should.property('path', '/old.txt');
        done();
      })
      .catch(done);
  });
  it('retrieveForDecoration', done => {
    Media.retrieveForDecoration()
      .then(docs => {
        docs.should.be.an('array');
        docs.length.should.equal(1);
        docs[0].should.property('path', '/added.txt');
        done();
      })
      .catch(done);
  });
  it('retrieveAdded', done => {
    Media.retrieveAdded(1)
      .then(docs => {
        docs.should.be.an('array');
        docs.length.should.equal(1);
        docs[0].should.property('path', '/added.txt');
        done();
      })
      .catch(done);
  });
  it('retrieveRemoved', done => {
    Media.retrieveRemoved(1)
      .then(docs => {
        docs.should.be.an('array');
        docs.length.should.equal(1);
        docs[0].should.property('path', '/removed.txt');
        done();
      })
      .catch(done);
  });
  it('createNewMedias', done => {
    const list = [
      {
        path: '/title1',
        file: {
          mtime: new Date(Date.now() - 1000 * 3600),
        },
      },
      {
        path: '/title2',
        file: {
          mtime: new Date(Date.now() - 1000 * 3600 * 2),
        },
      },
    ];
    Media.createNewMedias(list)
      .then(result => {
        result.result.ok.should.equal(1);
        Media.find({ path: { $in: ['/title1', '/title2'] } }).exec()
          .then(docs => {
            docs.should.be.an('array').and.have.lengthOf(2);

            // doc 1
            docs[0].should.have.property('isNew', false);
            docs[0].should.have.property('path', list[0].path);
            docs[0].should.have.property('decoration', 'undecorated');
            docs[0].should.have.property('file').that.have.properties(list[0].file);
            docs[0].created.getTime().should.equal(list[0].file.mtime.getTime());

            // doc 2
            docs[1].should.have.property('isNew', false);
            docs[1].should.have.property('path', list[1].path);
            docs[1].should.have.property('decoration', 'undecorated');
            docs[1].should.have.property('file').that.have.properties(list[1].file);
            docs[1].created.getTime().should.equal(list[1].file.mtime.getTime());

            done();
          })
          .catch(done);
      })
      .catch(done);
  });
  it('tagRemoved', done => {
    Media.tagRemoved([{ path: '/added.txt' }])
      .then(() => {
        Media.retrieveRemoved(1)
          .then(docs => {
            docs.should.be.an('array').and.have.lengthOf(2);
            docs[0].should.property('path', '/added.txt');
            docs[1].should.property('path', '/removed.txt');
            done();
          })
          .catch(done);
      })
      .catch(done);
  });
  it('purge', done => {
    Media.purge()
      .then(() => Media.find({}).exec())
      .then(docs => {
        docs.should.be.an('array');
        docs.length.should.equal(3);
        done();
      })
      .catch(done);
  });
  describe('setDecoration', () => {
    it('decorated', done => {
      const info = { title: 'Title 1', category: 'movie' };
      let docWithoutInfo;
      Media.findOne({ path: '/added.txt' }).exec()
        .then(doc => {
          docWithoutInfo = doc;
          return doc.setDecoration(info);
        })
        .then(docWithInfo => {
          should.exist(docWithInfo);
          docWithInfo.should.have.property('decoration', 'decorated');
          docWithInfo.should.have.property('info').that.have.properties(info);
          docWithoutInfo.should.equal(docWithInfo);
          done();
        })
        .catch(done);
    });
    it('failed (unknown category)', done => {
      const info = { title: 'Title 1', category: 'other' };
      let docWithoutInfo;
      Media.findOne({ path: '/added.txt' }).exec()
        .then(doc => {
          docWithoutInfo = doc;
          return doc.setDecoration(info);
        })
        .then(docWithInfo => {
          should.exist(docWithInfo);
          docWithInfo.should.have.property('decoration', 'failed');
          docWithInfo.should.have.property('info').that.have.properties(info);
          docWithoutInfo.should.equal(docWithInfo);
          done();
        })
        .catch(done);
    });
    it('failed (empty)', done => {
      let docWithoutInfo;
      Media.findOne({ path: '/added.txt' }).exec()
        .then(doc => {
          docWithoutInfo = doc;
          return doc.setDecoration({});
        })
        .then(docWithInfo => {
          should.exist(docWithInfo);
          docWithInfo.should.have.property('decoration', 'failed');
          docWithInfo.should.have.property('info', undefined);
          docWithoutInfo.should.equal(docWithInfo);
          done();
        })
        .catch(done);
    });
  });
  describe('shouldDecorate', () => {
    it('has info', () => {
      const doc = new Media({ decoration: 'anyvalue', info: {} });
      doc.shouldDecorate().should.equal(false);
    });
    it('is decorated', () => {
      const doc = new Media({ decoration: 'decorated', info: {} });
      doc.shouldDecorate().should.equal(false);
    });
    it('is failed', () => {
      const doc = new Media({ decoration: 'failed', info: {} });
      doc.shouldDecorate().should.equal(false);
    });
    it('isn\'t decorated', () => {
      const doc = new Media({ decoration: 'undecorated' });
      doc.shouldDecorate().should.equal(true);
    });
    it('empty', () => {
      const doc = new Media({});
      doc.shouldDecorate().should.equal(true);
    });
  });
  describe('countAll', () => {
    beforeEach(done => {
      beforeEachHelper(() => {
        inject(fixtures.models.retrievers)
          .then(() => done());
      });
    });
    it('no parameters', done => {
      Media.countAll()
        .then((count) => {
          count.should.equal(4);
          done();
        })
        .catch(done);
    });
    it('search', done => {
      Media.countAll('foo')
        .then((count) => {
          count.should.equal(2);
          done();
        })
        .catch(done);
    });
    it('category', done => {
      Media.countAll(null, 'movie')
        .then((count) => {
          count.should.equal(1);
          done();
        })
        .catch(done);
    });
    it('search & category', done => {
      Media.countAll('foo', 'movie')
        .then((count) => {
          count.should.equal(1);
          done();
        })
        .catch(done);
    });
  });
  describe('retrieve', () => {
    beforeEach(done => {
      beforeEachHelper(() => {
        inject(fixtures.models.retrievers)
          .then(() => done());
      });
    });
    it('search', done => {
      Media.retrieve('foo')
        .then(docs => {
          docs.should.be.an('array').and.have.lengthOf(2);
          docs[0].should.property('path', '/media2.txt');
          docs[1].should.property('path', '/media1.txt');
          done();
        })
        .catch(done);
    });
    it('type (decorated)', done => {
      Media.retrieve(null, 'decorated')
        .then(docs => {
          docs.should.be.an('array').and.have.lengthOf(2);
          docs[0].should.property('path', '/media3.txt');
          docs[1].should.property('path', '/media1.txt');
          done();
        })
        .catch(done);
    });
    it('type (movie)', done => {
      Media.retrieve(null, 'movie')
        .then(docs => {
          docs.should.be.an('array').and.have.lengthOf(1);
          docs[0].should.property('path', '/media1.txt');
          done();
        })
        .catch(done);
    });
    it('type (undecorated)', done => {
      Media.retrieve(null, 'undecorated')
        .then(docs => {
          docs.should.be.an('array').and.have.lengthOf(1);
          docs[0].should.property('path', '/media4.txt');
          done();
        })
        .catch(done);
    });
    it('type (failed)', done => {
      Media.retrieve(null, 'failed')
        .then(docs => {
          docs.should.be.an('array').and.have.lengthOf(1);
          docs[0].should.property('path', '/media2.txt');
          done();
        })
        .catch(done);
    });
    it('search & category', done => {
      Media.retrieve('foo', 'movie')
        .then(docs => {
          docs.should.be.an('array').and.have.lengthOf(1);
          docs[0].should.property('path', '/media1.txt');
          done();
        })
        .catch(done);
    });
    it('no parameters', done => {
      Media.retrieve()
        .then(docs => {
          docs.should.be.an('array').and.have.lengthOf(4);
          docs[0].should.property('path', '/media4.txt');
          docs[1].should.property('path', '/media3.txt');
          docs[2].should.property('path', '/media2.txt');
          docs[3].should.property('path', '/media1.txt');
          done();
        })
        .catch(done);
    });
    it('limit', done => {
      Media.retrieve(null, null, 2, 0)
        .then(docs => {
          docs.should.be.an('array').and.have.lengthOf(2);
          docs[0].should.property('path', '/media4.txt');
          docs[1].should.property('path', '/media3.txt');
          done();
        })
        .catch(done);
    });
    it('limit & skip', done => {
      Media.retrieve(null, null, 2, 2)
        .then(docs => {
          docs.should.be.an('array').and.have.lengthOf(2);
          docs[0].should.property('path', '/media2.txt');
          docs[1].should.property('path', '/media1.txt');
          done();
        })
        .catch(done);
    });
    it('skip', done => {
      Media.retrieve(null, null, 0, 1)
        .then(docs => {
          docs.should.be.an('array').and.have.lengthOf(3);
          docs[0].should.property('path', '/media3.txt');
          docs[1].should.property('path', '/media2.txt');
          docs[2].should.property('path', '/media1.txt');
          done();
        })
        .catch(done);
    });
    it('search & pagination', done => {
      Media.retrieve('foo', null, 1, 1)
        .then(docs => {
          docs.should.be.an('array').and.have.lengthOf(1);
          docs[0].should.property('path', '/media1.txt');
          done();
        })
        .catch(done);
    });
  });
  describe('text search', () => {
    beforeEach(done => {
      beforeEachHelper(() => {
        inject(fixtures.models.text)
          .then(() => done());
      });
    });
    it('search', done => {
      Media.retrieve('foo')
        .then(docs => {
          docs.should.be.an('array').and.have.lengthOf(4);
          docs[0].should.property('path', '/media4.txt');
          docs[1].should.property('path', '/media2.txt');
          docs[2].should.property('path', '/media3.txt');
          docs[3].should.property('path', '/media1.txt');
          done();
        })
        .catch(done);
    });
  });
  describe('doc', () => {
    beforeEach(done => {
      beforeEachHelper(() => {
        inject(fixtures.models.getters)
          .then(() => done());
      });
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
          decoration: 'undecorated',
          poster: 'http://placehold.it/342?text=no+image',
          removed: false,
        });
        data.should.not.have.property('category');
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
          torrent: {
            excess: 'MULTI',
          },
          info: {
            id: 99,
            popularity: '1.000',
            imdb_id: 98,
          },
        }).getApiData();
        data.should.have.properties({
          tmdbId: 99,
          imdbId: 98,
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
        new Media({ created: date }).getApiData()
          .should.have.property('created', date.toISOString());
      });
      it('removed', () => {
        new Media({}).getApiData().should.have.property('removed', false);
        const date = new Date();
        new Media({ removed: date }).getApiData()
          .should.have.property('removed', date.toISOString());
      });
      it('decoration', () => {
        new Media({}).getApiData()
          .should.have.property('decoration', 'undecorated');
        new Media({ decoration: 'decorated' }).getApiData()
          .should.have.property('decoration', 'decorated');
        new Media({ decoration: 'anyvalue' }).getApiData()
          .should.have.property('decoration', 'anyvalue');
      });
      it('category', () => {
        new Media({ info: { category: 'movie' } }).getApiData()
          .should.have.property('category', 'movie');
        new Media({ info: { category: 'tv' } }).getApiData()
          .should.have.property('category', 'tv');
        new Media({ info: { category: 'other' } }).getApiData()
          .should.not.have.property('category');
        new Media({ info: {} }).getApiData()
          .should.not.have.property('category');
        new Media({}).getApiData()
          .should.not.have.property('category');
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
          torrent: {
            season: '1',
            episode: '1',
          },
          info: {
            category: 'tv',
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
        new Media({ info: { vote_average: 5.3000 } }).getApiData()
          .should.not.have.property('votes');
        new Media({ info: { vote_count: 10 } }).getApiData().should.not.have.property('votes');
        new Media({ info: { vote_average: 10, vote_count: 0 } }).getApiData()
          .should.have.property('votes', '0 vote');
      });
      it('codec', () => {
        new Media({ torrent: { codec: 'MP4', audio: 'AC3' } }).getApiData()
          .should.have.property('codec', 'MP4, AC3');
        new Media({ torrent: { codec: 'MP4' } }).getApiData()
          .should.have.property('codec', 'MP4');
        new Media({ torrent: { audio: 'AC3' } }).getApiData()
          .should.have.property('codec', 'AC3');
      });
      it('quality', () => {
        new Media({ torrent: { quality: 'bluray', resolution: '1080p' } }).getApiData()
          .should.have.property('quality', 'bluray, 1080p');
        new Media({ torrent: { quality: 'bluray' } }).getApiData()
          .should.have.property('quality', 'bluray');
        new Media({ torrent: { resolution: '1080p' } }).getApiData()
          .should.have.property('quality', '1080p');
      });
      it('size', () => {
        new Media({ file: {} }).getApiData().should.not.have.property('size');
        new Media({ file: { size: 0 } }).getApiData().should.have.property('size', 0);
        new Media({ file: { size: 14 } }).getApiData().should.have.property('size', '14o');
        new Media({ file: { size: 1024 + 134 } }).getApiData()
          .should.have.property('size', '1.13ko');
        new Media({ file: { size: 1024 * 1024 + 134000 } }).getApiData()
          .should.have.property('size', '1.13Mo');
        new Media({ file: { size: 1024 * 1024 * 1024 + 134000000 } }).getApiData()
          .should.have.property('size', '1.12Go');
      });
      it('videos', () => {
        new Media({ path: '/path/to/file.mkv' }).getApiData()
          .should.not.have.property('videos');
        new Media({ path: '/path/to/file.mkv', info: { videos: { results: [] } } })
          .getApiData().should.not.have.property('videos');
        new Media({ path: '/path/to/file.mkv', info: { videos: { results: null } } })
          .getApiData().should.not.have.property('videos');

        const data = new Media({
          path: '/path/to/file.mkv',
          info: {
            videos: {
              results: [
                { site: 'YouTube', key: 'key1', name: 'name1' },
                { site: 'YouTube', key: 'key2', name: 'name2' },
                { site: 'Other', key: 'key3', name: 'name3' },
              ],
            },
          },
        }).getApiData();
        data.should.be.an('object').that.have.properties({ path: '/path/to/file.mkv' });
        data.should.have.property('videos').that.is.an('array').with.lengthOf(2);
        data.videos[0].should.be.an('object').that.have.properties({ key: 'key1', name: 'name1' });
        data.videos[1].should.be.an('object').that.have.properties({ key: 'key2', name: 'name2' });
      });
      it('images', () => {
        new Media({ path: '/path/to/file.mkv' }).getApiData()
          .should.not.have.property('images');
        new Media({ path: '/path/to/file.mkv', info: { images: { backdrops: [] } } })
          .getApiData().should.not.have.property('images');
        new Media({ path: '/path/to/file.mkv', info: { images: { backdrops: null } } })
          .getApiData().should.not.have.property('images');

        const data = new Media({
          path: '/path/to/file.mkv',
          info: {
            images: {
              backdrops: [
                { file_path: '/path1', height: 100, width: 200 },
                { file_path: '/path2', height: 200, width: 300 },
              ],
            },
          },
        }).getApiData();
        data.should.be.an('object').that.have.properties({ path: '/path/to/file.mkv' });
        data.should.have.property('images').that.is.an('array').with.lengthOf(2);
        data.images[0].should.be.an('object')
          .that.have.properties({ file_path: '/path1', height: 100, width: 200 });
        data.images[1].should.be.an('object')
          .that.have.properties({ file_path: '/path2', height: 200, width: 300 });
      });
      it('credits', () => {
        new Media({ path: '/file.mkv', info: { credits: { crew: [], cast: [] } } }).getApiData()
          .should.not.have.property('credits');
        new Media({ path: '/file.mkv', info: {} }).getApiData()
          .should.not.have.property('credits');

        const data = new Media({
          path: '/file.mkv',
          info: {
            credits: {
              crew: [
                { job: 'Casting', name: 'name1', profile_path: 'path1' },
                { job: 'Director', name: 'name2', profile_path: 'path2' },
              ],
              cast: [
                { order: 100, name: 'name1', character: 'char1', profile_path: 'path1' },
                { order: 10, name: 'name2', character: 'char2', profile_path: 'path2' },
                { order: 9, name: 'name3', character: 'char3', profile_path: 'path3' },
              ],
            },
          },
        }).getApiData();
        data.should.have.property('credits');

        data.credits.should.have.property('direction').that.is.an('array').with.lengthOf(1);
        data.credits.direction[0].should.have.properties({ name: 'name2', profile_path: 'path2' });

        data.credits.should.have.property('cast').that.is.an('array').with.lengthOf(2);
        data.credits.cast[0]
          .should.have.properties({ name: 'name3', character: 'char3', profile_path: 'path3' });
        data.credits.cast[1]
          .should.have.properties({ name: 'name2', character: 'char2', profile_path: 'path2' });
      });
    });
  });
});
