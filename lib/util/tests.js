require('dotenv').config({ path: './test/.env' });

const chai = require('chai');
const should = chai.should();
chai.use(require('chai-properties'));

const connect = require('./mongo');
const mongoose = require('mongoose');

process.env.DISABLE_HTTP_LOG = '1';
const request = require('supertest');

const media = require('../models/media');
const cache = require('../models/cache');
const collections = { media, cache };

const fixtures = require('../../test/fixtures');

const inject = data => {
  if (!data || !Object.keys(data).length) {
    return Promise.resolve();
  }

  let sequence = Promise.resolve();

  Object.keys(data).forEach(name => {
    if (!collections[name] || !Array.isArray(data[name])) {
      return;
    }
    const collection = collections[name].collection;
    const documents = data[name];
    sequence = sequence.then(() => collection.insert(documents));
  });

  return sequence;
};

const beforeHelper = done => connect(process.env.MONGODB_URI || 'mongodb://localhost/test', done);

const afterHelper = done => {
  mongoose.disconnect();
  return done();
};

const beforeEachHelper = done => {
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
};

const tmdbMockup = () => {
  const get = (query, fn) => {
    const name = query.query.toLocaleLowerCase();
    const result = fixtures.tmdb[name]
      ? fixtures.tmdb[name].result
      : fixtures.tmdb.unknown.result;
    return fn(null, Object.assign({}, result));
  };
  return {
    searchMovie: get,
    searchTv: get,
    searchMulti: get,
  };
};

module.exports = {
  chai,
  should,
  request,
  fixtures,
  collections,
  inject,
  beforeHelper,
  afterHelper,
  beforeEachHelper,
  tmdbMockup,
};
