export function changeSearch(search) {
  return {
    type: 'MEDIAS_SEARCH',
    search,
  };
}

export function changeCategory(category) {
  return {
    type: 'MEDIAS_CATEGORY',
    category,
  };
}

export function changePage(page) {
  return {
    type: 'MEDIAS_PAGE',
    page,
  };
}

export function request() {
  return { type: 'MEDIAS_REQUEST' };
}

export function receive(data) {
  return {
    type: 'MEDIAS_RECEIVE',
    data,
  };
}

export function error(err) {
  return {
    type: 'MEDIAS_ERROR',
    error: err,
  };
}

const PAGE_SIZE = 25;
export function fetchMedias(search, category, page) {
  return (dispatch, getState) => {
    const isFetching = getState().medias.isFetching;
    if (isFetching) {
      return Promise.resolve();
    }

    dispatch(request());
    let url = '/api/medias/?';
    url += `${encodeURI('page[size]')}=${PAGE_SIZE}`;
    url += `&${encodeURI('page[number]')}=${page}`;
    if (search) {
      url += `&${encodeURI('filter[search]')}=${encodeURI(search)}`;
    }
    if (category && category !== 'all') {
      url += `&${encodeURI('filter[category]')}=${encodeURI(category)}`;
    }

    return fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    })
      .then(response => {
        if (response.status === 204) {
          dispatch(receive({
            pages: 0,
            items: [],
          }));
          return null;
        }
        if (response.status >= 200 && response.status < 300) {
          return response.json()
            .then(json => {
              dispatch(receive({
                pages: json.meta['total-pages'],
                items: json.data,
              }));
            });
        }

        return Promise.reject(new Error(response.statusText));
      })
      .catch(err => dispatch(error(err)));
  };
}
