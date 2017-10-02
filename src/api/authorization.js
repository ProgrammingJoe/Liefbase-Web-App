import request from 'axios';
import urls from './urls' ;

export const signIn = options => request.post(urls.signIn, options.values);
export const verify = options => request.post(urls.verify, options.values);
export const refresh = options => request.post(urls.refresh, options.values);

export default {
  refresh,
  signIn,
  verify,
};
