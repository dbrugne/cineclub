if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

require('./lib/util/mongo')(process.env.MONGODB_URI || 'mongodb://localhost/test');
const pushTask = require('./lib/push/index');
const exit = require('exit');

const tmdb = require('./lib/util/tmdb');

pushTask({
  to: process.env.MAIL_TO,
  from: process.env.MAIL_FROM,
  replyTo: process.env.MAIL_REPLY_TO,
  toStub: process.env.MAIL_STUB,
  baseUrl: process.env.BASE_URL,
  mailgunDomain: process.env.MAILGUN_DOMAIN,
  mailgunApiKey: process.env.MAILGUN_API_KEY,
  subjectTemplate: process.env.MAIL_SUBJECT,
  api: tmdb(process.env.TMDB_API_KEY),
  period: process.env.PUSH_PERIOD, // days
})
  .then(() => exit(0))
  .catch((err) => {
    console.error(err);
    exit(1);
  });
