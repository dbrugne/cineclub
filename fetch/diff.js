'use strict';

module.exports = (list, previous, callback) => {
  var before = Object.keys(previous);
  var after = Object.keys(list);

  var dead = before.filter((x) => after.indexOf(x) === -1);
  var born = after.filter((x) => before.indexOf(x) === -1);

  console.log('born', born);
  console.log('dead', dead);

  callback(null);
};