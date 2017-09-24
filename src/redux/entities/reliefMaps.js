import {
  updateMapAPI,
  createMap as createMapAPI,
  getMaps as getMapsAPI,
  getMapTemplates as getMapTemplatesAPI,
  createResourceAPI,
  createHazardAPI,
  modifyHazardAPI,
  modifyResourceAPI,
  deleteHazardAPI,
  deleteResourceAPI,
  deleteMapAPI,
} from '../../api';
import { hideModal } from '../ui/modal';

import { clamp } from '../../util/Numbers';
import R from 'ramda';

const PENDING = 'MAP/PENDING';
const SUCCESS = 'MAP/SUCCESS';
const ERROR = 'MAP/ERROR';
const CLEAR_STATUS = 'MAP/CLEAR_STATUS';
const SELECT_MAP = 'MAP/SELECT';
const DELETE_MAP = 'MAP/DELETE';
const UPDATE_MAP = 'MAP/UPDATE';
const ADD_ENTITY = 'MAP/ENTITY/ADD';
const UPDATE_ENTITY = 'MAP/ENTITY/UPDATE';
const DELETE_ENTITY = 'MAP/ENTITY/DELETE';
const SELECT_ENTITY = 'MAP/ENTITY/SELECT';
const DESELECT_ALL = 'MAP/ENTITY/DESELECT_ALL';
const SET_TILEMAP = 'MAP/VIEW/SET_TILEMAP';
const SET_POSITION = 'MAP/VIEW/POSITION';
const SET_BOUNDS = 'MAP/VIEW/BOUNDS';
const CLEAR_BOUNDS = 'MAP/VIEW/CLEAR_BOUNDS';
const SET_ENTITY_FILTER = 'MAP/ENTITY/FILTER/SET';
const PUT_ENTITY_FILTERS = 'MAP/ENTITY/FILTER/PUT';
const UNSET_ENTITY_FILTER = 'MAP/ENTITY/FILTER/UNSET';
const CLEAR_ENTITY_FILTERS = 'MAP/ENTITY/FILTER/CLEAR';
const SET_MAP_TEMPLATES = 'MAP/DATA/SET_TEMPLATES';

const pending = () => ({
  type: PENDING,
});

const success = (payload) => ({
  type: SUCCESS,
  payload,
});

const error = () => ({
  type: ERROR,
});

const updateMapAction = (map) => ({
  type: UPDATE_MAP,
  map
});

const clearStatus = () => ({
  type: CLEAR_STATUS,
});

export const updateEntity = (mapId, payload) => ({
  type: UPDATE_ENTITY,
  payload,
  mapId,
});

export const addEntity = (mapId, entity) => ({
  type: ADD_ENTITY,
  mapId,
  entity,
});

export const setEntityFilter = (kind, id) => ({
  type: SET_ENTITY_FILTER,
  newEntityFilter: {kind, id}
});

export const putEntityFilters = (filterList) => ({
  type: PUT_ENTITY_FILTERS,
  filterList,
});

export const unsetEntityFilter = (kind, id) => ({
  type: UNSET_ENTITY_FILTER,
  removedEntityFilter: {kind, id}
});

export const clearEntityFilters = () => ({
  type: CLEAR_ENTITY_FILTERS,
});

export const setAllEntityFilters = () => (dispatch, getState) => {
  const { selectedMapId, maps } = getState().map;
  const selectedMap = maps.find(i => i.id === selectedMapId);
  const { resourceTemplates, hazardTemplates } = selectedMap;
  dispatch(putEntityFilters([
    ...Object.values(resourceTemplates).map(i => ({kind: 'resource', id: i.id})),
    ...Object.values(hazardTemplates).map(i => ({kind: 'hazard', id: i.id}))
  ]));
};


export const setTileMap = (payload) => ({
  type: SET_TILEMAP,
  payload,
});

export const setSelectedMap = (id) => ({
  type: SELECT_MAP,
  id
});

export const selectEntity = (id, entityType) => ({
  type: SELECT_ENTITY,
  id,
  entityType,
});

export const deselectAllEntities = () => ({
  type: DESELECT_ALL,
});

export const setPosition = (lat, lng, zoom) => ({
  type: SET_POSITION,
  lat,
  lng,
  zoom,
});

const setBounds = (swCorner, neCorner) => ({
  type: SET_BOUNDS,
  swCorner,
  neCorner,
});

export const clearBounds = () => ({
  type: CLEAR_BOUNDS,
});

export const setMapTemplates = (resources, hazards) => ({
  type: SET_MAP_TEMPLATES,
  resources,
  hazards,
});

export const getTemplates = (mapId) => (dispatch) => {
  dispatch(pending());
  return getMapTemplatesAPI(mapId)
    .then(response => {
      dispatch(clearStatus());
      return dispatch(setMapTemplates(response.resources.data, response.hazards.data));
    })
    .catch(err => {
      console.error(`Get templates error: ${err}`);
      dispatch(error());
    });
};

export const selectMap = (id) => (dispatch, getState) => {
  const map = getState().map.maps.find((i) => i.id === id);
  const entities = R.flatten(map.map_item_templates
    .map(t => t.map_items.features));

  console.log(entities);

  let lat1, lat2, lng1, lng2;

  for (let entity of entities) {
    const lat = entity.geometry.coordinates[0];
    const lng = entity.geometry.coordinates[1];

    if (lat1 === undefined || lat < lat1) lat1 = lat;
    if (lat2 === undefined || lat > lat2) lat2 = lat;
    if (lng1 === undefined || lng < lng1) lng1 = lng;
    if (lng2 === undefined || lng > lng2) lng2 = lng;
  }

  if (entities.length > 0) {
    dispatch(setBounds([lat1, lng1], [lat2, lng2]));
  }
  return dispatch(setSelectedMap(id));
};

export const getMaps = () => async (dispatch) => {
  dispatch(pending());

  try {
    const response = await getMapsAPI();

    dispatch(clearStatus());
    dispatch(success(response.data));
  } catch(err) {
    dispatch(error(err));
    console.error(`getMaps error: ${err}`);
  }
};

export const createEntity = (newEntity) => (dispatch, getState) => {
  dispatch(pending());
  const { selectedMapId: mapId } = getState().map;
  const createRequest = newEntity.entityType === 'resource' ?
                  createResourceAPI(mapId, newEntity) :
                  createHazardAPI(mapId, newEntity);
  return createRequest
    .then(response => {
      //update entity state
      dispatch(clearStatus());
      dispatch(hideModal());
      dispatch(addEntity(mapId, {...response.data, mapId, entityType: newEntity.entityType, status: 'pristine'}));
    })
    .catch(err => {
      console.error(`Create entity error: ${err}`);
    });
};

export const modifyEntity = updatedEntity => (dispatch, getState) => {
  dispatch(pending());
  const { selectedMapId: mapId } = getState().map;
  const { id:entityId } = updatedEntity.properties;
  const updateRequest = updatedEntity.entityType === 'resource' ?
                        modifyResourceAPI(entityId, updatedEntity) :
                        modifyHazardAPI(entityId, updatedEntity);
  return updateRequest
    .then(response => {
      dispatch(clearStatus());
      dispatch(updateEntity(mapId, {...response.data, entityType: updatedEntity.entityType, status: 'pristine'}));
    })
    .catch(err => {
      dispatch(error());
      console.error(`Modify entity error: ${err}`);
    });
};

export const removeEntity = (mapId, entity) => ({
  type: DELETE_ENTITY,
  mapId,
  entity,
});

export const deleteEntity = (entity) => (dispatch, getState) => {
  dispatch(pending());
  const { selectedMapId: mapId } = getState().map;
  const entityId = entity.properties.id;
  const deleteRequest = entity.entityType === 'resource' ?
                        deleteResourceAPI(entityId) :
                        deleteHazardAPI(entityId);
  return deleteRequest
    .then(() => {
      dispatch(clearStatus());
      dispatch(removeEntity(mapId, entity));
      dispatch(hideModal());
    })
    .catch(err => {
      dispatch(error());
      console.error(`Delete entity error: ${err}`);
    });
};

export function createMap(name, description) {
  return (dispatch) => {
    dispatch(pending());
    return createMapAPI(
      name,
      description,
    ).then((response) => {
      dispatch(hideModal());

      const formattedData = [{
        id: response.data.id,
        name: response.data.name,
        createdByUser: response.data.created_by_id,
        createdAt: response.data.created_at,
        updatedAt: response.data.updated_at,
        description: response.data.description,
        hazardTemplates: response.data.hazard_templates.reduce((acc, val) => ({...acc, [val.id]: val}), {}),
        resourceTemplates: response.data.resource_templates.reduce((acc, val) => ({...acc, [val.id]: val}), {}),
        entities: [
          ...R.map(
            r => ({...r, entityType: 'resource', status: 'pristine'}),
            response.data.resources.features),
          ...R.map(
            r => ({...r, entityType: 'hazard', status: 'pristine'}),
            response.data.hazards.features)
        ],
      }];

      dispatch(clearStatus());

      dispatch(success(formattedData));

      return dispatch(setSelectedMap(response.data.id));
    })
    .catch((err) => {
      if (err.response) {
        const errorMessage = err.response.data.error;
        return dispatch(error(errorMessage));
      }

      return dispatch(error('Unknown Create Disaster Map error'));
    });
  };
}

export function updateMap(name, description) {
  return (dispatch, getState) => {
    dispatch(pending());
    return updateMapAPI(
      getState().map.selectedMapId,
      name,
      description,
    ).then((response) => {
      dispatch(updateMapAction({
        id: response.data.id,
        name: response.data.name,
        createdByUser: response.data.created_by_id,
        createdAt: response.data.created_at,
        updatedAt: response.data.updated_at,
        description: response.data.description,
        hazardTemplates: response.data.hazard_templates.reduce((acc, val) => ({...acc, [val.id]: val}), {}),
        resourceTemplates: response.data.resource_templates.reduce((acc, val) => ({...acc, [val.id]: val}), {}),
        entities: [
          ...R.map(
            r => ({...r, entityType: 'resource', status: 'pristine'}),
            response.data.resources.features),
          ...R.map(
            r => ({...r, entityType: 'hazard', status: 'pristine'}),
            response.data.hazards.features)
        ],
      }));

      dispatch(clearStatus());
      dispatch(hideModal());
    })
    .catch((err) => {
      if (err.response) {
        const errorMessage = err.response.data.error;
        return dispatch(error(errorMessage));
      }

      return dispatch(error('Unknown Update Disaster Map error'));
    });
  };
}

export const removeMap = (id) => ({
  type: DELETE_MAP,
  id,
});

export const deleteMap = (id) => (dispatch) => {
  dispatch(pending());

  return deleteMapAPI(id)
    .then(() => {
      dispatch(clearStatus());
      dispatch(removeMap(id));
    })
    .catch(err => {
      console.error(`Delete Map error: ${err}`);
      dispatch(error());
    });
};


const initialState = {
  pending: false,
  error: false,
  editing: 0,
  tileMaps: [
      {
        name: 'OpenStreetMap',
        url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 20,
      },
      {
        name: 'Humanitarian OpenStreetMap',
        url: 'http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>',
        maxZoom: 20,
      },
      {
        name: 'ESRI World Imagery',
        url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 18,
      },
      {
        name: 'ESRI World Topographic Map',
        url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
        attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community',
        maxZoom: 19,
      }
  ],
  selectedTileMap: 0,
  selectedEntities: {},
  maps: [],
  entityFilter: [],
  hazardTemplates: {},
  resourceTemplates: {},
  selectedMapId: undefined,
  position: {
    center: [48.4284, -123.3656],
    zoom: 13,
  },
  bounds: undefined // either position or bounds should be set
};


export default function reducer (state = initialState, action) {
  let indexOfSelectedMap, currentEntities, indexOfEntity;
  switch(action.type) {
  case SUCCESS:
    return {
      ...state,
      maps: [
        ...state.maps,
        ...action.payload,
      ],
    };

  case SELECT_MAP:
    return {
      ...state,
      selectedMapId: action.id,
    };

  case DELETE_MAP:
    const indexOfMapToDelete = R.findIndex(R.propEq('id', action.id), state.maps);
    const selectedId = state.selectedMapId === action.id ? undefined : state.selectedMapId;

    let maps;
    if (indexOfMapToDelete === state.maps.length - 1) {
      maps = state.maps.slice(0, indexOfMapToDelete);
    } else {
      maps = [
        ...state.maps.slice(0, indexOfMapToDelete),
        ...state.maps.slice(indexOfMapToDelete + 1),
      ];
    }

    return {
      ...state,
      maps,
      selectedMapId: selectedId,
    };

  case UPDATE_MAP:
    const indexOfMapToUpdate = R.findIndex(R.propEq('id', action.map.id), state.maps);

    let updatedMaps;
    if (indexOfMapToUpdate === state.maps.length - 1) {
      updatedMaps = [
        ...state.maps.slice(0, indexOfMapToUpdate),
        action.map,
      ];
    } else {
      updatedMaps = [
        ...state.maps.slice(0, indexOfMapToUpdate),
        action.map,
        ...state.maps.slice(indexOfMapToUpdate + 1),
      ];
    }

    return {
      ...state,
      maps: updatedMaps,
    };

  case ADD_ENTITY:
    return {
      ...state,
      maps: state.maps.map(i => {
        if(i.id === action.entity.mapId){
          return {
            ...i,
            entities: [...i.entities, action.entity]
          };
        }
        return i;
      })
    };

  case UPDATE_ENTITY:
    indexOfSelectedMap = R.findIndex(R.propEq('id', action.mapId), state.maps);
    currentEntities = state.maps[indexOfSelectedMap].entities;
    indexOfEntity = R.findIndex(i => {
        const v = i.properties.id === action.payload.properties.id && i.entityType === action.payload.entityType;
          return v;
      }, currentEntities);

    const newState = {
      ...state,
      maps: [
        ...state.maps.slice(0, indexOfSelectedMap),
        {
          ...state.maps[indexOfSelectedMap],
          entities: [
            ...currentEntities.slice(0, indexOfEntity),
            action.payload,
            ...currentEntities.slice(indexOfEntity+1)
          ]
        },
        ...state.maps.slice(indexOfSelectedMap+1),
      ],
    };
    return newState;

  case DELETE_ENTITY:
    indexOfSelectedMap = R.findIndex(R.propEq('id', action.mapId), state.maps);
    currentEntities = state.maps[indexOfSelectedMap].entities;
    indexOfEntity = R.findIndex(i => {
        const v = i.properties.id === action.entity.properties.id && i.entityType === action.entity.entityType;
          return v;
      }, currentEntities);

    return {
      ...state,
      maps: [
        ...state.maps.slice(0, indexOfSelectedMap),
        {
          ...state.maps[indexOfSelectedMap],
          entities: [
            ...currentEntities.slice(0, indexOfEntity),
            ...currentEntities.slice(indexOfEntity+1),
          ],
        },
        ...state.maps.slice(indexOfSelectedMap+1),
      ],
    };

  case SET_TILEMAP:
    const value = clamp(action.payload, 0, state.tileMaps.length -1);
    return {
      ...state,
      selectedTileMap: value,
    };

  case SELECT_ENTITY:
    return {
      ...state,
      selectedEntities: {id: action.id, type: action.entityType},
    };

  case DESELECT_ALL:
    return {
      ...state,
      selectedEntities: [],
    };

  case SET_ENTITY_FILTER:
    return {
      ...state,
      entityFilter: R.union(
        state.entityFilter,
        [action.newEntityFilter],
      ),
    };

  case PUT_ENTITY_FILTERS:
    return {
      ...state,
      entityFilter: action.filterList,
    };

  case UNSET_ENTITY_FILTER:
    return {
      ...state,
      entityFilter: R.without([action.removedEntityFilter], state.entityFilter),
    };

  case CLEAR_ENTITY_FILTERS:
    return {
      ...state,
      entityFilter: []
    };

  case SET_POSITION:
    return {
      ...state,
      position: {
        center: [action.lat, action.lng],
        zoom: action.zoom
      },
      bounds: undefined,
    };

  case SET_BOUNDS:
    return {
      ...state,
      position: undefined,
      bounds: [
          action.swCorner,
          action.neCorner,
        ]
    };

  case CLEAR_BOUNDS:
    return {
      ...state,
      bounds: undefined,
    };

  case SET_MAP_TEMPLATES:
    return {
      ...state,
      hazardTemplates: action.hazards.reduce((acc, val) => ({...acc, [val.id]: val}), {}),
      resourceTemplates: action.resources.reduce((acc, val) => ({...acc, [val.id]: val}), {}),
    };

  case CLEAR_STATUS:
    return {
      ...state,
      pending: false,
      error: false,
    };

  case PENDING:
    return {
      ...state,
      pending: true,
      error: false,
    };
  case ERROR:
    return {
      ...state,
      pending: false,
      error: true,
    };
  default:
    return state;
  }
}
