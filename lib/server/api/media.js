const ApiError = require('./apiError');
const Media = require('../../models/media');

module.exports = (req, res, next) => {
  if (!req.params.id) {
    return next(new ApiError(400, 'missing id parameter', '/query/id'));
  }

  const id = req.params.id;
  if (!/^[a-fA-F0-9]{24}$/.test(id)) {
    return next(new ApiError(400, 'invalid id', '/query/id'));
  }

  return Media.findOne({ _id: id }).exec((err, doc) => {
    if (err) {
      return next(err);
    }
    if (!doc) {
      return next();
    }

    return res.type('application/vnd.api+json').json({
      data: doc.getApiData(),
      links: {
        self: res.linker(`medias/${id}`),
      },
    });
  })
  .catch(next);
};
