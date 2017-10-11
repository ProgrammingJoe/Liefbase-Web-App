import { combineReducers } from 'redux';

import Immutable from 'seamless-immutable';

import { entities } from '../../schema';

const buildReducer = entityName => (state = Immutable.from({}), action) => {
  let newState = state;

  if (action.entities && action.entities[entityName]) {
    newState = newState.merge(action.entities[entityName], { deep: true });
  } else if (action.type === 'DESTROY' && action.entityName === entityName) {
    newState = newState.without(action.id);
  }

  return newState;
};

const reducers = {};
entities.forEach(e => reducers[e] = buildReducer(e));

// supplement default behaviour to update on mapItem update and delete
const mapItemTemplateReducer = (state = Immutable.from({}), action) => {
  let newState = buildReducer('mapItemTemplate')(state, action);

  if (action.type === 'DESTROY' && action.entityName === entities.mapItem) {
    const newTemplates = {};

    Object.entries(newState).forEach(([k, v]) => {
      const mapItems = v.mapItems.filter(id => id !== action.id);
      newTemplates[k] = { ...v, mapItems };
    });

    newState = newState.merge(newTemplates, { deep: true });
  }

  if (action.entities && action.entities.mapItem) {
    const newTemplates = {};
    const mapItemIds = Object.keys(action.entities.mapItem);

    Object.entries(newState).forEach(([k, v]) => {
      const mapItems = v.mapItems.filter(id =>
        !mapItemIds.includes(id.toString()) || action.entities.mapItem[id.toString()].mapItemTemplate.toString() === k);

      newTemplates[k] = { ...v, mapItems };
    });

    newState = newState.merge(newTemplates, { deep: true });
  }

  return newState;
};
reducers.mapItemTemplate = mapItemTemplateReducer;

export default combineReducers(reducers);

