const parser = require('./parse');

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
    return reject(new Error('api object required'));
  }

  // specific category folder (series/)
  const isTvForSure = /.*\/series\/.*/.test(filepath);

  // extract torrent convention info
  const torrentInfo = parser(filepath);

  const query = {
    language: 'fr',
    page: 1,
    query: torrentInfo.title,
  };
  let category;
  let method;
  if (isTvForSure || (torrentInfo.season && torrentInfo.episode)) {
    // tv
    method = 'searchTv';
    category = 'tv';
  } else if (torrentInfo.year) {
    // movie
    method = 'searchMovie';
    query.year = torrentInfo.year;
    category = 'movie';
  } else {
    // not parsed
    method = 'searchMulti';
  }

  // filter torrent field to copy
  const torrentInfoClean = {};
  Object.keys(torrentInfo).forEach(k => {
    if (k === 'parsed') {
      return;
    }
    torrentInfoClean[k] = torrentInfo[k];
  });

  return opts.api(method, query)
    .then(data => {
      let info = {};
      if (torrentInfo.parsed === true) {
        info = Object.assign(info, torrentInfoClean);
      }
      if (data && data.results && data.results.length) {
        info = Object.assign(info, data.results[0]);

        // category
        if (category) {
          info.category = category;
        } else if (info.media_type === 'movie' || info.media_type === 'tv') {
          info.category = info.media_type;
        }
      }

      // cache
      if (data.from_cache === true) {
        info.from_cache = true;
      }

      return resolve(info);
    })
    .catch(reject);
});
