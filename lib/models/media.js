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

function getFind(search, category) {
  const criteria = { removed: { $exists: false } };
  if (search) {
    const pattern = new RegExp(search, 'i');
    criteria.$or = [
      { 'file.name': pattern },
      { 'info.title': pattern },
    ];
  }
  if (category) {
    criteria['info.category'] = category;
  }

  return criteria;
}

/**
 * Count medias
 * @param search
 * @param category
 * @returns {Promise}
 */
function countAll(search, category) {
  return this.find(getFind(search, category))
    .count()
    .exec();
}
Schema.statics.countAll = countAll;

/**
 * Retrieve paginated medias list
 * @param search
 * @param category
 * @param limit
 * @param skip
 * @returns {Promise}
 */
function retrieve(search, category, limit = 10, skip = 0) {
  return this.find(getFind(search, category))
    .sort({ _id: 1 })
    .skip(skip)
    .limit(limit)
    .exec();
}
Schema.statics.retrieve = retrieve;

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
const GENRES = {
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
    return [];
  }

  const list = [];
  this.info.genre_ids.forEach(id => {
    const genre = GENRES[this.info.category].find(g => g.id === id);
    if (genre) {
      list.push(genre.name);
    }
  });
  return (list.length)
    ? list
    : [];
}
Schema.methods.getGenres = getGenres;

/**
 * Return an object of media data ready for API or display
 *
 * @returns {Object}
 */
function getApiData() {
  const file = this.file || {};
  const info = this.info || {};

  let created;
  if (this.created) {
    created = this.created.toISOString();
  }
  const removed = (this.removed)
    ? this.removed.toISOString()
    : false;

  const category = (info.category === 'movie' || info.category === 'tv')
    ? info.category
    : 'unknown';

  let title;
  let originalTitle;
  let year;
  if (info.category === 'movie') {
    title = info.title;
    if (info.release_date) {
      year = info.release_date.substr(0, 4);
    }
    if (info.title !== info.original_title) {
      originalTitle = info.original_title;
    }
  } else if (info.category === 'tv') {
    title = info.name;
    if (info.name !== info.original_name) {
      originalTitle = info.original_name;
    }
  } else {
    title = info.title;
  }

  let genres;
  const genresRaw = this.getGenres();
  if (genresRaw.length) {
    genres = genresRaw.join(', ');
  }

  let votes;
  if (info.hasOwnProperty('vote_average') && info.hasOwnProperty('vote_count')) {
    votes = info.vote_count < 1
      ? '0 vote'
      : `${info.vote_average}/10 on ${info.vote_count} vote(s)`;
  }

  let codec;
  if (info.codec) {
    codec = info.codec;
  }
  if (info.audio && info.audio !== info.codec) {
    if (info.codec) {
      codec += ', ';
    } else {
      codec = '';
    }
    codec += info.audio;
  }

  let quality;
  if (info.quality) {
    quality = info.quality;
  }
  if (info.resolution && info.resolution !== info.quality) {
    if (info.quality) {
      quality += ', ';
    } else {
      quality = '';
    }
    quality += info.resolution;
  }

  let size;
  const sizeRaw = parseInt(file.size, 10);
  if (!isNaN(sizeRaw) && typeof sizeRaw === 'number') {
    if (sizeRaw > (1024 * 1024 * 1024)) {
      size = Math.round(sizeRaw / (1024 * 1024 * 1024) * 100) / 100;
      size = `${size}Go`;
    } else if (sizeRaw > (1024 * 1024)) {
      size = Math.round(sizeRaw / (1024 * 1024) * 100) / 100;
      size = `${size}Mo`;
    } else if (sizeRaw > 1024) {
      size = Math.round(sizeRaw / (1024) * 100) / 100;
      size = `${size}ko`;
    } else if (sizeRaw > 0) {
      size = `${sizeRaw}o`;
    } else {
      size = 0;
    }
  }

  const raw = {
    path: this.path,
    id: this.id,
    created,
    removed,
    category,
    // general
    poster: this.getPosterUrl(342),
    title,
    original_title: originalTitle,
    genres,
    overview: info.overview,
    // votes
    votes,
    popularity: info.popularity,
    // movie only
    year,
    // tv only
    season: info.season,
    episode: info.episode,
    // technicals
    codec,
    quality,
    // language
    language: info.excess,
    // file
    size,
    dir: file.dir,
    base: file.base,
  };

  // remove undefined
  const clean = {};
  Object.keys(raw).filter(k => raw[k] !== undefined).forEach(k => (clean[k] = raw[k]));

  return clean;
}
Schema.methods.getApiData = getApiData;

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
