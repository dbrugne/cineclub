const express = require('express');
const router = express.Router();

const Media = require('../lib/models/media');
const decorate = require('../lib/decorate/index');
const render = require('../lib/push/render');
const tmdbApi = require('moviedb');

/* GET home page. */
router.get('/', (req, res, next) => {
  const opts = {
    baseUrl: process.env.BASE_URL,
    replyTo: process.env.MAIL_REPLY_TO,
    premailer: false,
    api: tmdbApi(process.env.TMBDP_API_KEY),
  };
  const period = 1; // day
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
