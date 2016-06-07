function flatten(o) {
  const flat = {};
  Object.keys(o).forEach(i => {
    if (!o.hasOwnProperty(i)) {
      return;
    }

    if (typeof o[i] === 'undefined') {
      return;
    }

    if ((typeof o[i]) !== 'object' || o[i] === null) {
      flat[i] = o[i];
      return;
    }

    const flatObject = flatten(o[i]);
    Object.keys(flatObject).forEach(x => {
      if (!flatObject.hasOwnProperty(x)) {
        return;
      }

      if (typeof flatObject[x] === 'undefined') {
        return;
      }

      if (x.indexOf('[') === -1) {
        flat[`${i}[${x}]`] = flatObject[x];
      } else {
        flat[`${i}[${x.substr(0, x.indexOf('['))}]${x.substr(x.indexOf('['))}`] = flatObject[x];
      }
    });
  });

  return flat;
}

module.exports = flatten;
