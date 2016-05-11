const debug = require('./debug');
const mongoose = require('mongoose');

mongoose.connection.on('open', () => debug('Mongoose :: connected'));
mongoose.connection.on('disconnected', () => debug('Mongoose :: connection lost'));
mongoose.connection.on('error', (err) => {
  console.error(err);
  process.exit(1);
});

module.exports = (connectionString) => mongoose.connect(connectionString);
