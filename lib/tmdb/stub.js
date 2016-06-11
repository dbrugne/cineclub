let ratelimit = 100;

const setLimit = (limit) => {
  ratelimit = limit;
};

const stub = data => {
  const get = (query, fn) => {
    const name = query.query.toLocaleLowerCase();
    const result = data[name]
      ? data[name].result
      : data.unknown.result;
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

module.exports = stub;
