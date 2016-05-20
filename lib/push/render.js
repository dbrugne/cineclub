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
    if (!m.info || !m.info.category) {
      unparsed.push(m);
    } else if (m.info.category === 'movie') {
      movies.push(m);
    } else if (m.info.category === 'tv') {
      episodes.push(m);
    } else {
      unparsed.push(m);
    }
  });

  // prepare movies
  if (movies.length) {
    data.movies = movies.map(m => {
      const title = m.info.title !== m.info.original_title
        ? `${m.info.title} (${m.info.original_title})`
        : m.info.title;
      const year = m.info.release_date
        ? m.info.release_date.substr(0, 4)
        : '';
      const vote = Object.keys(m.info).indexOf('vote_average')
        ? `${m.info.vote_average}/10 on ${m.info.vote_count} vote(s)`
        : '';
      let genres = m.getGenres();
      if (genres.length) {
        genres = genres.join(', ');
      }
      let overview = m.info.overview
        ? m.info.overview
        : '';
      if (overview.length >= 350) {
        overview = `${overview.substr(0, 350)} (...)`;
      }
      return {
        cover: m.getPosterUrl(),
        title,
        year,
        genres,
        vote,
        overview,
        url: `${opts.baseUrl}/media/${m.id}`,
      };
    });
  }

  // prepare TV
  const series = {};
  if (episodes.length) {
    episodes.forEach(m => {
      const title = m.info.name !== m.info.original_name
        ? `${m.info.name} (${m.info.original_name})`
        : m.info.name;
      if (!series[title]) {
        const vote = Object.keys(m.info).indexOf('vote_average')
          ? `${m.info.vote_average}/10 on ${m.info.vote_count} vote(s)`
          : '';
        let genres = m.getGenres();
        if (genres.length) {
          genres = genres.join(', ');
        }
        let overview = m.info.overview
          ? m.info.overview
          : '';
        if (overview.length >= 100) {
          overview = `${overview.substr(0, 100)} (...)`;
        }
        series[title] = {
          cover: m.getPosterUrl(),
          title,
          overview,
          genres,
          vote,
          episodes: [],
        };
      }

      series[title].episodes.push({
        season: m.info.season,
        episode: m.info.episode,
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
