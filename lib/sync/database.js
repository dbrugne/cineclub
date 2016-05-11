const Medias = require('./../models/medias');

module.exports = (lists) => new Promise((res, rej) => {
  Medias.createNewMedias(lists.added)
    .then(() => Medias.tagRemoved(lists.removed))
    .then(() => Medias.purge())
    .then(() => res(lists))
    .catch((err) => rej(err));
});
