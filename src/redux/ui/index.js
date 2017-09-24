import { combineReducers } from 'redux';

import drawer from './drawer';
import modal from './modal';

const reducers = {
  drawer,
  modal,
};

export default combineReducers(reducers);

