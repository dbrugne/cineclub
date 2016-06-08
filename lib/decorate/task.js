const debug = require('../util/debug');
const Media = require('../models/media');
const decorate = require('./index');

module.exports = opts => new Promise((resolve, reject) => {
  Media.retrieveForDecoration()
    .then(docs => {
      debug(`DECORATE :: found ${docs.length} undecorated document(s)`);
      return decorate(docs, opts);
    })
    .then(docs => {
      const decorated = docs.reduce((count, m) => {
        if (m.shouldDecorate()) {
          return count;
        }

        return count + 1;
      }, 0);
      debug(`DECORATE :: ${decorated} document(s) are now decorated`);
    })
    .then(() => resolve())
    .catch(err => reject(err));
});
