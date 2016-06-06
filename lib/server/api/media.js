const Media = require('../../models/media');
const decorate = require('../../decorate/index');
const tmdb = require('../../util/tmdb');

module.exports = (req, res, next) => {
  if (!req.params.id) {
    const error = new Error('missing id parameter');
    error.status = 400;
    return next(error);
  }

  const id = req.params.id;
  if (!/^[a-fA-F0-9]{24}$/.test(id)) {
    const error = new Error('invalid id');
    error.status = 400;
    return next(error);
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
