const debug = require('../util/debug');
const extract = require('./extract');

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
      .then(() => extract(doc.path, opts))
      .then(info => {
        const mediaInfo = Object.assign({}, info);
        delete mediaInfo.from_cache;

        debug(`DECORATE :: ${(info) ? 'success' : 'failed'}`, doc.path);
        return doc.setDecoration(mediaInfo);
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
