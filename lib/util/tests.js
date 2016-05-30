require('dotenv').config({ path: './test/.env' });

const chai = require('chai');
const should = chai.should();
chai.use(require('chai-properties'));

const connect = require('./mongo');
const mongoose = require('mongoose');

process.env.DISABLE_HTTP_LOG = '1';
const request = require('supertest');

module.exports = {
  chai,
  should,
  request,
  beforeHelper: (done) => {
    connect(process.env.MONGODB_URI || 'mongodb://localhost/test', done);
  },
  afterHelper: (done) => {
    mongoose.disconnect();
    return done();
  },
  beforeEachHelper: (done) => {
    if (mongoose.connection.readyState === 0) {
      return done('not connected');
    }

    // remove all known-collections (those with model module already loaded)
    const clearDB = () => {
      const promises = Object.keys(mongoose.connection.collections).map(
        k => mongoose.connection.collections[k].remove()
      );
      return Promise.all(promises);
    };

    return clearDB()
      .then(() => done())
      .catch(done);
  },
  tmdbMockup: (fixtures) => {
    const get = (query, fn) => {
      const name = query.query.toLocaleLowerCase();
      const result = fixtures[name]
          ? fixtures[name].result
          : fixtures.unknown.result;
      return fn(null, Object.assign({}, result));
    };
    return {
      searchMovie: get,
      searchTv: get,
      searchMulti: get,
    };
  },
};
