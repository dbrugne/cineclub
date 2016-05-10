const mongoose = require('mongoose');

const Schema = mongoose.Schema({
  name: { type: String },
  path: { type: String },
  created: { type: Date },
  new: { type: Boolean },
  removed: { type: Boolean },
  removed_at: { type: Date },
  data: mongoose.Schema.Types.Mixed,
});

/**
 * List current knowns medias
 * @returns {Promise}
 */
Schema.statics.fastList = function () {
  return this.find({ removed: { $ne: true } })
    .sort({ _id: 1 })
    .limit(500)
    .exec();
};

/**
 * Untag 'new' medias older than 24h
 * @returns {Promise}
 */
Schema.statics.untagNews = function () {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const query = {
    isNew: true,
    created: { $lt: d },
  };
  const update = { isNew: false };
  return this.update(query, update, { multi: true }).exec();
};

/**
 * Create 'new' medias
 * @param [{Object}]
 * @returns {Promise|null}
 */
Schema.statics.createNews = function (list) {
  let p;
  if (list && list.length) {
    const docs = list.map(f => ({
      name: f.name,
      path: f.path,
      created: new Date(),
      new: true,
      removed: false,
      data: f.data,
    }));

    p = this.collection.insert(docs);
  }

  return p;
};

/**
 * Tag 'removed' medias
 * @param [{Object}]
 * @returns {Promise}
 */
Schema.statics.tagRemoved = function (list) {
  const ids = list.map((f) => f.path);
  const query = { path: { $in: ids } };
  const update = {
    removed: true,
    removed_at: Date.now(),
  };
  return this.update(query, update, { multi: true }).exec();
};

/**
 * remove 'removed' medias older than 1w
 * @returns {Promise}
 */
Schema.statics.purge = function () {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  const query = {
    removed: true,
    removed_at: { $lt: d },
  };
  return this.remove(query, { multi: true }).exec();
};

module.exports = mongoose.model('Media', Schema);
