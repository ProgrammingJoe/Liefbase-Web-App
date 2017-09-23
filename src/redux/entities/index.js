import { combineReducers } from 'redux';

import users from './users';

const reducers = {
  users,
};

export default combineReducers(reducers);

