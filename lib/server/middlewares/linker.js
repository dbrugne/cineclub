const { stringify } = require('querystring');
const flatten = require('../../util/flatten');

module.exports = (req, res, next) => {
  // base URL
  res.linker = (route = '', params) => {
    const port = (req.app.get('port'))
      ? `:${req.app.get('port')}`
      : '';
    const query = (params && typeof params === 'object' && Object.keys(params).length)
      ? `?${stringify(flatten(params))}`
      : '';

    return `${req.protocol}://${req.hostname}${port}/api/${route}${query}`;
  };

  next();
};
