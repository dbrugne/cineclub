'use strict';

const { RemoteListing } = require('./models');

module.exports = (list, previous, callback) => {
  let model = new RemoteListing({
    time: new Date(),
    data: JSON.stringify(list)
  });
  model.save((err) => callback(err, list, previous));
};