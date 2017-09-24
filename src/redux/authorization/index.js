import api from '../../api';

import { getSuccess as getUserSuccess } from '../entities/users';

const SIGN_IN_SUCCESS = 'SIGN_IN_SUCCESS';
const SIGN_OUT = 'SIGN_OUT';

const signInSuccess = (payload) => ({
  type: SIGN_IN_SUCCESS,
  payload,
});

export const signOut = () => ({
  type: SIGN_OUT,
});

// ex. values = { username, password }
export const signIn = (values) => {
  return async dispatch => {
    // returns { token }
    const response = await api.authorization.signIn(values);
    console.log(response);
    // todo: save token and wrap future requests with it.

    const user = await api.users.getCurrent();
    dispatch(signInSuccess(user));
    dispatch(getUserSuccess(user));
  };
};

// ex. values = { token }
export const verify = (values) => {
  // error is thrown if verification fails.
  return async () => await api.authorization.verify(values);
};

export const refresh = (values) => {
  return async dispatch => {
    try {
      await api.authorization.refresh(values);
      // todo: refresh saved token
    } catch (err) {
      dispatch(signOut());
    }
  };
};

const initialState = {
  currentUserId: undefined,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
  case SIGN_IN_SUCCESS:
    return {
      ...state,
      currentUserId: action.payload.id,
    };

  case SIGN_OUT:
    return {
      ...state,
      currentUserId: undefined,
    };
  }

  return state;
}
