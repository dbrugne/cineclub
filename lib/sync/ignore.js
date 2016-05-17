const { sep } = require('path');

module.exports = (ignore, dir) => {
  if (!ignore) {
    return () => false;
  }

  let baseDir = dir || '/';
  baseDir = (baseDir.length >= 2 && baseDir[baseDir.length - 1] === sep)
    ? baseDir.substr(0, baseDir.length - 1) // strip trailing slash
    : baseDir;

  const ignores = ignore.split(',');
  if (!ignores.length) {
    return () => false;
  }

  const rules = ignores.map(r => {
    let pattern = r;
    if (pattern[0] === '/') {
      // pattern begins with '/', look for path relative to 'dir'
      pattern = `^${baseDir}${pattern}.*$`;
    } else {
      if (pattern.indexOf('*') !== -1) {
        // pattern contains *
        pattern = r.replace(/\*/m, '.*');
      }

      // look for whole pattern in path
      pattern = `^.*${pattern}.*$`;
    }

    return new RegExp(pattern);
  });

  return path => !(rules.findIndex(r => r.test(path)) === -1);
};
