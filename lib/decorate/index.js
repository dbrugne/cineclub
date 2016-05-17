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
    return reject('api required');
  }

  if (!docs || !docs.length) {
    debug('DECORATE :: nothing to do');
    return resolve(docs);
  }

  const documents = docs.filter(d => !d.info);
  if (!documents.length) {
    debug('DECORATE :: nothing to do (already)');
    return resolve(docs);
  }

  debug('DECORATE :: run docs', documents.length);
  const promises = documents.map(doc => new Promise((res, rej) => {
    debug('DECORATE :: will try doc', doc.path);
    return extract(doc.path, opts)
      .then(info => {
        if (!info) {
          debug('DECORATE :: fail', doc.path);
          return res();
        }

        debug('DECORATE :: success', doc.path);
        return doc.addInfo(info)
          .then(() => res())
          .catch(rej);
      })
      .catch(rej);
  }));

  return Promise.all(promises)
    .then(() => {
      debug(`DECORATE :: ${promises.length} decorated`);
      resolve(docs);
    })
    .catch(reject);
});
