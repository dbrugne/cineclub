const initialState = {
  isFetching: false,
  isPatching: false,
  error: null,
  data: null,
};

export default function MediaReducer(state = initialState, action) {
  switch (action.type) {
    case 'DECORATION_RECEIVE':
      return Object.assign({}, state, {
        error: null,
      });
    case 'MEDIA_REQUEST':
      return Object.assign({}, state, {
        isFetching: true,
      });
    case 'MEDIA_RECEIVE':
      return Object.assign({}, state, {
        isFetching: false,
        isPatching: false,
        error: null,
        data: action.data,
      });
    case 'MEDIA_ERROR':
      return Object.assign({}, state, {
        error: action.error.message,
        isFetching: false,
      });
    case 'MEDIA_DECORATION_REQUEST':
      return Object.assign({}, state, {
        isPatching: true,
      });

    default:
      return state;
  }
}
