import { combineReducers } from 'redux';

import Immutable from 'seamless-immutable';

import { entities } from '../../schema';

/**
  * actions: {
  *   entityName: 'example',
  *   type: 'get'|'list'|'update'|'create'|'destroy',
  *   payload: {} | []
  * }
  */
const buildReducer = (entityName) => (state = Immutable.from({}), action) => {
  let newState = state;

  if (action.entityName === entityName) {
    const replaceMethods = ['get', 'update', 'create'];
    if (replaceMethods.includes(action.type)) {
      newState = newState.merge(
        { [action.payload.id]: action.payload },
        { deep: true }
      );
    } else if (action.type === 'list') {
      const entities = {};
      action.payload.forEach(e => entities[e.id] = e);
      newState = newState.merge(
        entities,
        { deep: true }
      );
    } else if (action.type === 'destroy') {
      newState = newState.without(action.payload.id);
    }
  }

  return newState;
};

const reducers = {};
entities.forEach(e => reducers[e] = buildReducer(e));

export default combineReducers(reducers);

