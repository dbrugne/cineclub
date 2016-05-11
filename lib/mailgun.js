const debug = require('./debug');
const nodemailer = require('nodemailer');
const mailgun = require('nodemailer-mailgun-transport');

let transporter;
function getTransport(opts) {
  if (!transporter) {
    transporter = nodemailer.createTransport(mailgun({
      auth: {
        domain: opts.mailgunDomain,
        api_key: opts.mailgunApiKey,
      },
    }), {
      from: opts.from,
    });
  }

  return transporter;
}

/**
 * Send email to recipient
 * @param opts
 * @returns {Promise}
 */
module.exports = (opts) => (recipient, subject, html) => new Promise((resolve, reject) => {
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
    to = opts.toStub;
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

  return getTransport(opts).sendMail(options, (err, info) => {
    if (err) {
      reject(`Error while sending email to ${to}: ${err}`);
    } else {
      resolve(info);
    }
  });
});
