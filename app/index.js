'use strict';

const eachSeries = require('async/eachSeries');
const browser = require('./browser');

const dirs = [
  '/torrents/termines/anime',
  '/torrents/termines/films',
  '/torrents/termines/kids',
  '/torrents/termines/series'
];

eachSeries(dirs, (_dir, callback) => {
  browser(_dir, (err, _list) => {
    if (err) {
      return callback(err);
    }

    // @todo
    console.log(_dir, Object.keys(_list));
    return callback(null);
  });
}, (err) => {
  if (err) {
    console.error(err);
  }

  return process.exit(0);
});
