import { combineReducers } from 'redux';

import users from './users';
import organizations from './organizations';
import reliefMaps from './reliefMaps';

const reducers = {
  organizations,
  reliefMaps,
  users,
};

export default combineReducers(reducers);

