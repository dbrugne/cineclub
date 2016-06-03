
export function changePeriod(period) {
  return { type: 'WN_CHANGE_PERIOD', period };
}

export function request() {
  return { type: 'WN_REQUEST' };
}

export function receive(json) {
  return {
    type: 'WN_RECEIVE',
    movies: json.movies ? json.movies.map(m => m.data) : [],
    series: json.series ? json.series.map(m => m.data) : [],
    unknown: json.unknown ? json.unknown.map(m => m.data) : [],
    removed: json.removed ? json.removed.map(m => m.data) : [],
    receivedAt: Date.now(),
  };
}

export function error(err) {
  return {
    type: 'WN_ERROR',
    error: err,
  };
}

export function fetchWhatsNew(period) {
  return dispatch => {
    dispatch(request());

    return fetch(`/api/whatsnew?period=${period}`, {
      headers: {
        Accept: 'application/json',
      },
    })
      .then(response => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        }

        return Promise.reject(new Error(response.statusText));
      })
      .then(json => dispatch(receive(json.data)))
      .catch(err => dispatch(error(err)));
  };
}
