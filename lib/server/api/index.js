const express = require('express');
const router = express.Router();
const ApiMiddleware = require('../middlewares/api');

router.get('/whatsnew', [ApiMiddleware], require('./whatsnew'));
router.get('/medias', [ApiMiddleware], require('./medias'));
router.get('/medias/:id', [ApiMiddleware], require('./media'));

module.exports = router;
