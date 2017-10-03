const HIDE_MODAL = 'HIDE_MODAL';
const SHOW_SIGN_IN_MODAL = 'SHOW_SIGN_IN_MODAL';
const SHOW_REGISTER_MODAL = 'SHOW_REGISTER_MODAL';
const SHOW_CREATE_MAP_MODAL = 'SHOW_CREATE_MAP_MODAL';
const SHOW_UPDATE_MAP_MODAL = 'SHOW_UPDATE_MAP_MODAL';
const SHOW_CREATE_MAP_ITEM_MODAL = 'SHOW_CREATE_MAP_ITEM_MODAL';
const SHOW_UPDATE_MAP_ITEM_MODAL = 'SHOW_UPDATE_MAP_ITEM_MODAL';
const SHOW_CREATE_MAP_ITEM_TEMPLATE_MODAL = 'SHOW_CREATE_MAP_ITEM_TEMPLATE_MODAL';
const SHOW_UPDATE_MAP_ITEM_TEMPLATE_MODAL = 'SHOW_UPDATE_MAP_ITEM_TEMPLATE_MODAL';

export const showRegister = () => ({
    type: SHOW_REGISTER_MODAL,
});

export const showSignIn = () => ({
    type: SHOW_SIGN_IN_MODAL,
});

export const hideModal = () => ({
    type: HIDE_MODAL,
});

export const showCreateMap = () => ({
    type: SHOW_CREATE_MAP_MODAL,
});

export const showUpdateMap = payload => ({
    type: SHOW_UPDATE_MAP_MODAL,
    payload,
});

export const showCreateMapItem = entity => ({
  type: SHOW_CREATE_MAP_ITEM_MODAL,
  entity,
});

export const showUpdateMapItem = payload => ({
    type: SHOW_UPDATE_MAP_ITEM_MODAL,
    payload,
});

export const showCreateMapItemTemplate = () => ({
  type: SHOW_CREATE_MAP_ITEM_TEMPLATE_MODAL,
});

export const showUpdateMapItemTemplate = payload => ({
    type: SHOW_UPDATE_MAP_ITEM_TEMPLATE_MODAL,
    payload,
});

const initialState = {
  modalType: null,
  updateId: null,
  entity: null,
};

export default function reducer(state = initialState, action) {
  switch(action.type){
  case HIDE_MODAL:
    return initialState;

  case SHOW_SIGN_IN_MODAL:
    return {
      ...state,
      modalType: 'SIGN_IN',
    };

  case SHOW_REGISTER_MODAL:
    return {
      ...state,
      modalType: 'REGISTER',
    };

  case SHOW_CREATE_MAP_MODAL:
    return {
      ...state,
      modalType: 'CREATE_MAP',
    };

  case SHOW_UPDATE_MAP_MODAL:
    return {
      ...state,
      modalType: 'UPDATE_MAP',
      updateId: action.payload.id,
    };

  case SHOW_CREATE_MAP_ITEM_MODAL:
    return {
      ...state,
      modalType: 'CREATE_MAP_ITEM',
      entity: action.entity,
    };

  case SHOW_UPDATE_MAP_ITEM_MODAL:
    return {
      ...state,
      modalType: 'UPDATE_MAP_ITEM',
      updateId: action.payload.id,
    };

  case SHOW_CREATE_MAP_ITEM_TEMPLATE_MODAL:
    return {
      ...state,
      modalType: 'CREATE_MAP_ITEM_TEMPLATE',
    };

  case SHOW_UPDATE_MAP_ITEM_TEMPLATE_MODAL:
    return {
      ...state,
      modalType: 'UPDATE_MAP_ITEM_TEMPLATE',
      updateId: action.payload.id,
    };
  }

  return state;
}
