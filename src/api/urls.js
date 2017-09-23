const signIn = '/api/token-auth/';
const refreshJwt = '/api/token-refresh/';
const verifyJwt = '/api/token-verify/';

const filterPresets = '/api/filterpresets/';
const filterPreset = id => `${filterPresets}${id}`;

const mapItems = '/api/mapitems/';
const mapItem = id => `${mapItems}${id}`;

const mapItemTemplates = '/api/mapitemtemplates/';
const mapItemTemplate = id => `${mapItemTemplates}${id}`;

// TODO: find a way to add query parameters to urls nicely
const memberships = '/api/memberships/';
const membership = id => `${memberships}${id}`;

const organizations = '/api/organizations/';
const organization = id => `${organizations}${id}`;

const reliefMaps = '/api/reliefmaps/';
const reliefMap = id => `${reliefMaps}${id}`;

const teams = '/api/teams/';
const team = id => `${teams}${id}`;

const templatePresets = '/api/templatepresets/';
const templatePreset = id => `${templatePresets}${id}`;

const users = '/api/users/';
const user = id => `${users}${id}`;

export default {
  signIn,
  refreshJwt,
  verifyJwt,
  filterPresets,
  filterPreset,
  mapItems,
  mapItem,
  mapItemTemplates,
  mapItemTemplate,
  memberships,
  membership,
  organizations,
  organization,
  reliefMaps,
  reliefMap,
  teams,
  team,
  templatePresets,
  templatePreset,
  users,
  user,
};
