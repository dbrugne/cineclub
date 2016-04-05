'use strict';

const mongoose = require('mongoose');

module.exports = (callback) => {
  mongoose.connect(process.env.MONGO_DB || 'mongodb://localhost/test');
  mongoose.connection.on('open', function () {
    console.log('Mongoose :: connected');
    return callback(null);
  });
  mongoose.connection.on('disconnected', function () {
    console.log('Mongoose :: connection lost');
  });
  mongoose.connection.on('error', function (err) {
    console.error('Mongoose :: ' + err);
  });
};