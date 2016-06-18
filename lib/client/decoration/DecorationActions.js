import fetch from '../../util/fetchWrapper';
import { error } from '../media/MediaActions';

export function force() {
  return {
    type: 'DECORATION_FORCE',
    force: true,
  };
}

export function changeSearch(search) {
  return {
    type: 'DECORATION_SEARCH',
    search,
  };
}

export function changePage(page) {
  return {
    type: 'DECORATION_PAGE',
    page,
  };
}

export function request() {
  return { type: 'DECORATION_REQUEST' };
}

export function receive(pages, items) {
  return {
    type: 'DECORATION_RECEIVE',
    pages,
    items,
  };
}

export function fetchTmdb(search, page) {
  return (dispatch, getState) => {
    const isFetching = getState().decoration.isFetching;
    if (isFetching) {
      return Promise.resolve();
    }
    if (!search) {
      return Promise.resolve();
    }

    dispatch(request());

    const query = {
      page: {
        number: page,
      },
      filter: {
        search: search || undefined,
      },
    };
    if (search) {
      query.filter.search = search;
    }

    return fetch('/api/tmdb', query)
      .then(response => {
        if (response.error) {
          return Promise.reject(new Error(response.error.title));
        }

        return dispatch(receive(response.meta['total-pages'], response.data));
      })
      .catch(err => dispatch(error(err)));
  };
}
