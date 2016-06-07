const whatsnew = require('../../util/whatsnew');
const ApiError = require('./apiError');
const tmdb = require('../../util/tmdb');

module.exports = (req, res, next) => {
  let period = 1; // days
  if (req.query && req.query.period) {
    const int = parseInt(req.query.period, 10);
    if (int >= 1 && int <= 10) {
      period = req.query.period;
    } else {
      return next(new ApiError(400, 'page size should be in 1-10 range', '/query/period'));
    }
  }

  const opts = {
    api: tmdb(req.app.locals.tmdbApiKey),
  };
  return whatsnew(period, opts)
    .then(data => {
      const apize = m => ({
        data: m,
        links: {
          self: res.linker(`medias/${m.id}`),
        },
      });
      return {
        movies: data.movies.map(apize),
        series: data.series.map(apize),
        unknown: data.unknown.map(apize),
        removed: data.removed.map(apize),
      };
    })
    .then(data => res.type('application/vnd.api+json').json({
      data,
      links: {
        self: res.linker('whatsnew', { period }),
      },
    }))
    .catch(next);
};
