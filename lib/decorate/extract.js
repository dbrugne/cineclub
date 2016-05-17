const debug = require('../util/debug');
const parser = require('./parse');
const Cache = require('../models/cache');

const requestTMDB = (api, method, query) => new Promise((resolve, reject) => {
  api[method](query, (err, data) => {
    if (err) {
      return reject(err);
    }

    const total = (data)
      ? data.total_results
      : 0;
    debug('TMDB :: requesting', method, query, `${total} results`);
    return resolve(data);
  });
});

const saveCache = (method, query, result) => new Promise((resolve, reject) => {
  debug('TMDB :: saving cache', method, query);
  Cache.setKey(method, query, result)
    .then(() => resolve(result))
    .catch(err => reject(err));
});

/**
 * From a filepath, parse infos and extracts TMDB info
 * Implements cache to reduce API calls
 *
 * @param filepath
 * @param opts
 * @returns {Promise}
 */
module.exports = (filepath, opts) => new Promise((resolve, reject) => {
  if (!opts || !opts.api) {
    return reject('api object required');
  }

  // specific category folder (series/)
  const isTvForSure = /.*\/series\/.*/.test(filepath);

  // extract torrent convention info
  const media = parser(filepath);

  const query = {
    language: 'fr',
    page: 1,
    query: media.title,
  };
  let category;
  let method;
  if (isTvForSure || (media.season || media.episode)) {
    // tv
    method = 'searchTv';
    category = 'tv';
  } else if (media.year) {
    // movie
    method = 'searchMovie';
    query.year = media.year;
    category = 'movie';
  } else {
    // not parsed
    method = 'searchMulti';
  }

  return Cache.getKey(method, query)
    .then(cache => {
      if (cache) {
        debug('TMDB :: CACHE FOUND', method, query);
        return cache;
      }

      return requestTMDB(opts.api, method, query);
    })
    .then(data => {
      if (data.from_cache === true) {
        return data;
      }

      return saveCache(method, query, data);
    })
    .then(data => {
      if (!data || !data.results || !data.results.length) {
        return resolve();
      }

      const info = data.results[0];
      if (category) {
        info.category = category;
      } else if (info.media_type === 'movie' || info.media_type === 'tv') {
        info.category = info.media_type;
      }

      if (data.from_cache === true) {
        info.from_cache = true;
      }
      return resolve(info);
    })
    .catch(reject);
});
