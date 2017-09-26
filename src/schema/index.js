import { schema } from 'normalizr';

export const entities = [
  'filterPreset',
  'mapItem',
  'mapItemTemplate',
  'membership',
  'organization',
  'reliefMap',
  'team',
  'templatePreset',
  'user',
];


const schemas = {};
entities.forEach(e => schemas[e] = new schema.Entity(e));

const {
  filterPreset,
  mapItem,
  mapItemTemplate,
  membership,
  organization,
  reliefMap,
  team,
  templatePreset,
  user,
} = schemas;

filterPreset.define({});

mapItem.define({});

mapItemTemplate.define({
  mapItems: {
    features: [mapItem],
  },
});

membership.define({});

organization.define({});

reliefMap.define({
  mapItemTemplates: [mapItemTemplate],
});

team.define({});

templatePreset.define({});

user.define({});

export default schemas;
