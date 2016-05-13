const fs = require('fs');

module.exports = function FileSystemDriver() {
  this.connect = () => new Promise(resolve => resolve());
  this.disconnect = () => {};
  this.readdir = (dir) => new Promise((res, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) {
        return reject(err);
      }

      return res(files);
    });
  });
  this.stat = (dir) => new Promise((res, reject) => {
    fs.stat(dir, (err, stat) => {
      if (err) {
        return reject(err);
      }

      return res(stat);
    });
  });
};
