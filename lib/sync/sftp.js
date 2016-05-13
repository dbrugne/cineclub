const debug = require('./../util/debug');
const Client = require('ssh2').Client;

module.exports = function SftpDriver(opts) {
  const options = Object.assign({}, opts);

  /**
   * SFTP connect
   */
  this.connect = () => new Promise((resolve, reject) => {
    this.ssh = new Client();
    this.ssh.on('ready', () => {
      debug('SFTP :: ready');
      this.ssh.sftp((err, sftp) => {
        if (err) {
          return reject(err);
        }

        debug('SFTP :: mode is now SFTP');
        this.sftp = sftp;
        return resolve();
      });
    });
    this.ssh.connect({
      host: options.host,
      port: options.port || 22,
      username: options.username,
      password: options.password,
    });
  });

  /**
   * SFTP disconnect
   */
  this.disconnect = () => {
    debug('SFTP :: disconnecting');
    this.ssh.end();
  };

  /**
   * SFTP readdir
   */
  this.readdir = (dir) => new Promise((res, reject) => {
    this.sftp.readdir(dir, (err, files) => {
      if (err) {
        return reject(err);
      }

      if (!files || !files.length) {
        return res();
      }

      return res(files.map(f => f.filename));
    });
  });

  /**
   * SFTP stat
   */
  this.stat = (dir) => new Promise((res, reject) => {
    this.sftp.stat(dir, (err, stat) => {
      if (err) {
        return reject(err);
      }

      return res(stat);
    });
  });
};
