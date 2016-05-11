if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

require('./lib/mongo')(process.env.MONGODB_URI || 'mongodb://localhost/test');
const syncTask = require('./lib/sync/index');

syncTask({
  host: process.env.SFTP_HOST,
  port: process.env.SFTP_PORT || 22,
  username: process.env.SFTP_USERNAME,
  password: process.env.SFTP_PASSWORD,
  dir: process.env.SFTP_DIR,
  ignore: process.env.SFTP_IGNORE,
});
