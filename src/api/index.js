import request from 'axios';

import { signInURL,
         signOutURL,
         registerURL,
         getOrganizationsURL,
         mapsURL,
         getMapInfo,
         getMapHazardTemplatesURL,
         getMapResourceTemplatesURL,
         createResourceURL,
         createHazardURL,
         resourcesURL,
         hazardsURL,
       } from './urls';

export const signIn = (email, password) => request.post(
  signInURL,
  {email, password}
);

export const verifySession = () => request.get(signInURL);

export const getMapTemplates = (mapId) => Promise.all([
  request.get(getMapResourceTemplatesURL(mapId)),
  request.get(getMapHazardTemplatesURL(mapId))
 ])
  .then(response => ({resources: response[0], hazards: response[1]}));

export const signOut = () => request.get(signOutURL);

export const register = (
  first_name,
  last_name,
  email,
  password,
  confirm_password,
  organization_id
) => request.post(registerURL, {
  first_name,
  last_name,
  email,
  password,
  confirm_password,
  organization_id,
});

export const getMaps = () => request.get(mapsURL);

export const createMap = (
    name,
    description
  ) => request.post(mapsURL, {
    name,
    description,
  });

export const updateMapAPI = (id, name, description) => request.put(getMapInfo(id), { name, description });

export const getOrganizations = () => request.get(getOrganizationsURL);

export const createResourceAPI = (mapId, newResource) => request.post(createResourceURL(mapId), newResource);

export const createHazardAPI = (mapId, newHazard) => request.post(createHazardURL(mapId), newHazard);

export const modifyResourceAPI = (resourceId, modifiedResource) => request.put(resourcesURL(resourceId), modifiedResource);

export const modifyHazardAPI = (hazardId, modifiedHazard) => request.put(hazardsURL(hazardId), modifiedHazard);

export const deleteResourceAPI = (resourceId) => request.delete(resourcesURL(resourceId));

export const deleteHazardAPI = (hazardId) => request.delete(hazardsURL(hazardId));

export const deleteMapAPI = (mapId) => request.delete(getMapInfo(mapId));
