import request from 'axios';
import urls from './urls' ;

export const get = (id) => request.get(urls.user(id));
export const list = () => request.get(urls.users);
export const create = (values) => request.post(urls.users, values);
export const update = (values) => request.patch(urls.users, values);
export const destroy = (id) => request.delete(urls.user(id));

export default {
  get,
  list,
  create,
  update,
  destroy,
};
