import { combineReducers } from 'redux';
import whatsnew from '../whatsnew/WhatsNewReducer';

const reducers = combineReducers({
  whatsnew,
});

export default reducers;
