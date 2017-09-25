import api from '../../api';

import { signIn } from '../authorization';

const GET_USER_SUCCESS = 'GET_USER_SUCCESS';
const LIST_USER_SUCCESS = 'LIST_USER_SUCCESS';
const CREATE_USER_SUCCESS = 'CREATE_USER_SUCCESS';
const UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS';
const DESTROY_USER_SUCCESS = 'DESTROY_USER_SUCCESS';


export const getSuccess = (payload) => ({
  type: GET_USER_SUCCESS,
  payload,
});

const listSuccess = (payload) => ({
  type: LIST_USER_SUCCESS,
  payload,
});

const createSuccess = (payload) => ({
  type: CREATE_USER_SUCCESS,
  payload,
});

const updateSuccess = (payload) => ({
  type: UPDATE_USER_SUCCESS,
  payload,
});

const destroySuccess = (payload) => ({
  type: DESTROY_USER_SUCCESS,
  payload,
});

export const get = (id) => {
  return async (dispatch) => {
    const response = await api.users.get(id);
    dispatch(getSuccess(response.data));
  };
};

export const list = () => {
  return async (dispatch) => {
    const response = await api.users.list();
    dispatch(listSuccess(response.data));
  };
};


// current only called through registration so login the new user!
export const create = (values) => {
  return async (dispatch) => {
    const response = await api.users.create(values);
    dispatch(createSuccess(response.data));
    dispatch(signIn(values));
  };
};

export const update = (values) => {
  return async (dispatch) => {
    const response = await api.users.update(values);
    dispatch(updateSuccess(response.data));
  };
};

export const destroy = (values) => {
  return async (dispatch) => {
    await api.users.destroy(values);
    dispatch(destroySuccess(values));

    // todo: call signOut if destroyed state.authorization.currentuser
  };
};

const initialState = { };

export default function reducer(state = initialState, action) {
  switch(action.type) {
  case GET_USER_SUCCESS:
  case CREATE_USER_SUCCESS:
  case UPDATE_USER_SUCCESS:
    return {
      ...state,
      [action.payload.id]: action.payload
    };

  case DESTROY_USER_SUCCESS:
    const { ...newState } = state;
    delete newState[action.payload.id];
    return newState;

  case LIST_USER_SUCCESS:
    const users = {};
    action.payload.forEach((user) => users[user.id] = user);
    return {
      ...state,
      ...users,
    };
  }

  return state;
}
