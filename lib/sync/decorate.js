const parser = require('parse-torrent-name');
const { sep } = require('path');

function isParsed(obj) {
  return (obj && (obj.year || obj.episodeName || obj.season || obj.episode ||
  obj.resolution));
}

module.exports = (files) => files.map((f) => {
  const file = Object.assign({}, f);
  let torrent = parser(f.data.info.name);
  if (!isParsed(torrent)) {
    // add parent to name
    const parents = f.data.info.dir.split(sep);
    const parent = parents[parents.length - 1];
    file.name = parent + sep + file.name;

    // try parsing parent
    torrent = parser(parent);
    if (!isParsed(torrent)) {
      return file;
    }
  }

  file.data.torrent = torrent;
  file.category = (torrent.season || torrent.episode)
    ? 'tv'
    : 'movie';

  return file;
});
