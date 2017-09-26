import { combineReducers } from 'redux';

import Immutable from 'seamless-immutable';

import { entities } from '../../schema';

const buildReducer = (entityName) => (state = Immutable.from({}), action) => {
  let newState = state;

  if (action.entities && action.entities[entityName]) {
    newState = newState.merge(
      action.entities[entityName],
      { deep: true }
    );
  } else if (action.entityName === entityName && action.type === 'DESTROY') {
    newState = newState.without(action.id);
  }

  return newState;
};

const reducers = {};
entities.forEach(e => reducers[e] = buildReducer(e));

export default combineReducers(reducers);

