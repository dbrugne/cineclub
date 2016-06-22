let ratelimit = 100;

const setLimit = (limit) => {
  ratelimit = limit;
};

const stub = data => {
  const search = type => (query, fn) => {
    const name = query.query.toLocaleLowerCase();
    const result = data.search[type][name]
      ? data.search[type][name].result
      : data.search.multi.unknown.result;
    return fn(null, Object.assign({}, result), {
      header: {
        'x-ratelimit-remaining': ratelimit--,
      },
    });
  };
  const get = type => (query, fn) => {
    const media = data.get[type].find(m => m.id === query.id);
    if (!media) {
      const error = new Error('Not Found');
      error.status = 404;
      return fn(error);
    }
    if (query.append_to_response) {
      media.appended = query.append_to_response;
    }
    return fn(null, Object.assign({}, media), {
      header: {
        'x-ratelimit-remaining': ratelimit--,
      },
    });
  };
  return {
    searchMovie: search('movie'),
    searchTv: search('tv'),
    searchMulti: search('multi'),
    movieInfo: get('movie'),
    tvInfo: get('tv'),
    tvEpisodeInfo: get('episode'),
    setLimit,
  };
};

module.exports = stub;
