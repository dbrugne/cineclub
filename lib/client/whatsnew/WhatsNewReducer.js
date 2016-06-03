const initialState = {
  period: 1,
  isFetching: false,
  error: null,
  movies: [],
  series: [],
  unknown: [],
  removed: [],
  lastUpdated: null,
};

export default function WhatsNewReducer(state = initialState, action) {
  switch (action.type) {
    case 'WN_CHANGE_PERIOD':
      return Object.assign({}, state, { period: action.period });
    case 'WN_REQUEST':
      return Object.assign({}, state, {
        isFetching: true,
      });
    case 'WN_RECEIVE':
      return Object.assign({}, state, {
        isFetching: false,
        movies: action.movies,
        series: action.series,
        unknown: action.unknown,
        removed: action.removed,
        lastUpdated: action.receivedAt,
      });
    case 'WN_ERROR':
      return Object.assign({}, state, {
        error: action.error.message,
        isFetching: false,
      });

    default:
      return state;
  }
}
