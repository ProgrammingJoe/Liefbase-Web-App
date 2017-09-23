import api from '../../api';

export const get = (id) => {
  return async (dispatch) => {
    const response = await api.users.get(id);
    console.log(response);
  };
};

export const list = () => {
  return async (dispatch) => {
    const response = await api.users.list();
    console.log(response);
  };
};

export const create = (values) => {
  return async (dispatch) => {
    const response = await api.users.create(values);
    console.log(response);
  };
};

export const update = (values) => {
  return async (dispatch) => {
    const response = await api.users.update(values);
    console.log(response);
  };
};

export const destroy = (values) => {
  return async (dispatch) => {
    const response = await api.users.destroy(values);
    console.log(response);
  };
};

const initialState = { };

export default function reducer(state = initialState, action) {
  // TODO: make action creators and reduce some state.
  return state;
}
