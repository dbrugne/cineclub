const { Router } = require('express');
const router = new Router();

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
    },
    links: {
      self: res.linker(),
    },
  });
});
router.get('/whatsnew', require('./whatsnew'));
router.get('/medias', require('./medias'));
router.get('/medias/:id', require('./media'));

module.exports = router;
