import api from '../../../api';
import { entities } from '../../../schema';

export const entitySuccess = response => {
  const data = response.data;

  if (data === undefined) {
    return {
      type: 'DESTROY',
      entityName,
      id: response.id,
    };
  }

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

const methods = ['get', 'list', 'create', 'update', 'destroy'];

// default behaviours for basic api tasks.
const entityCrud = {};
entities.forEach(e => {
  entityCrud[e] = {};
  methods.forEach(m => {
    entityCrud[e][m] = options => async dispatch => {
      console.log(options);
      const response = await api[e][m](options);
      dispatch(entitySuccess(response));
      return response;
    };
  });
});

export default entityCrud;
