const express = require('express');
const router = express.Router();

router.use(require('../middlewares/linker'));

router.get('/whatsnew', require('./whatsnew'));
router.get('/medias', require('./medias'));
router.get('/medias/:id', require('./media'));

module.exports = router;
