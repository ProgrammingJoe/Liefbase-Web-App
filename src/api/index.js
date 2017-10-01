import request from 'axios';

import { entities } from '../schema';
import urls, { performWithAuth } from './urls' ;
import authorization from './authorization';

const apiMethods = { authorization };

entities.forEach(e => apiMethods[e] = {
  get: values => performWithAuth(request.get, urls[e](values.id)),
  list: () => performWithAuth(request.get, urls[`${e}s`]),
  create: values => performWithAuth(request.post, urls[`${e}s`], values),
  update: values => performWithAuth(request.patch, urls[e](values.id), values),
  destroy: values => performWithAuth(request.delete, urls[e](values.id)),
});

// TODO: eventually split custom methods out into files
apiMethods.user.getCurrent = () => performWithAuth(request.get, urls.currentUser);

export default apiMethods;
