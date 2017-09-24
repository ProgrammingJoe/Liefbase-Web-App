import request from 'axios';
import urls from './urls' ;

import users from './users';
import authorization from './authorization';

export default {
  authorization,
  users,
};

export const getMaps = () => request.get(urls.reliefMaps);
export const createMap = () => console.log('todo get rid of me');
export const updateMapAPI = () => console.log('todo get rid of me');
export const deleteMapAPI = () => console.log('todo get rid of me');

export const getMapTemplates = () => console.log('todo get rid of me');

export const createResourceAPI = () => console.log('todo get rid of me');
export const createHazardAPI = () => console.log('todo get rid of me');
export const modifyResourceAPI = () => console.log('todo get rid of me');
export const modifyHazardAPI = () => console.log('todo get rid of me');
export const deleteResourceAPI = () => console.log('todo get rid of me');
export const deleteHazardAPI = () => console.log('todo get rid of me');

export const getOrganizations = () => console.log('todo get rid of me');
