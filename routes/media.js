const express = require('express');
const router = express.Router();

const Media = require('../lib/models/media');

router.get('/:id', (req, res, next) => {
  if (!req.params.id) {
    return next();
  }

  const id = req.params.id;
  if (!/^[a-fA-F0-9]{24}$/.test(id)) {
    return next(new Error('invalid ObjectId'));
  }

  return Media.findOne({ _id: id }).exec((err, doc) => {
    if (err) {
      return next(err);
    }
    if (!doc) {
      return next();
    }

    return res.json({
      _id: doc.id,
      path: doc.path,
      created: doc.created,
      removed: doc.removed,
      file: doc.file,
      info: doc.info,
    });
  });
});

module.exports = router;
