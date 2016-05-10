const debug = require('./debug');
const syncSftp = require('./syncSftp');
const syncFilter = require('./syncFilter');
const syncDecorate = require('./syncDecorate');
const mongoConnect = require('./mongoConnect');
const modelMedias = require('./models/medias');
const syncDiff = require('./syncDiff');
const syncDatabase = require('./syncDatabase');

module.exports = () => {
  syncSftp({
    host: process.env.HOST,
    port: process.env.PORT || 22,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    dir: process.env.DIR,
    ignore: process.env.IGNORE,
  })
    .then((files) => syncFilter(files))
    .then((files) => files.sort()) // allow faster diff computing
    .then((files) => syncDecorate(files))
    .then((sftpFiles) => new Promise((res, rej) => {
      mongoConnect(process.env.MONGO_DB || 'mongodb://localhost/test')
        .then(() => modelMedias.retrieveActive())
        .then((mongoFiles) => res({ sftpFiles, mongoFiles }))
        .catch((err) => rej(err));
    }))
    .then((bag) => syncDiff(bag.sftpFiles, bag.mongoFiles))
    .then((lists) => syncDatabase(lists))
    .then(files => {
      debug(files);
      debug(`added: ${files.added.length}  removed: ${files.removed.length}`);
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
};
