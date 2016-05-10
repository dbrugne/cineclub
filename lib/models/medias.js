const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  category: { type: String },
  name: { type: String },
  path: { type: String },
  size: { type: String }, // avoid LongInt issue with Mongoose
  created: { type: Date },
  removed: { type: Boolean },
  removed_at: { type: Date },
  data: mongoose.Schema.Types.Mixed,
});

/**
 * List active medias for SFTP tree diff computing
 * @returns {Promise}
 */
Schema.statics.retrieveActive = function () {
  return this.find({ removed: { $ne: true } })
    .select('name path')
    .sort({ _id: 1 })
    .limit(500)
    .exec();
};

/**
 * List new medias
 * @returns {Promise}
 */
Schema.statics.retrieveNew = function () {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return this.find({ removed: { $ne: true }, created: { $gte: d } })
    .sort({ _id: 1 })
    .limit(500)
    .exec();
};

/**
 * List removed medias during last 24h
 * @returns {Promise}
 */
Schema.statics.retrieveRemoved = function () {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return this.find({ removed: true, remove_at: { $gte: d } })
    .sort({ _id: 1 })
    .limit(500)
    .exec();
};

/**
 * List unparsed medias during last 24h
 * @returns {Promise}
 */
Schema.statics.retrieveUnparsed = function () {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return this.find({ removed: { $ne: true }, 'data.torrent': { $exists: false } })
    .sort({ _id: 1 })
    .limit(500)
    .exec();
};

/**
 * Create 'new' medias
 * @param [{Object}]
 * @returns {Promise|null}
 */
Schema.statics.createNewMedias = function (list) {
  if (!list || !list.length) {
    return new Promise((res) => res());
  }

  const docs = list.map(f => {
    const doc = {
      category: f.category,
      name: f.name,
      path: f.path,
      size: f.size,
      created: f.created,
      removed: false,
      data: f.data,
    };

    return doc;
  });

  return this.collection.insert(docs);
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
