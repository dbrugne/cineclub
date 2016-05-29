const Media = require('../models/media');
const decorate = require('../decorate/index');

module.exports = (period, opts) => new Promise((resolve, reject) => {
  const movies = [];
  const episodes = [];
  const unknown = [];
  let series = {};
  let removed;
  return Media.retrieveAdded(period)
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
    .then(() => resolve({
      period,
      movies,
      series,
      unknown,
      removed,
    }))
    .catch(reject);
});
