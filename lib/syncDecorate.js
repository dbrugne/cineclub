const parser = require('parse-torrent-name');
const { sep } = require('path');

function isParsed(obj) {
  return (obj && (obj.year || obj.episodeName || obj.season || obj.episode ||
  obj.group || obj.resolution || obj.year));
}

module.exports = (files) => files.map((f) => {
  const torrent = parser(f.data.info.name);
  if (!isParsed(torrent)) {
    // add parent to name only if parsing failed
    const parents = f.data.info.dir.split(sep);
    const parent = parents[parents.length - 1];
    return Object.assign(f, { name: parent + sep + f.name });
  }

  const file = Object.assign({}, f);
  file.data.torrent = torrent;
  file.category = (torrent.season || torrent.episode)
    ? 'tv'
    : 'movie';

  return file;
});
