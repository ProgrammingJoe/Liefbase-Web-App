import request from 'axios';
import urls from './urls' ;

export const signIn = (values) => request.post(urls.signIn, values);
export const verify = (values) => request.post(urls.verify, values);
export const refresh = (values) => request.post(urls.refresh, values);

export default {
  refresh,
  signIn,
  verify,
};
