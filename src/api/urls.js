export const signInURL = '/api/authenticate';
export const signOutURL = '/api/logout';
export const registerURL = '/api/users';
export const getOrganizationsURL = '/api/organizations';
export const createMapURL = '/api/reliefmaps'; // DEPRECATED!!!! delete once safe
export const mapsURL = '/api/reliefmaps';
export const getMapInfo = mapId => `/api/reliefmaps/${mapId}`;
export const getMapHazardTemplatesURL = mapId => `${getMapInfo(mapId)}/hazardtemplates`;
export const getMapResourceTemplatesURL = mapId => `${getMapInfo(mapId)}/resourcetemplates`;

export const createHazardURL = (mapId) => `${getMapInfo(mapId)}/hazards`;
export const createResourceURL = (mapId) => `${getMapInfo(mapId)}/resources`;
export const hazardsURL = (hazardId) => `/api/hazards/${hazardId}`;
export const resourcesURL = (resourceId) => `/api/resources/${resourceId}`;
