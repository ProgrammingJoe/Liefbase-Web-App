import api from '../../api';

import { selectMap } from '../ui/map';

const GET_RELIEFMAP_SUCCESS = 'GET_RELIEFMAP_SUCCESS';
const LIST_RELIEFMAP_SUCCESS = 'LIST_RELIEFMAP_SUCCESS';
const CREATE_RELIEFMAP_SUCCESS = 'CREATE_RELIEFMAP_SUCCESS';
const UPDATE_RELIEFMAP_SUCCESS = 'UPDATE_RELIEFMAP_SUCCESS';
const DESTROY_RELIEFMAP_SUCCESS = 'DESTROY_RELIEFMAP_SUCCESS';


const getSuccess = (payload) => ({
  type: GET_RELIEFMAP_SUCCESS,
  payload,
});

const listSuccess = (payload) => ({
  type: LIST_RELIEFMAP_SUCCESS,
  payload,
});

const createSuccess = (payload) => ({
  type: CREATE_RELIEFMAP_SUCCESS,
  payload,
});

const updateSuccess = (payload) => ({
  type: UPDATE_RELIEFMAP_SUCCESS,
  payload,
});

const destroySuccess = (payload) => ({
  type: DESTROY_RELIEFMAP_SUCCESS,
  payload,
});

export const get = (id) => {
  return async (dispatch) => {
    const response = await api.reliefMaps.get(id);
    dispatch(getSuccess(response.data));
  };
};

export const list = () => {
  return async (dispatch) => {
    const response = await api.reliefMaps.list();
    dispatch(listSuccess(response.data));
  };
};

export const create = (values) => {
  return async (dispatch) => {
    const response = await api.reliefMaps.create(values);
    dispatch(createSuccess(response.data));
    dispatch(selectMap(response.data));
  };
};

export const update = (values) => {
  return async (dispatch) => {
    const response = await api.reliefMaps.update(values);
    dispatch(updateSuccess(response.data));
  };
};

export const destroy = (values) => {
  return async (dispatch) => {
    await api.reliefMaps.destroy(values);
    dispatch(destroySuccess(values));
  };
};

const initialState = { };

export default function reducer(state = initialState, action) {
  switch(action.type) {
  case GET_RELIEFMAP_SUCCESS:
  case CREATE_RELIEFMAP_SUCCESS:
  case UPDATE_RELIEFMAP_SUCCESS:
    return {
      ...state,
      [action.payload.id]: action.payload
    };

  case DESTROY_RELIEFMAP_SUCCESS:
    const { ...newState } = state;
    delete newState[action.payload.id];
    return newState;

  case LIST_RELIEFMAP_SUCCESS:
    const maps = {};
    action.payload.forEach((map) => maps[map.id] = map);
    return {
      ...state,
      ...maps,
    };
  }

  return state;
}
