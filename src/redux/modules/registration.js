import { register as registerAPI } from '../../api';

export const register = (values) => {
  return async (dispatch) => {
    await registerAPI(values);
    // TODO: authenticate/store token
  };
};
