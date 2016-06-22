const mongoose = require('mongoose');
const debug = require('../util/debug');

/**
 * Note on .decoration field:
 * - undecorated: to be parsed and decorated
 * - failed: decoration wasn't able to determine info.category as enum(movie, tv)
 * - decorated: info.category is one of enum(movie, tv)
 */
const D_UNDECORATED = 'undecorated';
const D_FAILED = 'failed';
const D_DECORATED = 'decorated';

const Schema = new mongoose.Schema({
  path: { type: String },
  created: { type: Date },
  removed: { type: Date },
  decoration: {
    type: String,
    enum: [D_UNDECORATED, D_FAILED, D_DECORATED],
    default: D_UNDECORATED,
  },
  file: mongoose.Schema.Types.Mixed,
  torrent: mongoose.Schema.Types.Mixed,
  info: mongoose.Schema.Types.Mixed,
});

Schema.index({ created: -1 }, { name: 'created' });
Schema.index({ removed: -1 }, { name: 'removed' });
Schema.index({
  'info.title': 'text',
  'info.original_title': 'text',
  'info.name': 'text',
  'info.original_name': 'text',
  'info.overview': 'text',
  'file.name': 'text',
  path: 'text',
}, {
  default_language: 'french',
  name: 'fulltext',
  weights: {
    'info.title': 3,
    'info.original_title': 3,
    'info.name': 3,
    'info.original_name': 3,
    'info.overview': 2,
    'file.name': 1,
    path: 1,
  },
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
 * Return query for given search and type
 * @param search
 * @param type
 * @returns {Object}
 */
function getFind(search, type) {
  const criteria = { removed: { $exists: false } };
  if (search) {
    Object.assign(criteria, { $text: { $search: search, $language: 'fr' } });
  }
  if (type) {
    if (type === D_FAILED) {
      criteria.decoration = D_FAILED;
    } else if (type === 'movie' || type === 'tv') {
      criteria['info.category'] = type;
    } else if (type === D_UNDECORATED) {
      criteria.decoration = D_UNDECORATED;
    } else {
      criteria.decoration = D_DECORATED;
    }
  }

  return criteria;
}

/**
 * Count medias
 * @param search
 * @param type
 * @returns {Promise}
 */
function countAll(search, type) {
  return this.find(getFind(search, type))
    .count()
    .exec();
}
Schema.statics.countAll = countAll;

/**
 * Retrieve paginated medias list
 * @param search
 * @param type
 * @param limit
 * @param skip
 * @returns {Promise}
 */
function retrieve(search, type, limit = 10, skip = 0) {
  const find = getFind(search, type);
  debug('getFind', find);

  const meta = (search)
    ? { score: { $meta: 'textScore' } }
    : {};

  const sort = (search)
    ? { score: { $meta: 'textScore' } }
    : { created: -1 };

  return this.find(find, meta)
    .sort(sort)
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
 * List medias to decorate
 * @returns {Promise}
 */
function retrieveForDecoration() {
  return this.find({
    removed: { $exists: false },
    decoration: D_UNDECORATED,
  })
    .sort({ _id: 1 })
    .limit(500)
    .exec();
}
Schema.statics.retrieveForDecoration = retrieveForDecoration;

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
    decoration: D_UNDECORATED,
    file: f.file,
  }));

  return this.collection.insert(docs);
}
Schema.statics.createNewMedias = createNewMedias;

/**
 * Set .decoration and .info accordingly to 'info'
 * @param info
 * @returns {Promise|null}
 */
function setDecoration(info) {
  if (typeof info !== 'object' || !Object.keys(info).length) {
    this.decoration = D_FAILED;
  } else {
    this.info = info;
    if (info.category === 'movie' || info.category === 'tv') {
      this.decoration = D_DECORATED;
    } else {
      this.decoration = D_FAILED;
    }
  }
  return new Promise((resolve, reject) => {
    this.save((err) => {
      if (err) {
        return reject(err);
      }

      return resolve(this);
    });
  });
}
Schema.methods.setDecoration = setDecoration;

/**
 * Determines if current media is already decorated or not
 * @returns Boolean
 */
function shouldDecorate() {
  return (this.decoration === D_UNDECORATED || !this.info);
}
Schema.methods.shouldDecorate = shouldDecorate;

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
  const torrent = this.torrent || {};

  let created;
  if (this.created) {
    created = this.created.toISOString();
  }
  const removed = (this.removed)
    ? this.removed.toISOString()
    : false;

  let category;
  if (info.category === 'movie' || info.category === 'tv') {
    category = info.category;
  }

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
  if (torrent.codec) {
    codec = torrent.codec;
  }
  if (torrent.audio && torrent.audio !== torrent.codec) {
    if (torrent.codec) {
      codec += ', ';
    } else {
      codec = '';
    }
    codec += torrent.audio;
  }

  let quality;
  if (torrent.quality) {
    quality = torrent.quality;
  }
  if (torrent.resolution && torrent.resolution !== torrent.quality) {
    if (torrent.quality) {
      quality += ', ';
    } else {
      quality = '';
    }
    quality += torrent.resolution;
  }

  let tmdbVideos;
  if (info.episode
    && info.episode.videos
    && info.episode.videos.results
    && info.episode.videos.results.length) {
    tmdbVideos = info.episode.videos.results;
  } else if (info.videos && info.videos.results && info.videos.results.length) {
    tmdbVideos = info.videos.results;
  }
  let videos;
  if (tmdbVideos) {
    videos = tmdbVideos.filter(v => v.site === 'YouTube').map(({ key, name }) => ({
      key,
      name,
    }));
  }

  let tmdbImages;
  if (info.episode
    && info.episode.images
    && info.episode.images.stills
    && info.episode.images.stills.length) {
    tmdbImages = info.episode.images.stills;
  } else if (info.images && info.images.backdrops && info.images.backdrops.length) {
    tmdbImages = info.images.backdrops;
  }
  let images;
  if (tmdbImages) {
    images = tmdbImages.map(({ file_path, height, width }) => ({
      file_path,
      height,
      width,
    }));
  }

  let tmdbCredits;
  if (info.episode && info.episode.credits) {
    tmdbCredits = info.episode.credits;
  } else if (info.credits) {
    tmdbCredits = info.credits;
  }
  const credits = {};
  if (tmdbCredits) {
    if (tmdbCredits.crew && tmdbCredits.crew.length) {
      const direction = tmdbCredits.crew
        .filter(p => p.job === 'Director')
        .map(({ id, name, profile_path }) => ({
          id,
          name,
          profile_path,
        }));

      if (direction.length) {
        credits.direction = direction;
      }
    }

    let known = [];
    if (tmdbCredits.cast) {
      known = tmdbCredits.cast.map(p => p.id);
      const cast = tmdbCredits.cast
        .filter(p => p.order <= 10)
        .map(({ order, id, name, character, profile_path }) => ({
          order,
          id,
          character,
          name,
          profile_path,
        }))
        .sort((a, b) => ((a.order < b.order) ? -1 : 1));

      if (cast.length) {
        credits.cast = cast;
      }
    }
    if (tmdbCredits.guest_stars) {
      const guest = tmdbCredits.guest_stars
        .filter(p => known.indexOf(p.id) === -1)
        .map(({ id, name, character, profile_path }) => ({
          id,
          character,
          name,
          profile_path,
        }));

      if (guest.length) {
        credits.guest = guest;
      }
    }
  }

  let episodeInfo;
  if (info.episode) {
    episodeInfo = {
      name: info.episode.name,
      air_date: info.episode.air_date,
      overview: info.episode.overview,
    };
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
    tmdbId: info.id,
    imdbId: info.imdb_id,
    created,
    removed,
    decoration: this.decoration,
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
    season: torrent.season,
    episode: torrent.episode,
    // technicals
    codec,
    quality,
    // language
    language: torrent.excess,
    // file
    size,
    dir: file.dir,
    base: file.base,
    // medias
    videos,
    images,
    // other
    credits: (Object.keys(credits).length) ? credits : undefined,
    episodeInfo,
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
