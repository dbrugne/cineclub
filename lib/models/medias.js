const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  path: { type: String },
  created: { type: Date },
  removed: { type: Date },
  file: mongoose.Schema.Types.Mixed,
});

/**
 * List active medias for SFTP tree diff computing
 * @returns {Promise}
 */
function retrieveActive() {
  return this.find({ removed: { $exists: false } })
    .select('name path')
    .sort({ _id: 1 })
    .exec();
}
Schema.statics.retrieveActive = retrieveActive;

/**
 * List new medias
 * @param days
 * @returns {Promise}
 */
function retrieveAdded(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return this.find({ removed: { $exists: false }, created: { $gte: d } })
    .sort({ _id: 1 })
    .limit(500)
    .exec();
}
Schema.statics.retrieveAdded = retrieveAdded;

/**
 * List removed medias
 * @param days
 * @returns {Promise}
 */
function retrieveRemoved(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return this.find({ removed: { $gte: d } })
    .sort({ _id: 1 })
    .limit(500)
    .exec();
}
Schema.statics.retrieveRemoved = retrieveRemoved;

  /**
 * List unparsed medias
 * @param days
 * @returns {Promise}
 */
function retrieveUnparsed(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return this.find({ removed: { $exists: false }, 'data.torrent': { $exists: false } })
    .sort({ _id: 1 })
    .limit(500)
    .exec();
}
Schema.statics.retrieveUnparsed = retrieveUnparsed;

/**
 * Create 'new' medias
 * @param list
 * @returns {Promise|null}
 */
function createNewMedias(list) {
  if (!list || !list.length) {
    return new Promise((res) => res());
  }

  const docs = list.map(f => ({
    path: f.path,
    created: f.file.mtime, // when discovered for the 1st time set with mtime (= creation time)
    file: f.file,
  }));

  return this.collection.insert(docs);
}
Schema.statics.createNewMedias = createNewMedias;

/**
 * Tag 'removed' medias
 * @param list
 * @returns {Promise}
 */
function tagRemoved(list) {
  const ids = list.map((f) => f.path);
  const query = { path: { $in: ids } };
  const update = {
    removed: Date.now(),
  };
  return this.update(query, update, { multi: true }).exec();
}
Schema.statics.tagRemoved = tagRemoved;

/**
 * remove 'removed' medias older than 1w
 * @returns {Promise}
 */
function purge() {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  const query = {
    removed: { $lt: d },
  };
  return this.remove(query, { multi: true }).exec();
}
Schema.statics.purge = purge;

module.exports = mongoose.model('Media', Schema);
