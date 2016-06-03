import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import reducer from './reducers';

const logger = createLogger();

export default function configureStore(initialState) {
  return createStore(
    reducer,
    initialState,
    applyMiddleware(thunk, logger)
  );
}
