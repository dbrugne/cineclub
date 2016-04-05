'use strict';

const eachSeries = require('async/eachSeries');
const path = require('path');
const { Client } = require('ssh2');

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
      if (!isDirFromLongname(file.longname)) {
        // file

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

        console.log('Client :: media found ' + file.filename);
        list[file.filename] = {
          filename: file.filename,
          dir,
          size: file.attrs.size
        };
        return callback(null);
      } else {
        // directory
        iteratee(sftp, dir + '/' + file.filename, list, callback);
      }
    }, cb);
  });
};

module.exports = (root, callback) => {
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
