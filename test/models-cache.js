const should = require('chai').should();

const util = require('../lib/util/tests');
const Cache = require('../lib/models/cache');

describe('models::cache', () => {
  before(util.before);
  beforeEach(util.beforeEach);
  after(util.after);

  it('is object and has expected functions', () => {
    Cache.should.be.an('function').and.property('schema');
    Cache.generateKey.should.be.a('function');
    Cache.getKey.should.be.a('function');
    Cache.setKey.should.be.a('function');
    Cache.purge.should.be.a('function');
  });

  it('generateKey', () => {
    Cache.generateKey('searchMethod', {
      query: 'query',
      language: 'fr',
    }).should.equal('searchMethod-{"query":"query","language":"fr"}');
    Cache.generateKey('searchMethod', 'invalid string').should.match(/^searchMethod-[0-9]+$/);
  });

  const method = 'searchMethod';
  const query = {
    query: 'Title 1',
    language: 'fr',
  };
  const result = {
    count: 5,
    results: [{
      title: 'Title 1',
      year: 2015,
      excess: ['FR', 'VOST'],
    }, {
      title: 'Title 2',
      year: 2014,
      excess: 'MULTI',
    }],
  };

  it('setKey', (done) => {
    Cache.setKey(method, query, result)
      .then(() => {
        const key = Cache.generateKey(method, query);
        Cache.findOne({ key }).exec()
          .then((doc) => {
            should.exist(doc);
            doc.should.be.an('object');
            doc.should.property('_id').and.be.an('object');
            doc.should.property('key', key);
            doc.result.should.deep.equal(result);
            done();
          })
          .catch(err => done(err));
      });
  });

  it('getKey', (done) => {
    Cache.setKey(method, query, result)
      .then(() => {
        Cache.getKey(method, query)
          .then((keyResult) => {
            should.exist(keyResult);
            keyResult.should.be.an('object');
            keyResult.should.deep.equal(Object.assign({ from_cache: true }, result));
            done();
          })
          .catch(err => done(err));
      })
      .catch(err => done(err));
  });

  it('empty result', (done) => {
    Cache.setKey(method, query, {})
      .then(() => {
        Cache.getKey(method, query)
          .then((keyResult) => {
            should.exist(keyResult);
            keyResult.should.be.an('object');
            keyResult.should.deep.equal({ from_cache: true });
            done();
          })
          .catch(err => done(err));
      })
      .catch(err => done(err));
  });

  it('not save from_cache', (done) => {
    Cache.setKey(method, query, Object.assign({ from_cache: true }, result))
      .then(() => {
        const key = Cache.generateKey(method, query);
        Cache.findOne({ key }).exec()
          .then((doc) => {
            should.exist(doc);
            doc.should.be.an('object');
            doc.should.property('key', key);
            doc.result.should.deep.equal(result);
            done();
          })
          .catch(err => done(err));
      })
      .catch(err => done(err));
  });
});
