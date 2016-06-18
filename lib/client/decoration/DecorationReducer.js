const initialState = {
  isFetching: false,
  didFetch: false,
  search: null,
  page: 1,
  pages: 0,
  items: [],
  force: false,
};

export default function DecorationReducer(state = initialState, action) {
  switch (action.type) {
    case 'MEDIA_REQUEST':
    case 'MEDIA_RECEIVE':
    case 'MEDIA_ERROR':
      return Object.assign({}, state, {
        isFetching: false,
        didFetch: false,
        search: null,
        page: 1,
        pages: 0,
        items: [],
        force: false,
      });
    case 'DECORATION_FORCE':
      return Object.assign({}, state, {
        force: !state.force,
        didFetch: false,
        page: 1,
        pages: 0,
        items: [],
      });
    case 'DECORATION_SEARCH':
      return Object.assign({}, state, {
        search: action.search,
        page: 1,
      });
    case 'DECORATION_PAGE':
      return Object.assign({}, state, {
        page: action.page,
      });
    case 'DECORATION_REQUEST':
      return Object.assign({}, state, {
        isFetching: true,
        didFetch: false,
        pages: 0,
        items: [],
      });
    case 'DECORATION_RECEIVE':
      return Object.assign({}, state, {
        isFetching: false,
        didFetch: true,
        items: action.items ? action.items : [],
        pages: action.pages ? action.pages : 0,
        lastFetch: Date.now(),
      });

    default:
      return state;
  }
}
