import api from '../../../api';
import { entities } from '../../../schema';

export const entitySuccess = data => {
  const entities = {};

  Object.keys(data).forEach(name => {
    entities[name] = {};

    // todo: do pluralization properly
    if (name.slice(-1) !== 's') {
      entities[name][data[name].id] = data[name];
    } else {
      const singularName = name.slice(0, -1);
      entities[singularName] = {};
      data[name].forEach(entity => entities[singularName][entity.id] = entity);
    }
  });

  return {
    type: 'ENTITY_SUCCESS',
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
  dispatch(entitySuccess(response.data));
  return response.data;
};

const list = entityName => () => async dispatch => {
  const response = await api[entityName].list();
  dispatch(entitySuccess(response.data));
  return response.data;
};

const create = entityName => values => async dispatch => {
  const response = await api[entityName].create(values);
  dispatch(entitySuccess(response.data));
  return response.data;
};

const update = entityName => values => async dispatch => {
  const response = await api[entityName].update(values);
  dispatch(entitySuccess(response.data));
  return response.data;
};

const destroy = entityName => values => async dispatch => {
  await api[entityName].destroy(values);
  dispatch(destroySuccess(values));
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
