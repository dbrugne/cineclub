/**
 * Find full data from TMDB for a given movie or tv show
 * @param api
 * @param type
 * @param id
 * @returns {Promise}
 */
module.exports = (api, type, id) => new Promise((resolve, reject) => {
  if (!id) {
    return reject(new Error('id required'));
  }
  if (!type || ['movie', 'tv'].indexOf(type) === -1) {
    return reject(new Error('type required'));
  }

  return api(`${type}Info`, {
    language: 'fr',
    include_image_language: 'en,null',
    id,
    append_to_response: type === 'movie'
      ? 'credits,images,videos,reviews'
      : 'credits,images,videos',
  })
    .then(result => {
      resolve(Object.assign({ category: type }, result));
    })
    .catch(err => {
      if (err.status === 404) {
        return resolve({});
      }

      return reject(err);
    });
});
