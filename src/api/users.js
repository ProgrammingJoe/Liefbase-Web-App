import request from 'axios';
import urls, { performWithAuth } from './urls' ;

export const getCurrent = () => performWithAuth(request.get, urls.currentUser);
export const get = (id) => performWithAuth(request.get, urls.user(id));
export const list = () => performWithAuth(request.get, urls.users);
export const create = (values) => request.post(urls.users, values); // don't need authorization
export const update = (values) => performWithAuth(request.patch, urls.user(values.id), values);
export const destroy = (values) => performWithAuth(request.delete, urls.user(values.id));

export default {
  get,
  getCurrent,
  list,
  create,
  update,
  destroy,
};
