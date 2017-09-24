import request from 'axios';
import urls from './urls' ;

export const getCurrent = () => request.get(urls.currentUser);
export const get = (id) => request.get(urls.user(id));
export const list = () => request.get(urls.users);
export const create = (values) => request.post(urls.users, values);
export const update = (values) => request.patch(urls.user(values.id), values);
export const destroy = (id) => request.delete(urls.user(id));

export default {
  get,
  getCurrent,
  list,
  create,
  update,
  destroy,
};
