'use strict';

const { RemoteListing } = require('./models');
module.exports = (list, callback) => {
  RemoteListing
    .find({})
    .sort({time: -1})
    .limit(1)
    .exec((err, models) => {
      let previous = JSON.parse(models[0].data);
      return callback(err, list, previous);
    });
};
