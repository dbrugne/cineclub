const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  key: { type: String },
  created: { type: Date },
  result: mongoose.Schema.Types.Mixed,
});

/**
 * Generate cache key from method name and query object
 * @param method
 * @param query
 * @returns {string}
 */
Schema.statics.generateKey = (method, query) => {
  const fallback = () => Math.floor(Math.random() * 100000000);
  let q;
  try {
    q = JSON.stringify(query);
  } catch (e) {
    q = fallback();
  }
  if (q === '"invalid string"') {
    q = fallback();
  }

  return `${method}-${q}`;
};

/**
 * Retrieve cache entry
 * @returns {Promise}
 */
function getKey(method, query) {
  const key = this.generateKey(method, query);
  return new Promise((resolve, reject) => {
    this.findOne({ key }).exec((err, doc) => {
      if (err) {
        return reject(err);
      }

      if (!doc) {
        return resolve();
      }

      return resolve(Object.assign({
        from_cache: true,
      }, doc.result || {}));
    });
  });
}
Schema.statics.getKey = getKey;

/**
 * Add cache entry
 * @returns {Promise}
 */
function setKey(method, query, result) {
  const doc = new this();
  doc.key = this.generateKey(method, query);
  doc.created = new Date();

  const cleanResult = Object.assign({}, result);
  delete cleanResult.from_cache;
  doc.result = cleanResult;

  return doc.save();
}
Schema.statics.setKey = setKey;

/**
 * Cleanup cache older than 1w day
 * @returns {Promise}
 */
function purge() {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  const query = {
    created: { $lt: d },
  };
  return this.remove(query).exec();
}
Schema.statics.purge = purge;
// @todo : call somewhere (at begining of push or http server launch)

module.exports = mongoose.model('Cache', Schema);
