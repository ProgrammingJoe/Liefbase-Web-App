import api from '../../api';
import { entitySuccess } from '../entities/actionCreators';

const SIGN_IN_SUCCESS = 'SIGN_IN_SUCCESS';
const SIGN_OUT_SUCCESS = 'SIGN_OUT_SUCCESS';

const signInSuccess = response => ({
  type: SIGN_IN_SUCCESS,
  payload: response.data,
});

const signOutSuccess = () => ({
  type: SIGN_OUT_SUCCESS,
});

export const signOut = () => dispatch => {
  localStorage.removeItem('token');
  dispatch(signOutSuccess());
};

// ex. values = { username, password }
export const signIn = options => {
  return async dispatch => {
    const response = await api.authorization.signIn(options);
    localStorage.setItem('token', response.data.token);

    const userResponse = await api.user.getCurrent();
    dispatch(signInSuccess(userResponse));
    dispatch(entitySuccess(userResponse));
  };
};

// ex. values = { token }
export const verify = (values) => {
  // error is thrown if verification fails.
  return async () => await api.authorization.verify(values);
};

export const refresh = () => {
  return async dispatch => {
    try {
      const values = { token: localStorage.getItem('token') };
      const response = await api.authorization.refresh({ values });
      localStorage.setItem('token', response.data.token);

      const userResponse = await api.user.getCurrent();
      dispatch(signInSuccess(userResponse));
      dispatch(entitySuccess(userResponse));
    } catch (err) {
      dispatch(signOut());
    }
  };
};

const initialState = {
  currentUserId: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
  case SIGN_IN_SUCCESS:
    return {
      ...state,
      currentUserId: action.payload.user.id,
    };

  case SIGN_OUT_SUCCESS:
    return {
      ...state,
      currentUserId: null,
    };
  }

  return state;
}
