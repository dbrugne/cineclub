import fetch from '../../util/fetchWrapper';

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

    return fetch(`/api/medias/${id}`)
      .then(response => {
        if (response.error) {
          return Promise.reject(new Error(response.error.title));
        }

        return dispatch(receive(response.data));
      })
      .catch(err => dispatch(error(err)));
  };
}

export function patchRequest() {
  return { type: 'MEDIA_PATCH_REQUEST' };
}
export function patch(id, data) {
  return (dispatch, getState) => {
    const isPatching = getState().media.isPatching;
    if (isPatching) {
      return Promise.resolve();
    }

    dispatch(patchRequest());

    const options = {
      method: 'PATCH',
      body: {
        info: data,
      },
    };
    return fetch(`/api/medias/${id}`, null, options)
      .then(response => {
        if (response.error) {
          return Promise.reject(new Error(response.error.title));
        }

        return dispatch(receive(response.data));
      })
      .catch(err => dispatch(error(err)));
  };
}
