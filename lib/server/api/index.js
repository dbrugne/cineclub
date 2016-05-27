const express = require('express');
const router = express.Router();

router.get('/whatsnew', require('./whatsnew'));

module.exports = router;
