const express = require('express');
const router = express.Router();

const whatsnew = require('../../util/whatsnew');
const render = require('../../push/render');
const tmdbApi = require('moviedb');

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
    baseUrl: process.env.BASE_URL,
    replyTo: process.env.MAIL_REPLY_TO,
    premailer,
    api: tmdbApi(process.env.TMBDP_API_KEY),
  };

  whatsnew(period, opts)
    .then(json => render(json, opts))
    .then(html => res.end(html))
    .catch(err => next(err));
});

module.exports = router;
