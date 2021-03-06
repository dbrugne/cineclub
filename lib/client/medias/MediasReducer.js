const initialState = {
  isFetching: false,
  error: null,
  search: null,
  category: 'decorated',
  page: 1,
  pages: 0,
  items: [],
};

export default function MediaReducer(state = initialState, action) {
  switch (action.type) {
    case 'MEDIAS_SEARCH':
      return Object.assign({}, state, {
        search: action.search,
        page: 1,
      });
    case 'MEDIAS_CATEGORY':
      return Object.assign({}, state, {
        category: action.category,
        page: 1,
      });
    case 'MEDIAS_PAGE':
      return Object.assign({}, state, {
        page: action.page,
      });
    case 'MEDIAS_REQUEST':
      return Object.assign({}, state, {
        isFetching: true,
      });
    case 'MEDIAS_RECEIVE':
      return Object.assign({}, state, {
        isFetching: false,
        error: null,
        items: action.items ? action.items : [],
        pages: action.pages ? action.pages : 0,
      });
    case 'MEDIAS_ERROR':
      return Object.assign({}, state, {
        error: action.error.message,
        isFetching: false,
        items: [],
        pages: 0,
      });

    default:
      return state;
  }
}
