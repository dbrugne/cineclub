const debug = require('../util/debug');
const whatsnew = require('../util/whatsnew');
const tmdbApi = require('moviedb');
const render = require('./render');
const mailgun = require('./mailgun');

const i18n = {
  day: [
    'dimanche',
    'lundi',
    'mardi',
    'mercredi',
    'jeudi',
    'vendredi',
    'samedi',
  ],
  month: [
    'janvier',
    'février',
    'mars',
    'avril',
    'mai',
    'juin',
    'juillet',
    'août',
    'septembre',
    'octobre',
    'novembre',
    'décembre',
  ],
};
function getSubject(opts) {
  const template = opts.subjectTemplate || '%today';
  const date = new Date();
  const dd = i18n.day[date.getDay()];
  const d = date.getDate();
  const m = i18n.month[date.getMonth()];
  const y = date.getFullYear();
  const today = `${dd} ${d} ${m} ${y}`;
  return template.replace('%today', today);
}

module.exports = (opts) => new Promise((resolve, reject) => {
  const options = Object.assign({
    subject: getSubject(opts),
    api: tmdbApi(opts.tmdbApiKey),
    premailer: true,
  }, opts);

  const period = opts.period || 1;
  debug(`PUSH :: push email for period of last ${period} day(s)`);
  whatsnew(period, options)
    .then(json => {
      if (!json.movies && !json.series && !json.unknown) {
        debug('PUSH :: nothing to send, stop');
        resolve();
        return Promise.resolve();
      }

      return render(json, options);
    })
    .then(html => mailgun(opts)(options.to, options.subject, html))
    .then((...args) => debug(args))
    .then(() => resolve())
    .catch(err => reject(err));
});
