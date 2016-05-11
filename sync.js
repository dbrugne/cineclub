require('dotenv').config();
require('./lib/mongo')(process.env.MONGO_DB || 'mongodb://localhost/test');
const syncTask = require('./lib/sync/index');

syncTask({
  host: process.env.HOST,
  port: process.env.PORT || 22,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  dir: process.env.DIR,
  ignore: process.env.IGNORE,
});
