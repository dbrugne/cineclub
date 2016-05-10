const Client = require('ssh2').Client;
const { resolve, parse, sep } = require('path');
const debug = require('./debug');

const buildShouldBeIgnored = (ignore, dir) => {
  if (!ignore) {
    return () => false;
  }

  const baseDir = dir || '';
  let rules = ignore.split(',');
  rules = rules.map(i => new RegExp(`^${baseDir + i}.*`));
  return path => !(rules.findIndex(r => r.test(path)) === -1);
};

const listFiles = (sftp, filepath, shouldBeIgnored) => {
  if (shouldBeIgnored(filepath)) {
    return [];
  }

  const readdirAsync = (dir) => new Promise((res, reject) => {
    sftp.readdir(dir, (err, files) => {
      if (err) {
        return reject(err);
      }

      return res(files);
    });
  });
  const statAsync = (dir) => new Promise((res, reject) => {
    sftp.stat(dir, (err, stat) => {
      if (err) {
        return reject(err);
      }

      return res(stat);
    });
  });

  return statAsync(filepath)
    .then(stats => {
      if (!stats.isDirectory()) {
        const info = parse(filepath);
        const size = stats.size.toString();
        const atime = new Date(stats.atime * 1000);
        const mtime = new Date(stats.mtime * 1000);
        const parents = info.dir.split(sep);
        const parent = parents[parents.length - 1];

        return [{
          parent,
          name: info.base,
          path: filepath,
          size,
          created: mtime, // when discovered for the 1st time set with mtime (= creation time)
          data: {
            info,
            attrs: {
              mode: stats.mode,
              uid: stats.uid,
              gid: stats.gid,
              size,
              atime,
              mtime,
            },
            stats: {
              isDirectory: stats.isDirectory(),
              isFile: stats.isFile(),
            },
          },
        }];
      }

      return readdirAsync(filepath)
        .then(children => Promise.all(
          children.map(child => listFiles(sftp, resolve(filepath, child.filename), shouldBeIgnored))
        ))
        .then(subtrees => [].concat(...subtrees));
    });
};

const connect = (opts, callback) => {
  const connection = new Client();
  connection.on('ready', () => {
    debug('SFTP :: ready');
    connection.sftp((err, sftp) => {
      if (err) {
        return callback(err);
      }

      debug('SFTP :: mode is now SFTP');
      return callback(err, connection, sftp);
    });
  });
  connection.connect({
    host: opts.host,
    port: opts.port || 22,
    username: opts.username,
    password: opts.password,
  });
};

module.exports = (opts) => new Promise((res, reject) => {
  const shouldBeIgnored = buildShouldBeIgnored(opts.ignore, opts.dir);
  const start = Date.now();
  connect(opts, (err, connection, sftp) => {
    if (err) {
      return reject(err);
    }

    return listFiles(sftp, opts.dir, shouldBeIgnored)
      .then((files) => {
        debug('SFTP :: disconnecting');
        connection.end();
        debug('SFTP duration :: ', Date.now() - start, 'ms');
        res(files);
      })
      .catch((_err) => reject(_err));
  });
});
