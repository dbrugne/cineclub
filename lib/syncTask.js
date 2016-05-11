const debug = require('./debug');
const syncSftp = require('./syncSftp');
const syncFilter = require('./syncFilter');
const syncDecorate = require('./syncDecorate');
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
      modelMedias.retrieveActive()
        .then((mongoFiles) => res({ sftpFiles, mongoFiles }), rej);
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
