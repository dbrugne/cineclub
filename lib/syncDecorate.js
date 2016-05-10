const parser = require('parse-torrent-name');

function isParsed(obj) {
  return (obj && (obj.year || obj.episodeName || obj.season || obj.episode ||
  obj.group || obj.resolution || obj.year));
}

module.exports = (files) => files.map((f) => {
  const torrent = parser(f.data.info.name);
  if (!isParsed(torrent)) {
    return f;
  }

  const data = f.data;
  data.torrent = torrent;
  return Object.assign(f, { data });
});
