const moviedb = require('moviedb');
const debug = require('./debug');

const stubApi = stubData => {
  const get = (query, fn) => {
    const name = query.query.toLocaleLowerCase();
    const result = stubData[name]
      ? stubData[name].result
      : stubData.unknown.result;
    return fn(null, Object.assign({}, result));
  };
  return {
    searchMovie: get,
    searchTv: get,
    searchMulti: get,
  };
};

module.exports = (apiKey) => {
  const api = (typeof apiKey === 'string')
    ? moviedb(apiKey)
    : stubApi(apiKey);

  return (method, query) => new Promise((resolve, reject) => {
    api[method](query, (err, data) => {
      if (err) {
        return reject(err);
      }

      const total = (data)
        ? data.total_results
        : 0;
      debug('TMDB :: requesting', method, query, `${total} results`);
      return resolve(data);
    });
  });
};
