if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

require('./lib/util/mongo')(process.env.MONGODB_URI || 'mongodb://localhost/test');
const pushTask = require('./lib/push/index');

pushTask({
  to: process.env.MAIL_TO,
  from: process.env.MAIL_FROM,
  replyTo: process.env.MAIL_REPLY_TO,
  toStub: process.env.MAIL_STUB,
  baseUrl: process.env.BASE_URL,
  mailgunDomain: process.env.MAILGUN_DOMAIN,
  mailgunApiKey: process.env.MAILGUN_API_KEY,
  subjectTemplate: process.env.MAIL_SUBJECT,
});
