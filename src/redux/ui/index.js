import { combineReducers } from 'redux';

import drawer from './drawer';
import modal from './modal';
import map from './map';

const reducers = {
  drawer,
  map,
  modal,
};

export default combineReducers(reducers);

