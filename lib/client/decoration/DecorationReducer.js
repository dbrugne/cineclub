const initialState = {
  isFetching: false,
  didFetch: false,
  search: null,
  page: 1,
  pages: 0,
  items: [],
  force: false,
  chosen: null,
  didConfirm: false,
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
        chosen: null,
        didConfirm: false,
      });
    case 'DECORATION_FORCE':
      return Object.assign({}, state, {
        force: !state.force,
        didFetch: false,
        page: 1,
        pages: 0,
        items: [],
        chosen: null,
        didConfirm: false,
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
        chosen: null,
        didConfirm: false,
      });
    case 'DECORATION_RECEIVE':
      return Object.assign({}, state, {
        isFetching: false,
        didFetch: true,
        items: action.items ? action.items : [],
        pages: action.pages ? action.pages : 0,
      });

    case 'DECORATION_CHOOSE':
      return Object.assign({}, state, { chosen: action.chosen });
    case 'DECORATION_CONFIRM':
      return Object.assign({}, state, { didConfirm: true });
    case 'DECORATION_CANCEL':
      return Object.assign({}, state, { chosen: null, didConfirm: false });

    default:
      return state;
  }
}
