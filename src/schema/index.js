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

filterPreset.define({
  // todo: define me properly.
});

mapItem.define({
  properties: {
    mapItemTemplate
  },
});

mapItemTemplate.define({
  reliefMap: reliefMap,
  mapItems: {
    features: [mapItem],
  },
});

membership.define({
  // todo: define me properly.
});

organization.define({
  // todo: define me properly.
});

reliefMap.define({
  mapItemTemplates: [mapItemTemplate],
});

team.define({
  // todo: define me properly.
});

templatePreset.define({
  // todo: define me properly.
});

user.define({
  // todo: define me properly.
});

export default schemas;
