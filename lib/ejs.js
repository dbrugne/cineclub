const ejs = require('ejs');

module.exports = (filename, data, opts) => new Promise((resolve, reject) => {
  ejs.renderFile(filename, data, opts, (err, html) => {
    if (err) {
      return reject(err);
    }

    return resolve(html);
  });
});
