import request from 'axios';

import api from './urls' ;

export const signIn = (email, password) => request.post(api.signIn, {email, password});
export const verifySession = () => request.get(api.verifyJwt);
export const signOut = () => console.log('todo get rid of me');

export const register = (values) => request.post(api.users, values);

export const getMaps = () => request.get(api.reliefMaps);
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
