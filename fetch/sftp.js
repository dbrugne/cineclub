'use strict';

const eachSeries = require('async/eachSeries');
const path = require('path');
const Client = require('ssh2').Client;
const parser = require('parse-torrent-name');

const videosExtensions = [
  'mpg',
  'mpe',
  'mpeg',
  'avi',
  'mov',
  'qt',
  'wmv',
  'rm',
  'mp4',
  '3gp',
  'ogm',
  'mkv'
];

const isDirFromLongname = (longname) => (longname.substr(0, 1) === 'd');

const iteratee = (sftp, dir, list, cb) => {
  sftp.readdir(dir, (err, _list) => {
    if (err) {
      return cb(err);
    }

    eachSeries(_list, (file, callback) => {
      // directory
      if (isDirFromLongname(file.longname)) {
        return iteratee(sftp, dir + '/' + file.filename, list, callback);
      }

      // filter videos
      let info = path.parse(dir + '/' + file.filename);
      let extension = info.ext;
      if (typeof extension === 'undefined' || extension === '') {
        return callback(null);
      }
      if (extension.substr(0, 1) === '.') {
        extension = extension.substr(1);
      }
      if (videosExtensions.indexOf(extension.toLocaleLowerCase()) === -1) {
        return callback(null);
      }

      list[file.filename] = Object.assign({
        filename: file.filename,
        dir,
        size: file.attrs.size
      }, parser(file.filename));

      console.log('Client :: media found "' + list[file.filename].title + '"');
      return callback(null);
    }, cb);
  });
};

const run = (root, callback) => {
  var connection = new Client();
  connection.on('ready', function() {
    console.log('Client :: ready');
    connection.sftp(function(err, sftp) {
      if (err) {
        return callback(err);
      }

      console.log('Client :: mode is now SFTP');

      const list = {};
      iteratee(sftp, root, list, (err) => {
        connection.end();
        return callback(err, list);
      });
    });
  });
  connection.connect({
    host: process.env.HOST,
    port: process.env.PORT || 22,
    username: process.env.USERNAME,
    password: process.env.PASSWORD
  });
};

module.exports = (dirs) => {
  return (callback) => {
    var list = {};
    eachSeries(dirs, (_dir, cb) => {
      run(_dir, (err, _list) => {
        if (err) {
          return cb(err);
        }

        list = Object.assign(list, _list);
        return cb(null);
      });
    }, (err) => callback(err, list));
  }
};
