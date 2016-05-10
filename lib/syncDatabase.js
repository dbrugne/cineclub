const Medias = require('./models/medias');

module.exports = (lists) => new Promise((res, rej) => {
  Medias.untagNews()
    .then(() => Medias.createNews(lists.added))
    .then(() => Medias.tagRemoved(lists.removed))
    .then(() => Medias.purge(lists.removed))
    .then(() => res(lists))
    .catch((err) => rej(err));
});
