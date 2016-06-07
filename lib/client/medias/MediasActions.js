import fetch from '../../util/fetchWrapper';

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

export function receive(pages, items) {
  return {
    type: 'MEDIAS_RECEIVE',
    pages,
    items,
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

    const query = {
      page: {
        size:
        PAGE_SIZE,
        number: page,
      },
      filter: {},
    };
    if (category && category !== 'all') {
      query.filter.category = category;
    }
    if (search) {
      query.filter.search = search;
    }

    return fetch('/api/medias', query)
      .then(response => {
        if (response.error) {
          return Promise.reject(new Error(response.error.title));
        }

        return dispatch(receive(response.meta['total-pages'], response.data));
      })
      .catch(err => dispatch(error(err)));
  };
}
