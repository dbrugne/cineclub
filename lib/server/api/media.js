const Media = require('../../models/media');

module.exports = (req, res, next) => {
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
      data: doc.getApiData(),
      links: {
        self: req.linker(`medias/${id}`),
      },
    });
  });
};
