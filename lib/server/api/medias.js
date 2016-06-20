const ApiError = require('./apiError');
const Media = require('../../models/media');

module.exports = (req, res, next) => {
  let size = 10;
  let number = 1;
  let search;
  let type;
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
      search = req.query.filter.search;
    }
    if (req.query.filter.type) {
      if (['undecorated', 'decorated', 'movie', 'tv', 'failed']
          .indexOf(req.query.filter.type) !== -1) {
        type = req.query.filter.type;
      } else {
        return next(
          new ApiError(
            400,
            'type should be undecorated, decorated, movie, tv or failed',
            '/query/filter/type'
          )
        );
      }
    }
  }

  let pages = 0;
  return Media.countAll(search, type)
    .then(count => {
      if (count < 1) {
        return [];
      }

      pages = Math.ceil(count / size);
      if (number > pages) {
        return Promise.reject(new ApiError(404, 'Out of pagination range', '/query/page/number'));
      }

      return Media.retrieve(search, type, size, (number - 1) * size);
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
          self: res.linker('medias/', { page: { number, size }, filter: { search, type } }),
          failed: res.linker('medias/', { filter: { type: 'failed' } }),
          undecorated: res.linker('medias/', { filter: { type: 'undecorated' } }),
          decorated: res.linker('medias/', { filter: { type: 'decorated' } }),
          movie: res.linker('medias/', { filter: { type: 'movie' } }),
          tv: res.linker('medias/', { filter: { type: 'tv' } }),
        },
      };

      if (pages > 1) {
        response.links.first = res.linker('medias/', {
          page: { number: 1, size },
          filter: { search, type },
        });
        response.links.last = res.linker('medias/', {
          page: { number: pages, size },
          filter: { search, type },
        });
        if (docs.length) {
          if (number > 1) {
            response.links.prev =
              res.linker('medias/', {
                page: { number: number - 1, size },
                filter: { search, type },
              });
          }
          if (number < pages) {
            response.links.next =
              res.linker('medias/', {
                page: { number: number + 1, size },
                filter: { search, type },
              });
          }
        }
      }

      return res.type('application/vnd.api+json').json(response);
    })
    .catch(next);
};
