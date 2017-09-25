import request from 'axios';
import urls, { performWithAuth } from './urls' ;

export const get = (id) => performWithAuth(request.get, urls.reliefMap(id));
export const list = () => request.get(urls.reliefMaps);
export const create = (values) => performWithAuth(request.post, urls.reliefMaps, values);
export const update = (values) => performWithAuth(request.patch, urls.reliefMap(values.id), values);
export const destroy = (id) => performWithAuth(request.delete, urls.reliefMap(id));

export default {
  get,
  list,
  create,
  update,
  destroy,
};
