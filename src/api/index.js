import request from 'axios';

import { entities } from '../schema';
import urls from './urls' ;
import authorization from './authorization';


const performRequest = (method, url, options = {}) => {
  const { values: data, params } = options;

  const config = {
    method,
    url,
    data,
    params,
  };

  const token = localStorage.getItem('token');
  if (token) {
    config.headers = { 'Authorization': `jwt ${token}` };
  }

  return request(config);
};

const apiMethods = { authorization };

entities.forEach(e => apiMethods[e] = {
  get: options => performRequest('get', urls[e](options.values.id), options),
  list: options => performRequest('get', urls[`${e}s`], options),
  create: options => performRequest('post', urls[`${e}s`], options),
  update: options => performRequest('patch', urls[e](options.values.id), options),
  destroy: options => performRequest('delete', urls[e](options.values.id), options),
});

// TODO: eventually split custom methods out into files
apiMethods.user.getCurrent = options => performRequest('get', urls.currentUser, options);

export default apiMethods;
