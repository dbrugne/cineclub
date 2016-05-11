const premailer = require('premailer-api');

module.exports = (html) => new Promise((resolve, reject) => {
  premailer.prepare({ html }, (err, email) => {
    if (err) {
      return reject(err);
    }

    return resolve(email.html);
  });
});
