'use strict';

const mongoose = require('mongoose');

module.exports = {
  RemoteListing: mongoose.model('Fetch', mongoose.Schema({
    time: {type: Date},
    data: mongoose.Schema.Types.Mixed
  }))
};
