const ApiError = require('./apiError');

module.exports = (req, res, next) => {
  let number = 1;
  let search;
  if (req.query.page) {
    if (req.query.page.number) {
      number = parseInt(req.query.page.number, 10);
    }
  }
  if (req.query.filter && req.query.filter.search) {
    search = req.query.filter.search;
  } else {
    return next(new ApiError(400, 'search is required', '/query/filter/search'));
  }

  const query = {
    language: 'fr',
    page: number,
    query: search,
  };

  return req.app.locals.tmdbApi('searchMulti', query)
    .then(data => {
      const response = {
        meta: {
          'total-pages': (!data.total_results) ? 0 : data.total_pages,
          'from-cache': !!data.from_cache,
        },
        data: data.results,
        links: {
          self: res.linker('tmdb/', { page: { number }, filter: { search } }),
        },
      };

      if (data.total_pages > 1) {
        response.links.first = res.linker('tmdb/', { page: { number: 1 }, filter: { search } });
        response.links.last = res.linker('tmdb/', {
          page: { number: data.total_pages }, filter: { search },
        });
        if (data.results) {
          if (number > 1) {
            response.links.prev =
              res.linker('tmdb/', { page: { number: number - 1 }, filter: { search } });
          }
          if (number < data.total_pages) {
            response.links.next =
              res.linker('tmdb/', { page: { number: number + 1 }, filter: { search } });
          }
        }
      }

      return res.type('application/vnd.api+json').json(response);
    })
    .catch(next);
};
