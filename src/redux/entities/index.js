import { combineReducers } from 'redux';

import Immutable from 'seamless-immutable';

import { entities } from '../../schema';

const buildReducer = entityName => (state = Immutable.from({}), action) => {
  let newState = state;

  if (action.entities && action.entities[entityName]) {
    newState = newState.merge(action.entities[entityName], { deep: true });
  } else if (action.type === 'DESTROY') {
    if (action.entityName === entityName) {
      newState = newState.without(action.id);
    } else if (action.entityName === 'mapItem' && entityName === 'mapItemTemplate') {
      const newTemplates = {};

      Object.entries(newState).forEach(([k, v]) => {
        const mapItems = v.mapItems.filter(id => id !== action.id);
        newTemplates[k] = { ...v, mapItems };
      });

      newState = newState.merge(newTemplates, { deep: true });
    }
  }

  return newState;
};

const reducers = {};
entities.forEach(e => reducers[e] = buildReducer(e));

export default combineReducers(reducers);

