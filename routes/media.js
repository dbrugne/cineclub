const express = require('express');
const router = express.Router();

const Media = require('../lib/models/media');

router.get('/:id', (req, res, next) => {
  if (!req.params.id) {
    return next();
  }

  // @todo : test ObjectId validity
  return Media.findOne({ _id: req.params.id }).exec()
    .then(doc => {
      if (!doc) {
        next();
        return Promise.resolve();
      }
      return doc;
    })
    .then(doc => res.json({
      _id: doc.id,
      path: doc.path,
      created: doc.created,
      removed: doc.removed,
      file: doc.file,
      info: doc.info,
    }))
    .catch(err => next(err));
});

module.exports = router;
