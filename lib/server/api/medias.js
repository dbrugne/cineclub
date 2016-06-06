const ApiError = require('./apiError');
const Media = require('../../models/media');
const decorate = require('../../decorate/index');
const tmdb = require('../../util/tmdb');

module.exports = (req, res, next) => {
  let size = 10;
  let number = 1;
  let search;
  let category;
  if (req.query.page) {
    if (req.query.page.size) {
      const requestedSize = parseInt(req.query.page.size, 10);
      if (requestedSize >= 1 && requestedSize <= 30) {
        size = requestedSize;
      } else {
        // 30 max value is due to max request per second to TMDB
        return next(new ApiError(400, 'page[size] should be in 1-30 range', '/query/page/size'));
      }
    }
    if (req.query.page.number) {
      number = parseInt(req.query.page.number, 10);
    }
  }
  if (req.query.filter) {
    if (req.query.filter.search) {
      search = decodeURI(req.query.filter.search); // @todo add test for decodeURI()
    }
    if (req.query.filter.category) {
      if (['movie', 'tv', 'unknown'].indexOf(req.query.filter.category) !== -1) {
        category = req.query.filter.category;
      } else {
        return next(
          new ApiError(400, 'category should be movie, tv or unknown', '/query/filter/category')
        );
      }
    }
  }

  let pages = 0;
  return Media.countAll(search, category)
    .then(count => {
      if (count < 1) {
        return [];
      }

      pages = Math.ceil(count / size);
      if (number > pages) {
        return Promise.reject(new ApiError(404, 'Out of pagination range', '/query/page/number'));
      }

      return Media.retrieve(search, category, size, (number - 1) * size);
    })
    .then(docs => {
      if (!docs.length) {
        return docs;
      }

      const opts = {
        api: tmdb(req.app.locals.tmdbApiKey),
      };
      return decorate(docs, opts);
    })
    .then(docs => {
      const response = {
        meta: {
          'total-pages': pages,
        },
        data: docs.map(d => {
          const data = d.getApiData();
          data.links = {
            self: res.linker(`medias/${data.id}`),
          };
          return data;
        }),
        links: {
          self: res.linker('medias/', { page: { number, size }, filter: { search, category } }),
        },
      };

      if (pages > 1) {
        response.links.first = res.linker('medias/', {
          page: { number: 1, size },
          filter: { search, category },
        });
        response.links.last = res.linker('medias/', {
          page: { number: pages, size },
          filter: { search, category },
        });
        if (docs.length) {
          if (number > 1) {
            response.links.prev =
              res.linker('medias/', {
                page: { number: number - 1, size },
                filter: { search, category },
              });
          }
          if (number < pages) {
            response.links.next =
              res.linker('medias/', {
                page: { number: number + 1, size },
                filter: { search, category },
              });
          }
        }
      }

      return res.type('application/vnd.api+json').json(response);
    })
    .catch(next);
};
