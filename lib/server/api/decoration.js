const ApiError = require('./apiError');
const Media = require('../../models/media');
const decorate = require('../../decorate/index');

module.exports = (req, res, next) => {
  // id
  const id = req.params.id;
  if (!id || !/^[a-fA-F0-9]{24}$/.test(id)) {
    return next(new ApiError(400, 'id parameter required', '/query/id'));
  }

  // tmdbId
  const tmdbId = req.body.tmdbId;
  if (!tmdbId) {
    return next(new ApiError(400, 'tmdbId parameter required', '/body/tmdbId'));
  }

  // tmdbType
  const tmdbType = req.body.tmdbType;
  if (!tmdbType || ['movie', 'tv'].indexOf(tmdbType) === -1) {
    return next(new ApiError(400, 'tmdbType parameter required (movie, tv)', '/body/tmdbType'));
  }

  return Media.findOne({ _id: id }).exec()
    .then(doc => {
      if (!doc) {
        return Promise.reject(new ApiError(404, 'Not Found'));
      }

      doc.set({
        decoration: 'undecorated',
        torrent: null,
        info: { id: tmdbId, type: tmdbType },
      });

      return decorate([doc], { api: req.app.locals.tmdbApi });
    })
    .then(docs => res.type('application/vnd.api+json').json({
      data: docs[0].getApiData(),
      links: {
        self: res.linker(`medias/${id}`),
        list: res.linker('medias/'),
      },
    }))
    .catch(next);
};
