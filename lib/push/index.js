const debug = require('../util/debug');
const generateDailyEmail = require('./emailGenerator');
const mailgun = require('../util/mailgun');

const i18n = {
  day: [
    'lundi',
    'mardi',
    'merecredi',
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
  }, opts);
  generateDailyEmail(options)
    .then((html) => mailgun(opts)(options.to, options.subject, html))
    .then((...args) => debug(args))
    .then(() => resolve())
    .catch(err => reject(err));
});
