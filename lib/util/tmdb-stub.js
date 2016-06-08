let ratelimit = 100;

const setLimit = (limit) => {
  ratelimit = limit;
};

const api = stubData => {
  const get = (query, fn) => {
    const name = query.query.toLocaleLowerCase();
    const result = stubData[name]
      ? stubData[name].result
      : stubData.unknown.result;
    return fn(null, Object.assign({}, result), {
      header: {
        'x-ratelimit-remaining': ratelimit--,
      },
    });
  };
  return {
    searchMovie: get,
    searchTv: get,
    searchMulti: get,
    setLimit,
  };
};

module.exports = {
  setLimit,
  api,
};
