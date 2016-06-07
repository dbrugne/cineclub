const ApiError = require('./apiError');
const Media = require('../../models/media');
const decorate = require('../../decorate/index');
const tmdb = require('../../util/tmdb');

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

    const opts = {
      api: tmdb(req.app.locals.tmdbApiKey),
    };

    return decorate([doc], opts)
      .then(docs => docs[0])
      .then(media => res.type('application/vnd.api+json').json({
        data: media.getApiData(),
        links: {
          self: res.linker(`medias/${id}`),
        },
      }))
      .catch(next);
  });
};
