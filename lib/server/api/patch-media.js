const ApiError = require('./apiError');
const Media = require('../../models/media');

module.exports = (req, res, next) => {
  // id
  const id = req.params.id;
  if (!id) {
    return next(new ApiError(400, 'missing id parameter', '/query/id'));
  }
  if (!/^[a-fA-F0-9]{24}$/.test(id)) {
    return next(new ApiError(400, 'invalid id', '/query/id'));
  }

  // info
  const info = req.body.info;
  if (typeof info !== 'object' || !Object.keys(info).length) {
    return next(new ApiError(400, 'missing or invalid info parameter', '/body/info'));
  }
  if (info.media_type === 'movie' || info.media_type === 'tv') {
    info.category = info.media_type;
  }

  return Media.findOne({ _id: id }).exec()
    .then(doc => {
      if (!doc) {
        return Promise.reject(new ApiError(404, 'Not Found'));
      }

      return doc.setDecoration(Object.assign({}, doc.info, info));
    })
    .then(doc => res.type('application/vnd.api+json').json({
      data: doc.getApiData(),
      links: {
        self: res.linker(`medias/${id}`),
        list: res.linker('medias/', { page: { number: 1, size: 10 } }),
      },
    }))
    .catch(next);
};
