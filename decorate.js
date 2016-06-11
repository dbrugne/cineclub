if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

require('./lib/util/mongo')(process.env.MONGODB_URI || 'mongodb://localhost/test');
const decorateTask = require('./lib/decorate/task');
const exit = require('exit');

const tmdb = require('./lib/tmdb/index');

decorateTask({
  api: tmdb(process.env.TMDB_API_KEY),
})
  .then(() => exit(0))
  .catch((err) => {
    console.error(err);
    exit(1);
  });
