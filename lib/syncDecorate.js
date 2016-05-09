const parser = require('parse-torrent-name');

module.exports = (files) => files.map((f) => {
  const data = f.data;
  data.torrent = parser(f.data.info.name);
  return Object.assign(f, { data });
});
