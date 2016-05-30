require('../../lib/util/tests');
const flatten = require('../../lib/util/flatten');

describe('util/flatten', () => {
  it('is function', () => {
    flatten.should.be.a('function');
  });
  it('empty', () => {
    const r = flatten({});
    r.should.be.an('object');
    Object.keys(r).should.have.lengthOf(0);
  });
  it('simple (one)', () => {
    const r = flatten({
      key1: 'value1',
    });
    r.should.be.an('object').and.have.properties({
      key1: 'value1',
    });
  });
  it('simple (n)', () => {
    const r = flatten({
      key1: 'value1',
      key2: 'value2',
    });
    r.should.be.an('object').and.have.properties({
      key1: 'value1',
      key2: 'value2',
    });
  });
  it('flatten', () => {
    const r = flatten({
      key1: 'value1',
      deep: {
        key2: 'value2',
        key3: 'value3',
      },
      verydeep: {
        deeper: {
          key4: 'value4',
        },
      },
    });
    r.should.be.an('object').and.have.properties({
      key1: 'value1',
      'deep[key2]': 'value2',
      'deep[key3]': 'value3',
      'verydeep[deeper][key4]': 'value4',
    });
  });
});
