if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

require('./lib/util/mongo')(process.env.MONGODB_URI || 'mongodb://localhost/test');
const Cache = require('./lib/models/cache');
const exit = require('exit');

Cache.purge()
  .then(() => exit(0))
  .catch((err) => {
    console.error(err);
    exit(1);
  });
