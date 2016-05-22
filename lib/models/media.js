const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  path: { type: String },
  created: { type: Date },
  removed: { type: Date },
  file: mongoose.Schema.Types.Mixed,
  info: mongoose.Schema.Types.Mixed,
});

Schema.index({ created: -1 });
Schema.index({ removed: -1 });

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
 * Add 'info' on media
 * @param info
 * @returns {Promise|null}
 */
function addInfo(info) {
  this.info = info;
  return new Promise((resolve, reject) => {
    this.save((err) => {
      if (err) {
        return reject(err);
      }

      return resolve(this);
    });
  });
}
Schema.methods.addInfo = addInfo;

/**
 * Return poster URL in given size
 * @param size
 * @returns String
 */
const TMDB_POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w%width';
const DEFAULT_POSTER_URL = 'http://placehold.it/%width?text=no+image';
const TMDB_POSTER_WIDTHS = [92, 154, 185, 342, 500, 780];
function getPosterUrl(size) {
  const format = (typeof size === 'number' && TMDB_POSTER_WIDTHS.indexOf(size) !== -1)
    ? size
    : TMDB_POSTER_WIDTHS[0];
  const url = (!this.info || !this.info.poster_path)
    ? DEFAULT_POSTER_URL
    : TMDB_POSTER_BASE_URL + this.info.poster_path;

  return url.replace('%width', format);
}
Schema.methods.getPosterUrl = getPosterUrl;

/**
 * Return genre(s) of current media
 * @param id
 * @returns [String]
 */
const genres = {
  movie: [
    { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' },
    { id: 16, name: 'Animation' },
    { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' },
    { id: 99, name: 'Documentary' },
    { id: 18, name: 'Drama' },
    { id: 10751, name: 'Family' },
    { id: 14, name: 'Fantasy' },
    { id: 10769, name: 'Foreign' },
    { id: 36, name: 'History' },
    { id: 27, name: 'Horror' },
    { id: 10402, name: 'Music' },
    { id: 9648, name: 'Mystery' },
    { id: 10749, name: 'Romance' },
    { id: 878, name: 'Science Fiction' },
    { id: 10770, name: 'TV Movie' },
    { id: 53, name: 'Thriller' },
    { id: 10752, name: 'War' },
    { id: 37, name: 'Western' },
  ],
  tv: [
    { id: 10759, name: 'Action & Adventure' },
    { id: 16, name: 'Animation' },
    { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' },
    { id: 99, name: 'Documentary' },
    { id: 18, name: 'Drama' },
    { id: 10751, name: 'Family' },
    { id: 10762, name: 'Kids' },
    { id: 9648, name: 'Mystery' },
    { id: 10763, name: 'News' },
    { id: 10764, name: 'Reality' },
    { id: 10765, name: 'Sci-Fi & Fantasy' },
    { id: 10766, name: 'Soap' },
    { id: 10767, name: 'Talk' },
    { id: 10768, name: 'War & Politics' },
    { id: 37, name: 'Western' },
  ],
};
function getGenres() {
  if (!this.info || !this.info.genre_ids || !this.info.genre_ids.length || !this.info.category
      || (this.info.category !== 'movie' && this.info.category !== 'tv')) {
    return undefined;
  }

  const list = [];
  this.info.genre_ids.forEach(id => {
    const genre = genres[this.info.category].find(g => g.id === id);
    if (genre) {
      list.push(genre.name);
    }
  });
  return (list.length)
    ? list
    : undefined;
}
Schema.methods.getGenres = getGenres;

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
 * Remove 'removed' medias older than 1w
 * @returns {Promise}
 */
function purge() {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  const query = {
    removed: { $lt: d },
  };
  return this.remove(query).exec();
}
Schema.statics.purge = purge;

module.exports = mongoose.model('Media', Schema);
