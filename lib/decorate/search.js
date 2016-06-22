/**
 * Search for TMDB for corresponding media
 * @param api
 * @param method
 * @param query
 * @returns {Promise}
 */
module.exports = (api, method, query) => {
  if (!method) {
    return Promise.reject(new Error('method required'));
  }
  if (!query) {
    return Promise.reject(new Error('search required'));
  }

  const q = Object.assign({
    language: 'fr',
    page: 1,
  }, query);

  return api(method, q)
    .then(data => {
      if (!data || !data.results || !data.results.length) {
        return {};
      }

      const media = data.results[0];

      let type;
      if (method === 'searchMovie') {
        type = 'movie';
      } else if (method === 'searchTv') {
        type = 'tv';
      } else if (['movie', 'tv'].indexOf(media.media_type) !== -1) {
        type = media.media_type;
      }

      return {
        type,
        id: media.id,
      };
    });
};
