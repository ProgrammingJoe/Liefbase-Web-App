const HIDE_MODAL = 'HIDE_MODAL';
const SHOW_SIGN_IN_MODAL = 'SHOW_SIGN_IN_MODAL';
const SHOW_REGISTER_MODAL = 'SHOW_REGISTER_MODAL';
const SHOW_CREATE_MAP_MODAL = 'SHOW_CREATE_MAP_MODAL';
const SHOW_UPDATE_ENTITY_MODAL = 'SHOW_UPDATE_ENTITY_MODAL';
const SHOW_EDIT_MAP_DETAILS_MODAL = 'SHOW_EDIT_MAP_DETAILS_MODAL';

export function showRegister() {
  return {
    type: SHOW_REGISTER_MODAL,
  };
}

export function showSignIn() {
  return {
    type: SHOW_SIGN_IN_MODAL,
  };
}

export function hideModal() {
  return {
    type: HIDE_MODAL,
  };
}

export function showCreateMap() {
  return {
    type: SHOW_CREATE_MAP_MODAL,
  };
}

export function showEditMapDetails() {
  return {
    type: SHOW_EDIT_MAP_DETAILS_MODAL
  };
}

export function showUpdateEntity(entity) {
  return {
    type: SHOW_UPDATE_ENTITY_MODAL,
    entity,
  };
}

const initialState = {
  modalType: null,
  entity: null,
};

export default function reducer(state = initialState, action) {
  switch(action.type){
  case SHOW_SIGN_IN_MODAL:
    return Object.assign(
      {},
      state,
      { modalType: 'SIGN_IN' },
    );

  case SHOW_REGISTER_MODAL:
    return Object.assign(
      {},
      state,
      { modalType: 'REGISTER'  },
    );

  case HIDE_MODAL:
    return Object.assign(
      {},
      state,
      { modalType: null, entity: null },
    );

  case SHOW_CREATE_MAP_MODAL:
    return Object.assign(
      {},
      state,
      { modalType: 'CREATE_MAP' },
    );

  case SHOW_UPDATE_ENTITY_MODAL:
    return {
      ...state,
      modalType: 'UPDATE_ENTITY',
      entity: action.entity,
    };

  case SHOW_EDIT_MAP_DETAILS_MODAL:
    return {
      ...state,
      modalType: 'EDIT_MAP_DETAILS',
    };

  default:
    return state;
  }
}
