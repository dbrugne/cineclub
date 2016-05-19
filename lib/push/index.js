const debug = require('../util/debug');
const Media = require('../models/media');
const decorate = require('../decorate/index');
const tmdbApi = require('moviedb');
const render = require('./render');
const mailgun = require('./mailgun');

const i18n = {
  day: [
    'lundi',
    'mardi',
    'mercredi',
    'jeudi',
    'vendredi',
    'samedi',
    'dimanche',
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
  const dd = i18n.day[date.getDay() - 1];
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
  }, opts);

  const period = 1; // day
  let added;
  let removed;
  Media.retrieveAdded(period)
    .then(docs => decorate(docs, options))
    .then(docs => { added = docs; })
    .then(() => Media.retrieveRemoved(period))
    .then(docs => { removed = docs; })
    .then(() => render(added, removed, options))
    .then(html => mailgun(opts)(options.to, options.subject, html))
    .then((...args) => debug(args))
    .then(() => resolve())
    .catch(err => reject(err));
});
