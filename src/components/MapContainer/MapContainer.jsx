import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { denormalize } from 'normalizr';

import {
  Map,
  LayersControl,
  ScaleControl,
  ZoomControl,
  FeatureGroup,
  TileLayer,
} from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

import { showCreateMapItem } from '../../redux/ui/modal';

import TemplateLayer from './TemplateLayer';

import schemas from '../../schema';

const mapStateToProps = state => {
  const id = state.ui.map.selectedMapId;
  const map = state.entities.reliefMap[id];

  // todo: put this in reselect eventually..
  const templates = denormalize(map.mapItemTemplates, [schemas.mapItemTemplate], state.entities);

  // todo: do this in redux state based on map entities, default to victoria bounds.
  const bounds = [
    [40.712, -74.227],
    [40.774, -74.125],
  ];

  return {
    templates,
    bounds,
  };
};

const mapDispatchToProps = dispatch => ({
  showCreateMapItem: values => dispatch(showCreateMapItem(values)),
});

@connect(mapStateToProps, mapDispatchToProps)
export default class MapContainer extends Component {
  static propTypes = {
    // mapStateToProps
    templates: PropTypes.array,
    bounds: PropTypes.array,

    // mapDispatchToProps
    showCreateMapItem: PropTypes.func,
  };

  handleCreate = e => {
    this.props.showCreateMapItem(e.layer.getLatLng());
    e.layer.remove();
  }

  render() {
    const { templates, bounds } = this.props;

    return (
      <Map
        bounds={bounds}
        animate
        useFlyTo
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <ScaleControl position="bottomright" />
        <ZoomControl position="bottomright" />
        <LayersControl position='topright'>
          <LayersControl.BaseLayer name='OpenStreetMap' checked>
            <TileLayer
              url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name='Humanitarian OpenStreetMap'>
            <TileLayer
              url='http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
              attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name='ESRI World Imagery'>
            <TileLayer
              url='http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
              attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name='ESRI World Topographic Map'>
            <TileLayer
              url='http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
              attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
            />
          </LayersControl.BaseLayer>
          { templates.map(template => <TemplateLayer key={template.id} template={template} />) }
        </LayersControl>
        {/* todo: only display this if member or admin of map */}
        <FeatureGroup>
          <EditControl
            position='topright'
            onCreated={this.handleCreate}
            draw={{
              circle: false,
              circlemarker: false,
              polygon: false,
              polyline: false,
              rectangle: false,
            }}
            edit={{
              edit: false,
              remove: false,
            }}
          />
        </FeatureGroup>
      </Map>
    );
  }
}
