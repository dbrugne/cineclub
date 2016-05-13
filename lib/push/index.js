const debug = require('../util/debug');
const generateDailyEmail = require('./emailGenerator');
const mailgun = require('../util/mailgun');
const exit = require('exit');

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

module.exports = (opts) => {
  const options = Object.assign({
    subject: getSubject(opts),
  }, opts);
  generateDailyEmail(options)
    .then((html) => mailgun(opts)(options.to, options.subject, html))
    .then((...args) => debug(args))
    .then(() => exit(0))
    .catch((err) => {
      console.error(err);
      exit(1);
    });
};
