import { normalize } from 'normalizr';

import api from '../../../api';
import schemas, { entities } from '../../../schema';

export const entitySuccess = entityName => data => {
  const normalized = normalize(data, schemas[entityName]);
  const entities = normalized.entities;

  return {
    type: 'ENTITY_SUCCESS',
    entities,
  };
};

const listEntitiesSuccess = entityName => data => {
  const normalized = normalize(data, [schemas[entityName]]);
  const entities = normalized.entities;

  return {
    type: 'LIST_ENTITIES_SUCCESS',
    entities,
  };
};

const destroySuccess = entityName => data => ({
  type: 'DESTROY',
  entityName,
  id: data.id,
});

const get = entityName => values => async dispatch => {
  const response = await api[entityName].get(values);
  dispatch(entitySuccess(entityName)(response.data));
  return response.data;
};

const list = entityName => () => async dispatch => {
  const response = await api[entityName].list();
  dispatch(listEntitiesSuccess(entityName)(response.data));
  return response.data;
};

const create = entityName => values => async dispatch => {
  const response = await api[entityName].create(values);
  dispatch(entitySuccess(entityName)(response.data));
  return response.data;
};

const update = entityName => values => async dispatch => {
  const response = await api[entityName].update(values);
  dispatch(entitySuccess(entityName)(response.data));
  return response.data;
};

const destroy = entityName => values => async dispatch => {
  await api[entityName].destroy(values);
  dispatch(destroySuccess(entityName)(values));
  return true;
};

// default behaviours for basic api tasks.
const entityCrud = {};
entities.forEach(e => {
  entityCrud[e] = {
    get: get(e),
    list: list(e),
    create: create(e),
    update: update(e),
    destroy: destroy(e),
  };
});

export default entityCrud;
