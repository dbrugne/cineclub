const { resolve, parse } = require('path');
const debug = require('../util/debug');

const leaf = (file, stats) => {
  const size = stats.size.toString();
  const mtime = new Date(stats.mtime * 1000);
  const info = parse(file);

  return [{
    path: file,
    file: Object.assign({
      size,
      mtime,
    }, info),
  }];
};

const branch = (driver, ignore, filepath) => new Promise((done, fail) => {
  if (ignore(filepath)) {
    debug('TREE :: ignoring', filepath);
    return done();
  }

  return driver.stat(filepath)
    .then(stats => {
      if (!stats.isDirectory()) {
        debug('TREE :: file found', filepath);
        return done(leaf(filepath, stats));
      }

      debug('TREE :: directory found', filepath);
      return driver.readdir(filepath)
        .then(children => {
          if (!children || !children.map) {
            // empty filepath
            return done([]);
          }
          return Promise.all(
            children.map(child => branch(driver, ignore, resolve(filepath, child)))
          );
        })
        .then(subtrees => {
          const trees = subtrees.filter(s => s);
          return done([].concat(...trees));
        })
        .catch(fail);
    })
    .catch(fail);
});

module.exports = (driver, ignore, dir) => new Promise((res, reject) => {
  const start = Date.now();
  driver.connect()
    .then(() => branch(driver, ignore, dir))
    .then((files) => {
      driver.disconnect();
      debug('TREE :: duration', Date.now() - start, 'ms');
      res(files);
    })
    .catch(reject);
});
