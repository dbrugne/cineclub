const ejs = require('../util/ejs');
const premailer = require('./premailer');

module.exports = (whatsnew, opts) => new Promise((resolve, reject) => {
  const data = {
    subject: opts.subject || 'Default title',
    baseUrl: opts.baseUrl,
    replyTo: opts.replyTo,
    movies: whatsnew.movies,
    series: whatsnew.series,
    removed: whatsnew.removed,
    unparsed: whatsnew.unparsed,
  };

  ejs('./views/email.ejs', data, {})
    .then((html) => ((opts.premailer === true)
      ? premailer(html)
      : html))
    .then((html) => resolve(html))
    .catch((err) => reject(err));
});
