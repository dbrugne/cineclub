const mongoose = require('mongoose');
const debug = require('./debug');

module.exports = (connectionString) => new Promise((resolve, reject) => {
  mongoose.connection.on('open', () => {
    debug('Mongoose :: connected');
    resolve();
  });
  mongoose.connection.on('disconnected', () => debug('Mongoose :: connection lost'));
  mongoose.connection.on('error', (err) => reject(err));
  mongoose.connect(connectionString);
});
