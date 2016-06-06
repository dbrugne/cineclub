const fetch = require('isomorphic-fetch');
const flatten = require('./flatten');

module.exports = (baseUrl, queries) => new Promise((resolve, reject) => {
  // encode url
  let url = baseUrl;
  if (queries) {
    const params = flatten(queries);
    const parameters = Object.keys(params).map(k => `${encodeURI(k)}=${encodeURI(params[k])}`);
    url = `${url}?${parameters.join('&')}`;
  }

  const result = {};
  const headers = {
    'Content-Type': 'application/vnd.api+json',
    Accept: 'application/vnd.api+json',
  };
  fetch(url, { headers })
    .then(response => {
      result.status = response.status;
      return response.json()
        .then(json => {
          if (json.meta) {
            result.meta = json.meta;
          }
          if (json.data) {
            result.data = json.data;
          }
          if (json.errors) {
            result.error = json.errors[0];
          }
          return resolve(result);
        })
        .catch(() => reject(new Error('Non-JSON response')));
    })
    .catch(() => reject(new Error('Transport error')));
});
