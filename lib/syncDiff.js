const debug = require('./debug');

module.exports = (sftp, mongo) => {
  const sftpIndex = (sftp && sftp.length)
    ? sftp.map(f => f.path)
    : [];
  const mongoIndex = (mongo && mongo.length)
    ? mongo.map(f => f.path)
    : [];

  // added
  let added = sftpIndex.filter((x) => {
    const r = (mongoIndex.indexOf(x) === -1);
    if (r) {
      debug(`DIFF :: added ${x}`);
    }
    return r;
  });
  if (added && added.length) {
    added = sftp.filter((f) => added.indexOf(f.path) !== -1);
  }

  // removed
  let removed = mongoIndex.filter((x) => {
    const r = (sftpIndex.indexOf(x) === -1);
    if (r) {
      debug(`DIFF :: removed ${x}`);
    }
    return r;
  });
  if (removed && removed.length) {
    removed = mongo.filter((f) => removed.indexOf(f.path) !== -1);
  }

  return {
    added,
    removed,
  };
};
