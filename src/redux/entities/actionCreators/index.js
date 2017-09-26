import api from '../../../api';
import { entities } from '../../../schema';

// default actions and behaviours for basic api tasks.
const actions = {};
const behaviours = {};

const getSuccess = entityName => payload => ({
  entityName,
  type: 'get',
  payload,
});

const get = entityName => id => async dispatch => {
  const response = await api[entityName].get(id);
  dispatch(actions[entityName].getSuccess(response.data));
  return response.data;
};

const listSuccess = entityName => payload => ({
  entityName,
  type: 'list',
  payload,
});

const list = entityName => () => async dispatch => {
  const response = await api[entityName].list();
  dispatch(actions[entityName].listSuccess(response.data));
  return response.data;
};

const createSuccess = entityName => payload => ({
  entityName,
  type: 'create',
  payload,
});

const create = entityName => values => async dispatch => {
  const response = await api[entityName].create(values);
  dispatch(actions[entityName].createSuccess(response.data));
  return response.data;
};

const updateSuccess = entityName => payload => ({
  entityName,
  type: 'update',
  payload,
});

const update = entityName => values => async dispatch => {
  const response = await api[entityName].update(values);
  dispatch(actions[entityName].updateSuccess(response.data));
  return response.data;
};

const destroySuccess = entityName => payload => ({
  entityName,
  type: 'destroy',
  payload,
});

const destroy = entityName => values => async dispatch => {
  const response = await api[entityName].destroy(values);
  dispatch(actions[entityName].destroySuccess(values));
  return true;
};


entities.forEach(e => {
  actions[e] = {
    getSuccess: getSuccess(e),
    listSuccess: listSuccess(e),
    createSuccess: createSuccess(e),
    updateSuccess: updateSuccess(e),
    destroySuccess: destroySuccess(e),
  };

  behaviours[e] = {
    get: get(e),
    list: list(e),
    create: create(e),
    update: update(e),
    destroy: destroy(e),
  }
});

export {
  actions,
  behaviours,
}
