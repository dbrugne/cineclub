const Client = require('ssh2').Client;
const { resolve, parse } = require('path');
const debug = require('./debug');

const listFiles = (sftp, filepath) => {
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
        return [{
          name: info.base,
          path: filepath,
          data: {
            info,
            attrs: {
              mode: stats.mode,
              uid: stats.uid,
              gid: stats.gid,
              size: stats.size,
              atime: stats.atime,
              mtime: stats.mtime,
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
          children.map(child => listFiles(sftp, resolve(filepath, child.filename)))
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
  const start = Date.now();
  connect(opts, (err, connection, sftp) => {
    if (err) {
      return reject(err);
    }

    return listFiles(sftp, opts.dir)
      .then((files) => {
        debug('SFTP duration :: ', Date.now() - start, 'ms');
        debug('SFTP :: disconnecting');
        connection.end();

        res(files);
      })
      .catch((_err) => reject(_err));
  });
});
