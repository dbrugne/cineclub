const debug = require('./../debug');
const syncSftp = require('./sftp');
const syncFilter = require('./filter');
const syncDecorate = require('./decorate');
const modelMedias = require('./../models/medias');
const syncDiff = require('./diff');
const syncDatabase = require('./database');
const exit = require('exit');

module.exports = (opts) => {
  syncSftp(opts)
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
      debug(`added: ${files.added.length} removed: ${files.removed.length}`);
    })
    .then(() => exit(0))
    .catch((err) => {
      console.error(err);
      exit(1);
    });
};
