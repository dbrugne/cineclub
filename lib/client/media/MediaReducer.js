const initialState = {
  isFetching: false,
  error: null,
  data: null,
};

export default function MediaReducer(state = initialState, action) {
  switch (action.type) {
    case 'MEDIA_REQUEST':
      return Object.assign({}, state, {
        isFetching: true,
      });
    case 'MEDIA_RECEIVE':
      return Object.assign({}, state, {
        isFetching: false,
        data: action.data,
      });
    case 'MEDIA_ERROR':
      return Object.assign({}, state, {
        error: action.error.message,
        isFetching: false,
      });

    default:
      return state;
  }
}
