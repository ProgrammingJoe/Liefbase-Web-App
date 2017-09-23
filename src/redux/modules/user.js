import {
  signIn as signInAPI,
  signOut as signOutAPI,
  verifySession as verifySessionAPI,
} from '../../api';

import { hideModal } from './modal';
import { getMaps } from './map';

const SIGN_IN_PENDING = 'SIGN_IN_PENDING';
const SIGN_IN_SUCCESS = 'SIGN_IN_SUCCESS';
const SIGN_IN_ERROR = 'SIGN_IN_ERROR';
export const SIGN_OUT = 'SIGN_OUT';

export function signInPending() {
  return {
    type: SIGN_IN_PENDING,
  };
}

export function signInSuccess(payload) {
  return {
    type: SIGN_IN_SUCCESS,
    payload,
  };
}

export function signInError(error) {
  return {
    type: SIGN_IN_ERROR,
    error,
  };
}

function signOutAction() {
  return {
    type: SIGN_OUT,
  };
}

export function signOut() {
  return dispatch => {
    return signOutAPI().then(() => dispatch(signOutAction()));
  };
}

export function clearStatus() {
  return dispatch => dispatch(signInError());
}

export function verifySession() {
  return dispatch => {
    return verifySessionAPI()
      .then(response => dispatch(signInSuccess({
        email: response.data.email,
        firstName: response.data.first_name,
        lastName: response.data.last_name,
        permission: response.data.permission,
        organizationId: response.data.organization_id,
      })))
      .catch(() => {
        // Do nothing. If this fails it means there is no current session.
      });
  };
}

export function signIn(email, password) {
  return (dispatch) => {
    dispatch(signInPending());
    return signInAPI(email, password)
      .then(response => {
        dispatch(getMaps());
        dispatch(hideModal());

        return dispatch(
          signInSuccess({
            email: response.data.email,
            firstName: response.data.first_name,
            lastName: response.data.last_name,
            permission: response.data.permission,
            organizationId: response.data.organization_id,
          }));
     })
     .catch(error => {
        if (error.response) {
          const errorMessage = error.response.data.error;
          return dispatch(signInError(errorMessage));
        }

        return dispatch(signInError('Unknown login error'));
     });
  };
}

const initialState = {
  pending: false,
  error: undefined,
  firstName: undefined,
  lastName: undefined,
  email: undefined,
  permission: undefined,
  organizationId: undefined,
};

export default function reducer(state = initialState, action) {
  switch(action.type){
  case SIGN_IN_SUCCESS:
    return {
      ...state,
      pending: false,
      error: undefined,
      firstName: action.payload.firstName,
      lastName: action.payload.lastName,
      email: action.payload.email,
      permission: action.payload.permission,
      organizationId: action.payload.organizationId,
    };

  case SIGN_IN_PENDING:
    return {
      ...state,
      pending: true,
    };

  case SIGN_IN_ERROR:
    return {
      ...state,
      pending: false,
      error: action.error,
    };

  case SIGN_OUT:
    return {
      ...state,
      ...initialState,
    };

  default:
    return state;
  }
}
