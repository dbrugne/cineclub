const ejs = require('../util/ejs');
const premailer = require('./premailer');

module.exports = (added, removed, opts) => new Promise((resolve, reject) => {
  const data = {
    subject: opts.subject || 'Default title',
    baseUrl: opts.baseUrl,
    replyTo: opts.replyTo,
    movies: [],
    tv: [],
    removed: [],
    unparsed: [],
  };

  const movies = [];
  const episodes = [];
  const unparsed = [];
  added.forEach(m => {
    const obj = m.getApiData();
    if (obj.category === 'movie') {
      movies.push(obj);
    } else if (obj.category === 'tv') {
      episodes.push(obj);
    } else {
      unparsed.push(obj);
    }
  });

  // prepare TV
  const series = {};
  if (episodes.length) {
    episodes.forEach(m => {
      if (!series[m.title]) {
        const obj = Object.assign({ episodes: [] }, m);
        if (obj.overview) {
          if (obj.overview.length >= 100) {
            obj.overview = `${obj.overview.substr(0, 100)} (...)`;
          }
        }
        delete obj.season;
        delete obj.episode;
        series[m.title] = obj;
      }

      series[m.title].episodes.push({
        season: m.season,
        episode: m.episode,
        url: `${opts.baseUrl}/media/${m.id}`,
      });
    });

    data.tv = Object.keys(series).map(k => series[k]);
  }

  const baseDir = process.env.SFTP_DIR || false;

  // prepare unparsed
  if (unparsed.length) {
    data.unparsed = unparsed.map(u => ({
      path: (baseDir) ? u.path.replace(baseDir, '') : u.path,
      url: `${opts.baseUrl}/media/${u.id}`,
    }));
  }

  // prepare removed
  if (removed.length) {
    data.removed = removed.map(u => ({
      path: (baseDir) ? u.path.replace(baseDir, '') : u.path,
      url: `${opts.baseUrl}/media/${u.id}`,
    }));
  }

  ejs('./views/email.ejs', data, {})
    .then((html) => ((opts.premailer === true)
      ? premailer(html)
      : html))
    .then((html) => resolve(html))
    .catch((err) => reject(err));
});
