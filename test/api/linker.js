require('../../lib/util/tests');

const middleware = require('../../lib/server/middlewares/linker');

const req = {
  app: {
    get: () => 99,
  },
  protocol: 'https',
  hostname: 'example.com',
};

describe('API middleware', () => {
  it('is function', () => {
    middleware.should.be.a('function');
  });
  it('works', done => {
    const res = {};
    middleware(req, res, () => {
      res.should.have.property('linker').that.is.a('function');

      res.linker().should.equal('https://example.com:99/api/');
      res.linker('').should.equal('https://example.com:99/api/');
      res.linker('test').should.equal('https://example.com:99/api/test');

      res.linker('test', {
        key1: 'value1',
        key2: undefined,
        key3: {
          key4: undefined,
        },
        key5: {
          key6: 'value2',
          key7: undefined,
        },
      }).should.equal('https://example.com:99/api/test?key1=value1&key5%5Bkey6%5D=value2');

      done();
    });
  });
});
