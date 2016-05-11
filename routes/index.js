const express = require('express');
const router = express.Router();

const generateDailyEmail = require('../lib/push/emailGenerator');

/* GET home page. */
router.get('/', (req, res, next) => {
  generateDailyEmail({
    period: 1,
    baseUrl: process.env.BASE_URL,
    replyTo: process.env.MAIL_REPLY_TO,
    premailer: false,
  }).then((html) => {
    res.send(html);
  }).catch(err => {
    next(err);
  });
});

module.exports = router;
