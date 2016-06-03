import { combineReducers } from 'redux';
import whatsnew from '../whatsnew/WhatsNewReducer';
import media from '../media/MediaReducer';

const reducers = combineReducers({
  whatsnew,
  media,
});

export default reducers;
