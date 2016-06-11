const { Router } = require('express');
const router = new Router();
const ApiError = require('./apiError');
const errorHandler = require('./errorHandler');

router.use(require('../middlewares/linker'));

router.get('/', (req, res) => {
  res.type('application/vnd.api+json').json({
    data: {
      whatsnew: {
        links: {
          self: res.linker('whatsnew'),
        },
      },
      medias: {
        links: {
          self: res.linker('medias'),
        },
      },
      tmdb: {
        links: {
          self: res.linker('tmdb'),
        },
      },
    },
    links: {
      self: res.linker(),
    },
  });
});
router.get('/whatsnew', require('./whatsnew'));
router.get('/medias', require('./medias'));
router.get('/medias/:id', require('./media'));

router.use((req, res, next) => next(new ApiError(404, 'Not Found')));
router.use(errorHandler);

module.exports = router;
