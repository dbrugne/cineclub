const moviedb = require('moviedb');
const debug = require('./debug');
const stub = require('./tmdb-stub');

module.exports = (apiKey) => {
  const api = (typeof apiKey === 'string')
    ? moviedb(apiKey)
    : stub.api(apiKey);

  return (method, query) => new Promise((resolve, reject) => {
    api[method](query, (err, responseBody, response) => {
      if (err) {
        return reject(err);
      }

      const total = (responseBody)
        ? responseBody.total_results
        : 0;

      const data = Object.assign({
        ratelimit: response.header['x-ratelimit-remaining'],
      }, responseBody);

      debug(
        'TMDB :: requesting',
        method,
        query,
        `${total} results`,
        `ratelimit=${data.ratelimit}`
      );
      return resolve(data);
    });
  });
};
