const debug = require('./debug');
const mongoose = require('mongoose');

mongoose.connection.on('open', () => debug('Mongoose :: connected'));
mongoose.connection.on('disconnected', () => debug('Mongoose :: connection lost'));
mongoose.connection.on('error', (err) => {
  throw new Error(err);
});

module.exports = (connectionString, fn) => mongoose.connect(connectionString, fn);
