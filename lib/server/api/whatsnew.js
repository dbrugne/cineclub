const Media = require('../../models/media');
const decorate = require('../../decorate/index');
const tmdbApi = require('moviedb');

module.exports = (req, res, next) => {
  const opts = {
    baseUrl: process.env.BASE_URL,
    replyTo: process.env.MAIL_REPLY_TO,
    premailer: false,
    api: tmdbApi(process.env.TMBDP_API_KEY),
  };

  let period = 1; // days
  if (req.query && req.query.period) {
    const int = parseInt(req.query.period, 10);
    if (int >= 1 && int <= 10) {
      period = req.query.period;
    }
  }

  const movies = [];
  const episodes = [];
  const unknown = [];
  let series = {};
  let removed;
  Media.retrieveAdded(period)
    .then(docs => decorate(docs, opts))
    .then(docs => {
      if (docs.length) {
        docs.forEach(d => {
          const obj = d.getApiData();
          if (obj.category === 'movie') {
            movies.push(obj);
          } else if (obj.category === 'tv') {
            episodes.push(obj);
          } else {
            unknown.push(obj);
          }
        });
      }
    })
    .then(() => {
      if (!episodes.length) {
        return;
      }

      const shows = {};
      episodes.forEach(m => {
        if (!shows[m.title]) {
          const obj = Object.assign({ episodes: [] }, m);
          delete obj.id;
          delete obj.season;
          delete obj.episode;
          shows[m.title] = obj;
        }

        shows[m.title].episodes.push({
          id: m.id,
          season: m.season,
          episode: m.episode,
        });
      });

      series = Object.keys(shows).map(k => shows[k]);
    })
    .then(() => Media.retrieveRemoved(period))
    .then(docs => {
      if (docs.length) {
        removed = docs.map(d => d.getApiData());
      }
    })
    .then(() => res.json({
      period,
      movies,
      series,
      unknown,
      removed,
    }))
    .catch(err => next(err));
};
