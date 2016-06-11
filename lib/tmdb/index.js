const debug = require('./../util/debug');
const Cache = require('../models/cache');
const moviedb = require('moviedb');
const TmdbRateLimitError = require('./tmdbRateLimitError');

/**
 * Search for existing cache key
 * @param method
 * @param query
 * @returns {Promise}
 */
function searchCache(method, query) {
  debug('TMDB :: searching cache', method, query);
  return Cache.getKey(method, query)
    .then(cached => {
      if (!cached) {
        return undefined;
      }

      debug('TMDB :: CACHE FOUND', method, query);
      return cached;
    });
}

/**
 * Save a new cache key
 * @param method
 * @param query
 * @param result
 * @returns {Promise}
 */
function saveCache(method, query, result) {
  debug('TMDB :: saving cache', method, query);
  return Cache.setKey(method, query, result);
}

/**
 * Request API with given method, query
 * @param api
 * @param method
 * @param query
 * @returns {Promise}
 */
function requestApi(api, method, query) {
  return new Promise((resolve, reject) => {
    api[method](query, (err, responseBody, response) => {
      if (err) {
        return reject(err);
      }

      const header = response.header;
      const rateLimit = header['x-ratelimit-remaining'];
      debug('TMDB :: request done', method, query, `ratelimit=${rateLimit}`);

      if (rateLimit < 1) {
        return reject(new TmdbRateLimitError());
      }

      return resolve(responseBody);
    });
  });
}

/**
 * Operate cache and API requests logic
 * @param api
 * @param method
 * @param query
 * @returns {Promise}
 */
function get(api, method, query) {
  return searchCache(method, query)
    .then(cached => {
      if (cached) {
        return cached;
      }

      return requestApi(api, method, query);
    })
    .then(result => {
      if (result.from_cache === true) {
        return result;
      }

      return saveCache(method, query, result);
    });
}

module.exports = (apiKey, stub) => {
  const api = (apiKey)
    ? moviedb(apiKey)
    : stub;

  return (method, query) => get(api, method, query);
};
