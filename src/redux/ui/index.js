import { combineReducers } from 'redux';

import drawer from './drawer';
import modal from './drawer';

const reducers = {
  drawer,
  modal,
};

export default combineReducers(reducers);

