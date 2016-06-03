
export function request() {
  return { type: 'MEDIA_REQUEST' };
}

export function receive(data) {
  return {
    type: 'MEDIA_RECEIVE',
    data,
  };
}

export function error(err) {
  return {
    type: 'MEDIA_ERROR',
    error: err,
  };
}

export function fetchMedia(id) {
  return dispatch => {
    dispatch(request());

    return fetch(`/api/medias/${id}`, {
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
