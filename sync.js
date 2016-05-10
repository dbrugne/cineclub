require('dotenv').config();
const debug = require('./lib/debug');
const syncSftp = require('./lib/syncSftp');
const syncFilter = require('./lib/syncFilter');
const syncDecorate = require('./lib/syncDecorate');
const mongoConnect = require('./lib/mongoConnect');
const modelMedias = require('./lib/models/medias');
const syncDiff = require('./lib/syncDiff');
const syncDatabase = require('./lib/syncDatabase');

function syncTask() {
  syncSftp({
    host: process.env.HOST,
    port: process.env.PORT || 22,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    dir: process.env.DIR,
  })
    .then((files) => syncFilter(files))
    .then((files) => files.sort()) // allow faster diff computing
    .then((files) => syncDecorate(files))
    .then((sftpFiles) => new Promise((res, rej) => {
      mongoConnect(process.env.MONGO_DB || 'mongodb://localhost/test')
        .then(() => modelMedias.fastList())
        .then((mongoFiles) => res({ sftpFiles, mongoFiles }))
        .catch((err) => rej(err));
    }))
    .then((bag) => syncDiff(bag.sftpFiles, bag.mongoFiles))
    .then((lists) => syncDatabase(lists))
    .then(files => debug(files))
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
};

syncTask();