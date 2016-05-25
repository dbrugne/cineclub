const express = require('express');
const router = express.Router();

const Media = require('../../models/media');
const decorate = require('../../decorate/index');
const render = require('../../push/render');
const tmdbApi = require('moviedb');

router.get('/', (req, res, next) => {
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

  let added;
  let removed;
  Media.retrieveAdded(period)
    .then(docs => decorate(docs, opts))
    .then(docs => { added = docs; })
    .then(() => Media.retrieveRemoved(period))
    .then(docs => { removed = docs; })
    .then(() => render(added, removed, opts))
    .then(html => res.end(html))
    .catch(err => next(err));
});

module.exports = router;
