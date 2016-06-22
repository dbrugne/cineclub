const { parse, sep } = require('path');
const parser = require('parse-torrent-name');

const isParsed = (obj) => (obj && obj.title && (obj.year || obj.season || obj.episode));

module.exports = (filepath) => {
  const info = parse(filepath);
  const name = info.name;
  let torrent = parser(name);
  if (isParsed(torrent)) {
    return torrent;
  }

  // parent
  const parents = info.dir.split(sep);
  const parent = (parents.length)
    ? parents[parents.length - 1]
    : null;
  torrent = parser(parent);
  if (isParsed(torrent)) {
    return torrent;
  }

  return undefined;
};
