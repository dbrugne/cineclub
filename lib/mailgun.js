const debug = require('./debug');
const nodemailer = require('nodemailer');
const mailgun = require('nodemailer-mailgun-transport');

let transporter;
function getTransport() {
  if (!transporter) {
    transporter = nodemailer.createTransport(mailgun({
      auth: {
        domain: process.env.MAILGUN_DOMAIN,
        api_key: process.env.MAILGUN_API_KEY,
      },
    }), {
      from: process.env.MAIL_FROM,
    });
  }

  return transporter;
}

/**
 * Send email to recipient
 * @param recipient
 * @param subject
 * @param html
 * @returns {Promise}
 */
module.exports = (recipient, subject, html) => new Promise((resolve, reject) => {
  if (!recipient) {
    return reject('recipient param is mandatory');
  }
  if (!subject) {
    return reject('subject param is mandatory');
  }
  if (!html) {
    return reject('html param is mandatory');
  }

  // to
  let to;
  if (process.env.NODE_ENV !== 'production') {
    to = process.env.MAIL_STUB;
  } else if (!Array.isArray(recipient)) {
    to = recipient;
  } else {
    to = recipient.join(', ');
  }

  debug('MAILGUN :: send to', to);

  const options = {
    to,
    subject,
    html,
  };

  return getTransport().sendMail(options, (err, info) => {
    if (err) {
      reject(`Error while sending email to ${to}: ${err}`);
    } else {
      resolve(info);
    }
  });
});
