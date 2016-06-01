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
        const error = new Error('page size should be in 1-30 range');
        error.status = 400;
        return next(error);
      }
    }
    if (req.query.page.number) {
      number = parseInt(req.query.page.number, 10);
    }
  }
  if (req.query.filter) {
    if (req.query.filter.search) {
      search = `${req.query.filter.search}`;
    }
    if (req.query.filter.category) {
      if (['movie', 'tv', 'unknown'].indexOf(req.query.filter.category) !== -1) {
        category = req.query.filter.category;
      } else {
        const error = new Error('category should be one of movie, tv, unknown');
        error.status = 400;
        return next(error);
      }
    }
  }

  let pages;
  return Media.countAll(search, category)
    .then(count => {
      if (count < 1) {
        const error = new Error('No content');
        error.status = 204;
        return Promise.reject(error);
      }

      pages = Math.ceil(count / size);
      if (number > pages) {
        const error = new Error('Out of pagination range');
        error.status = 404;
        return Promise.reject(error);
      }

      return Media.retrieve(search, category, size, (number - 1) * size);
    })
    .then(docs => {
      if (!docs || !docs.length) {
        return Promise.reject(new Error('Unable to retrieve documents'));
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
