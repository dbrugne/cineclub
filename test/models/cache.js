const {
  should,
  beforeHelper,
  beforeEachHelper,
  afterHelper,
  inject,
  fixtures,
} = require('../../lib/util/tests');

const Cache = require('../../lib/models/cache');

describe('models/cache', () => {
  before(beforeHelper);
  beforeEach(beforeEachHelper);
  after(afterHelper);

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
      .then(data => {
        data.should.be.an('object').and.deep.equal(result);
        const key = Cache.generateKey(method, query);
        return Cache.findOne({ key }).exec()
          .then((doc) => {
            should.exist(doc);
            doc.should.be.an('object').and.have.property('_id').and.be.an('object');
            doc.should.property('key', key);
            doc.result.should.have.properties(result);
            done();
          });
      })
      .catch(done);
  });
  it('getKey', (done) => {
    Cache.setKey(method, query, result)
      .then(() => Cache.getKey(method, query)
        .then((keyResult) => {
          should.exist(keyResult);
          const expected = Object.assign({ from_cache: true }, result);
          keyResult.should.be.an('object').and.have.properties(expected);
          done();
        }))
      .catch(done);
  });
  it('empty result', (done) => {
    Cache.setKey(method, query, {})
      .then(() => Cache.getKey(method, query)
        .then((keyResult) => {
          should.exist(keyResult);
          keyResult.should.be.an('object').and.have.properties({ from_cache: true });
          done();
        }))
      .catch(done);
  });
  it('not save from_cache', (done) => {
    Cache.setKey(method, query, Object.assign({ from_cache: true }, result))
      .then(() => {
        const key = Cache.generateKey(method, query);
        return Cache.findOne({ key }).exec()
          .then((doc) => {
            should.exist(doc);
            doc.should.be.an('object').and.have.property('key', key);
            doc.result.should.have.properties(result);
            done();
          });
      })
      .catch(done);
  });
  it('purge', (done) => {
    inject(fixtures.models.purge)
      .then(() => Cache.purge())
      .then(() => Cache.find({}).exec())
      .then((docs) => {
        docs.should.be.an('array').and.to.have.lengthOf(1);
        docs[0].key.should.equal('keep');
        done();
      })
      .catch(done);
  });
});
