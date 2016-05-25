const express = require('express');
const router = express.Router();

const Media = require('../../models/media');

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

    return res.render('media', { data: doc.getApiData() });
  });
});

module.exports = router;
