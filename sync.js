if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

require('./lib/util/mongo')(process.env.MONGODB_URI || 'mongodb://localhost/test');
const syncTask = require('./lib/sync/task');
const exit = require('exit');

const SftpDriver = require('./lib/sync/sftp');
const factory = require('./lib/sync/ignore');

const driver = new SftpDriver({
  host: process.env.SFTP_HOST,
  port: process.env.SFTP_PORT || 22,
  username: process.env.SFTP_USERNAME,
  password: process.env.SFTP_PASSWORD,
});

const ignore = factory(process.env.SFTP_IGNORE, process.env.SFTP_DIR);

syncTask({
  driver,
  ignore,
  dir: process.env.SFTP_DIR,
})
  .then(() => exit(0))
  .catch((err) => {
    console.error(err);
    exit(1);
  });
