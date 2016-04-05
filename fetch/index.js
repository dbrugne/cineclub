'use strict';

const waterfall = require('async/waterfall');
const sftp = require('./sftp');
const previous = require('./previous');
const mongoose = require('mongoose');

const dirs = [
  '/torrents/termines/test',
//  '/torrents/termines/anime',
//  '/torrents/termines/films',
//  '/torrents/termines/kids',
//  '/torrents/termines/series'
];

waterfall([
  require('./connect'),
  require('./sftp')(dirs),
  require('./previous'),
  require('./save'),
  require('./diff')
], (err) => {
  if (err) {
    console.error(err)
  }

  return process.exit(!!err);
});
