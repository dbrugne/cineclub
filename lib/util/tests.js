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

const fixtures = require('../../test/fixtures/data');

const stub = require('./../tmdb/stub')(fixtures.tmdb);
const tmdbStub = require('./../tmdb/index')(null, stub);
tmdbStub.setLimit = stub.setLimit;

const expressApp = require('../server/index');
expressApp.locals.tmdbApiKey = fixtures.tmdb;
expressApp.locals.tmdbApi = tmdbStub;

const dropCollections = () => {
  if (mongoose.connection.readyState === 0) {
    return Promise.reject('not connected');
  }

  // remove all known-collections (those with model module already loaded)
  const clearDB = () => {
    const promises = Object.keys(mongoose.connection.collections).map(
      k => mongoose.connection.collections[k].remove()
    );
    return Promise.all(promises);
  };

  return clearDB();
};

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
  tmdbStub.setLimit(100);
  dropCollections()
    .then(() => done())
    .catch(done);
};

module.exports = {
  chai,
  should,
  request,
  fixtures,
  collections,
  dropCollections,
  inject,
  beforeHelper,
  afterHelper,
  beforeEachHelper,
  expressApp,
  tmdbStub,
};
