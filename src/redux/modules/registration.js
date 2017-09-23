import { register as registerAPI } from '../../api';
import { hideModal } from './modal';
import { signIn } from './user';

const REGISTRATION_PENDING = 'REGISTRATION_PENDING';
const REGISTRATION_SUCCUSS = 'REGISTRATION_SUCCESS';
const REGISTRATION_ERROR = 'REGISTRATION_ERROR';
const REGISTRATION_INITIALIZE = 'REGISTRATION_INITIALIZE';

export const pending = () => ({
    type: REGISTRATION_PENDING,
});

export const success = () => ({
    type: REGISTRATION_SUCCUSS,
});

export const error = (error) => ({
    type: REGISTRATION_ERROR,
    error
});

export const initialize = () => ({
    type: REGISTRATION_INITIALIZE,
});

export function clearStatus() {
  return dispatch => dispatch(error());
}

export function register(firstName, lastName, email, password, cpassword, organizationId) {
  return (dispatch) => {
    if(password !== cpassword){
      return dispatch(error('Passwords do not match'));
    }
    dispatch(pending());
    return registerAPI(
      firstName,
      lastName,
      email,
      password,
      cpassword,
      organizationId
    ).then(() => {
      dispatch(hideModal());
      dispatch(signIn(email, password));
      return dispatch(success());
    })
    .catch((err) => {
      if (err.response) {
        const errorMessage = err.response.data.error;
        return dispatch(error(errorMessage));
      }

      return dispatch(error('Unknown registration error'));
    });
  };
}

const initialState = {
  pending: false,
  error: undefined,
  success: false,
};

export default function reducer(state = initialState, action) {
  switch(action.type){

    case REGISTRATION_SUCCUSS:
      return {
        ...state,
        pending: false,
        error: undefined,
        success: true,
      };

    case REGISTRATION_ERROR:
      return {
        ...state,
        pending: false,
        error: action.error,
      };

    case REGISTRATION_PENDING:
      return {
        ...state,
        pending: true,
      };

    case REGISTRATION_INITIALIZE:
      return {
        ...state,
        ...initialState,
      };

    default:
      return state;
  }
}
