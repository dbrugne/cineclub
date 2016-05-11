const modelMedias = require('./../models/medias');
const ejs = require('./../ejs');
const premailer = require('./premailer');

// @todo : IMDB
const tmpCover = 'http://ia.media-imdb.com/images/M/MV5BMTc5NzQzNjk2NF5BMl5BanBnXkFtZTgwODU0MjI5NjE@._V1_SX300.jpg';
const tmpDesc = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

module.exports = (opts) => new Promise((resolve, reject) => {
  const bag = Object.assign({
    period: 1, // days
    premailer: true,
    subject: 'Default title',
    movies: [],
    series: [],
    removed: [],
    unparsed: [],
  }, opts);
  return modelMedias.retrieveAdded(bag.period)
    .then((list) => {
      if (!list || !list.length) {
        return;
      }

      // prepare movies
      const movies = list.filter(m => m.category === 'movie');
      if (movies.length) {
        bag.movies = movies.map(m => {
          const underline = [];
          if (m.data.torrent.year) {
            underline.push(`year: ${m.data.torrent.year}`);
          }
          if (m.data.torrent.resolution) {
            underline.push(`resolution: ${m.data.torrent.resolution}`);
          }
          return {
            cover: tmpCover,
            title: m.data.torrent.title,
            underline: underline.join(' - '),
            description: tmpDesc,
            url: `${opts.baseUrl}/medias/${m.id}`,
          };
        });
      }

      // prepare TV
      const episodes = list.filter(m => m.category === 'tv');
      const series = {};
      if (episodes.length) {
        episodes.forEach(e => {
          if (!series[e.data.torrent.title]) {
            series[e.data.torrent.title] = {
              cover: tmpCover,
              title: e.data.torrent.title,
              episodes: [],
            };
          }

          series[e.data.torrent.title].episodes.push({
            title: e.data.torrent.episodeName,
            season: e.data.torrent.season,
            episode: e.data.torrent.episode,
            url: `${opts.baseUrl}/medias/${e.id}`,
          });
        });

        bag.series = Object.keys(series).map(k => series[k]);
      }

      // prepare unparsed
      const unparsed = list.filter(m => !m.category);
      if (unparsed.length) {
        bag.unparsed = unparsed.map(u => ({
          title: u.name,
          path: u.path,
          url: `${opts.baseUrl}/medias/${u.id}`,
        }));
      }
    })
    .then(() => modelMedias.retrieveRemoved(bag.period))
    .then((list) => { bag.removed = list; })
    .then(() => ejs('./views/email-daily.html', bag, {}))
    .then((html) => ((bag.premailer === true)
      ? premailer(html)
      : html))
    .then((html) => resolve(html))
    .catch((err) => reject(err));
});
