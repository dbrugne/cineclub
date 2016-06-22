const debug = require('../util/debug');
const parse = require('./parse');
const search = require('./search');
const fetch = require('./fetch');

/**
 * Take an iterable of models in input, decorate them save them
 *
 * @param docs
 * @param opts
 * @returns {Promise}
 */
module.exports = (docs, opts) => new Promise((resolve, reject) => {
  if (!opts || !opts.api) {
    return reject(new Error('api required'));
  }

  if (!docs || !docs.length) {
    debug('DECORATE :: nothing to do');
    return resolve(docs);
  }

  const documents = docs.filter(d => d.shouldDecorate());
  if (!documents.length) {
    debug('DECORATE :: nothing to do (already)');
    return resolve(docs);
  }

  debug('DECORATE :: run docs', documents.length);

  // execute each doc sequentially and not in parallel to allow cache usage
  let sequence = Promise.resolve();

  // loop over each doc and add steps to the end of the 'sequence'
  documents.forEach(doc => {
    sequence = sequence
      .then(() => {
        const torrent = parse(doc.path);
        doc.set('torrent', torrent);
        return undefined;
      })
      .then(() => {
        if (doc.info && doc.info.id && doc.info && doc.info.category) {
          return { type: doc.info.category, id: doc.info.id };
        }

        let method = 'searchMulti';
        const isTvForSure = /.*\/series\/.*/.test(doc.path);
        const torrent = doc.torrent || {};
        if (isTvForSure || (torrent.season && torrent.episode)) {
          method = 'searchTv';
        } else if (torrent.year) {
          method = 'searchMovie';
        }

        let query;
        if (torrent.title) {
          query = torrent.title;
        } else if (doc.file && doc.file.name) {
          query = doc.file.name;
        } else {
          return {};
        }

        return search(opts.api, method, {
          query,
          year: torrent.year,
        });
      })
      .then(({ type, id }) => {
        if (!type || !id) {
          return undefined;
        }

        return fetch(opts.api, type, id);
      })
      .then(info => {
        debug(`DECORATE :: ${(info) ? 'success' : 'failed'}`, doc.path);
        return doc.setDecoration(info);
      });
  });

  return sequence
    .then(() => resolve(docs))
    .catch(err => {
      if (err.name === 'TmdbRateLimitError') {
        debug('DECORATE :: TMDB rateLimit exceeded, stop execution (previous docs was decorated)');
        return resolve(docs);
      }

      return reject(err);
    });
});
