const Medias = require('./models/medias');

// untag 'new' medias older than 24h
const untagNews = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const query = {
    isNew: true,
    created: { $lt: d },
  };
  const update = { isNew: false };
  return Medias.update(query, update, { multi: true }).exec();
};

// create 'new' medias
const createNews = (list) => {
  if (list && list.length) {
    const docs = list.map(f => {
      return {
        name: f.name,
        path: f.path,
        created: new Date(),
        new: true,
        removed: false,
        data: f.data,
      };
    });

    return Medias.collection.insert(docs);
  }
};

// tag 'removed' medias
const tagRemoved = (list) => {
  const ids = list.map((f) => f.path);
  const query = { path: { $in: ids } };
  const update = {
    removed: true,
    removed_at: Date.now(),
  };
  return Medias.update(query, update, { multi: true }).exec();
};

// remove 'removed' medias older than 1w
const purge = () => {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  const query = {
    removed: true,
    removed_at: { $lt: d },
  };
  return Medias.remove(query, { multi: true }).exec();
};

module.exports = (lists) => new Promise((res, rej) => {
  untagNews()
    .then(() => createNews(lists.added))
    .then(() => tagRemoved(lists.removed))
    .then(() => purge(lists.removed))
    .then(() => res(lists))
    .catch((err) => rej(err));
});
