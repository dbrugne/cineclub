const debug = require('../util/debug');
const syncTree = require('./tree');
const syncFilter = require('./filter');
const syncDiff = require('./diff');
const Medias = require('../models/medias');

module.exports = (opts) => new Promise((resolve, reject) => {
  syncTree(opts.driver, opts.ignore, opts.dir)
    .then((files) => syncFilter(files))
    .then((sftpFiles) => new Promise((res, rej) => {
      Medias.retrieveActive()
        .then((mongoFiles) => res({ sftpFiles, mongoFiles }), rej);
    }))
    .then((bag) => syncDiff(bag.sftpFiles, bag.mongoFiles))
    .then((lists) => new Promise((res, rej) => {
      Medias.createNewMedias(lists.added)
        .then(() => Medias.tagRemoved(lists.removed))
        .then(() => Medias.purge())
        .then(() => debug(`added: ${lists.added.length} removed: ${lists.removed.length}`))
        .then(() => res(lists))
        .catch((err) => rej(err));
    }))
    .then(() => resolve())
    .catch(err => reject(err));
});
