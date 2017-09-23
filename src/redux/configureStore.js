import { createStore, compose, applyMiddleware, combineReducers } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import invariant from 'redux-immutable-state-invariant';

import { reducer as form } from 'redux-form';

import drawer from './modules/drawer';
import modal from './modules/modal';
import organization from './modules/organization';
import map from './modules/map';

import entities from './entities';

const loggerMiddleware = createLogger();

const createStoreWithMiddleware = compose(
  applyMiddleware(invariant(), thunk, loggerMiddleware),
  /**
   * Conditionally add the Redux DevTools extension enhancer
   * if it is installed.
   */
  window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
)(createStore);

const appReducer = combineReducers({
  drawer,
  modal,
  organization,
  map,
  entities,
  form,
});

const rootReducer = (state, action) => {
  return appReducer(state, action);
};

const configureStore = (initialState) => createStoreWithMiddleware(rootReducer, initialState);
export default configureStore;
