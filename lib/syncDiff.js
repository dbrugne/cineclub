module.exports = (sftp, mongo) => {
  const sftpIndex = (sftp && sftp.length)
    ? sftp.map(f => f.path)
    : [];
  const mongoIndex = (mongo && mongo.length)
    ? mongo.map(f => f.path)
    : [];

  let added = sftpIndex.filter((x) => mongoIndex.indexOf(x) === -1);
  let removed = mongoIndex.filter((x) => sftpIndex.indexOf(x) === -1);

  if (added && added.length) {
    added = sftp.filter((f) => added.indexOf(f.path) !== -1);
  }
  if (removed && removed.length) {
    removed = mongo.filter((f) => removed.indexOf(f.path) !== -1);
  }

  return {
    added,
    removed,
  };
};
