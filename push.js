require('dotenv').config();
require('./lib/mongoConnect')(process.env.MONGO_DB || 'mongodb://localhost/test');
const pushTask = require('./lib/pushTask');

pushTask({
  to: process.env.MAIL_TO,
  baseUrl: process.env.BASE_URL,
  replyTo: process.env.MAIL_REPLY_TO,
});
