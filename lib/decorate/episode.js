/**
 * Find full data from TMDB for a given tv episode
 * @param api
 * @param id
 * @param season
 * @param episode
 * @returns {Promise}
 */
module.exports = (api, id, season, episode) => new Promise((resolve, reject) => {
  if (!id || !season || !episode) {
    return reject(new Error('id, season and episode are required'));
  }

  return api('tvEpisodeInfo', {
    language: 'en',
    include_image_language: 'en,null',
    id,
    season_number: season,
    episode_number: episode,
    append_to_response: 'credits,images,videos',
  })
    .then(result => {
      resolve(result);
    })
    .catch(err => {
      if (err.status === 404) {
        return resolve({});
      }

      return reject(err);
    });
});
