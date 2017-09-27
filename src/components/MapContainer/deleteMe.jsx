import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './MapContainer.css';
import '../../../node_modules/leaflet-draw/dist/leaflet.draw.css';
import L from 'leaflet';
import { Map, TileLayer, ZoomControl, AttributionControl } from 'react-leaflet';
import R from 'ramda';

import {
  getMaps,
  getTemplates,
  modifyEntity,
  createEntity,
  deleteEntity,
  deselectAllEntities,
  selectEntity,
  clearBounds } from '../../redux/modules/map';
import { showInfo as showInfoDrawer } from '../../redux/modules/drawer';

import {
  showUpdateEntity as showUpdateEntityModal
} from '../../redux/modules/modal';

import EditableLayer from './EditableLayer';

class MapContainer extends Component {
  onMapClick() {
    this.props.deselectAllEntities();
  }

  componentWillMount() {
    this.props.getMaps();
  }

  componentDidMount() {
    const leafletMap = this.leafletMap.leafletElement;
    this.map = leafletMap;
    leafletMap.on('click', (e) => this.onMapClick(e));

    window.L = L;
    window.map = this.leafletMap.leafletElement;
    this.forceUpdate();
  }

  componentWillUnmount() {
    const leafletMap = this.leafletMap.leafletElement;
    leafletMap.off('click', this.onMapClick);
  }

  componentDidUpdate(prevProps) {
    if(prevProps.tileMap.attribution !== this.props.tileMap.attribution){
      this.leafletAttrib.leafletElement
          .removeAttribution(prevProps.tileMap.attribution);
      this.leafletAttrib.leafletElement
          .addAttribution(this.props.tileMap.attribution);
    }
    this.leafletMap.leafletElement.setMaxZoom(this.props.tileMap.maxZoom);
  }

  onClickMarker(id, type) {
    return () => {
      this.props.selectEntity(id, type);
      this.props.showInfoDrawer();
    };
  }

  render() {
    const {
      maps,
      selectedMapId,
      tileMap,
      entityFilter
    } = this.props;
    const map = maps.find(map => map.id === selectedMapId);

    let entities = [];
    if (map) {
      const { hazardTemplates, resourceTemplates } = map;
      entities = map.entities.map(i => {
        switch(i.entityType) {
          case 'hazard':
            return {...i, template: hazardTemplates[i.properties.template_id]};
          case 'resource':
            return {...i, template: resourceTemplates[i.properties.template_id]};
        }
      });
      if(entityFilter.length > 0){
        entities = entities.filter(i => {
          const template = {kind: i.entityType, id: i.properties.template_id};
          const val = R.contains(template, entityFilter);
          return !val;
        });
      }
    }

    return (
      <div className="Map-container">
        <Map
          viewport={this.props.position}
          bounds={this.props.bounds}
          animate
          useFlyTo
          ref={m => this.leafletMap = m}
          id="map"

          onViewportChanged={this.props.clearBounds}

          zoomControl={false}
          maxZoom={tileMap.maxZoom}
          attributionControl={false}
        >
          <AttributionControl ref={m => this.leafletAttrib = m} />
          <ZoomControl position="bottomright" />
          <TileLayer
            url={tileMap.url}
            attribution={tileMap.attribution}
          />
          <EditableLayer
            map={this.map}
            entities={entities}
            onUpdate={this.props.updateEntity}
            onCreate={this.props.createEntity}
            onDelete={this.props.deleteEntity}
            showUpdateModal={this.props.showUpdateEntityModal}
            onClickMarker={(id, type) => this.onClickMarker(id, type)}
          />
        </Map>
      </div>
    );
  }
}

MapContainer.propTypes = {
  position: PropTypes.object,
  bounds: PropTypes.array,
  maps: PropTypes.array,
  selectedMapId: PropTypes.number,
  tileMap: PropTypes.object,
  getMaps: PropTypes.func,
  updateEntity: PropTypes.func,
  createEntity: PropTypes.func,
  deleteEntity: PropTypes.func,
  deselectAllEntities: PropTypes.func,
  selectEntity: PropTypes.func,
  showInfoDrawer: PropTypes.func,
  showUpdateEntityModal: PropTypes.func,
  entityFilter: PropTypes.array,
  clearBounds: PropTypes.func,
};

const mapStateToProps = (state) => {
  return {
    maps: state.map.maps,
    selectedMapId: state.map.selectedMapId,
    tileMap: state.map.tileMaps[state.map.selectedTileMap],
    position: state.map.position,
    bounds: state.map.bounds,
    entityFilter: state.map.entityFilter,
  };
};

const mapDispatchToProps = (dispatch) => ({
  getMaps: () => dispatch(getMaps()),
  getMapTemplates: (mapId) => dispatch(getTemplates(mapId)),
  updateEntity: (entity) => dispatch(modifyEntity(entity)),
  createEntity: (payload) => dispatch(createEntity(payload)),
  deleteEntity: (entity) => dispatch(deleteEntity(entity)),
  deselectAllEntities: () => dispatch(deselectAllEntities()),
  selectEntity: (id, type) => dispatch(selectEntity(id, type)),
  showInfoDrawer: () => dispatch(showInfoDrawer()),
  showUpdateEntityModal: (entity) => dispatch(showUpdateEntityModal(entity)),
  clearBounds: () => dispatch(clearBounds()),
});

export default connect(mapStateToProps, mapDispatchToProps)(MapContainer);
