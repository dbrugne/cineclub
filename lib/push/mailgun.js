const debug = require('../util/debug');
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
module.exports = (opts) => (recipient, sbj, html) => new Promise((resolve, reject) => {
  if (!recipient) {
    return reject(new Error('recipient param is mandatory'));
  }
  if (!sbj) {
    return reject(new Error('subject param is mandatory'));
  }
  if (!html) {
    return reject(new Error('html param is mandatory'));
  }

  // subject
  let subject = sbj;
  if (process.env.NODE_ENV !== 'production') {
    subject = `${subject} (${Date.now()})`;
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
      reject(new Error(`Error while sending email to ${to}: ${err}`));
    } else {
      resolve(info);
    }
  });
});
