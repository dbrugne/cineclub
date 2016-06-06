import { combineReducers, createStore, applyMiddleware } from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

// reducers
import whatsnew from '../whatsnew/WhatsNewReducer';
import medias from '../medias/MediasReducer';
import media from '../media/MediaReducer';
const reducers = combineReducers({
  whatsnew,
  medias,
  media,
  routing: routerReducer,
});

// store
export default function configureStore(history, initialState) {
  return createStore(
    reducers,
    initialState,
    applyMiddleware(routerMiddleware(history), thunk, createLogger())
  );
}
