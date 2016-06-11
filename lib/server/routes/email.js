const { Router } = require('express');
const router = new Router();

const whatsnew = require('../../util/whatsnew');
const render = require('../../push/render');

router.get('/', (req, res, next) => {
  let period = 1; // days
  if (req.query && req.query.period) {
    const int = parseInt(req.query.period, 10);
    if (int >= 1 && int <= 10) {
      period = req.query.period;
    }
  }

  const premailer = (req.query && req.query.premailer === 'true');
  const opts = {
    baseUrl: req.app.locals.baseUrl,
    replyTo: req.app.locals.replyTo,
    premailer,
    api: req.app.locals.tmdbApi,
  };

  whatsnew(period, opts)
    .then(json => render(json, opts))
    .then(html => res.end(html))
    .catch(err => next(err));
});

module.exports = router;
