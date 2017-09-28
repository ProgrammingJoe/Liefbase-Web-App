import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { denormalize } from 'normalizr';

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Map,
  LayersControl,
  ZoomControl,
  TileLayer,
  GeoJSON,
} from 'react-leaflet';

import schemas from '../../schema';

const mapStateToProps = state => {
  const id = state.ui.map.selectedMapId;
  const map = state.entities.reliefMap[id];

  // todo: put this in reselect eventually..
  const templates = denormalize(map.mapItemTemplates, [schemas.mapItemTemplate], state.entities);

  // todo: do these in redux state
  const position = {
    center: [48.4284, -123.3656],
    zoom: 13,
  };
  const bounds = undefined;
  // either position or bounds should be set
  const clearBounds = () => console.log('clearBounds');

  return {
    templates,
    bounds,
    position,
    clearBounds,
  };
};

@connect(mapStateToProps)
export default class MapContainer extends Component {
  static propTypes = {
    templates: PropTypes.array,

    position: PropTypes.object,
    bounds: PropTypes.array,

    clearBounds: PropTypes.func,
  };

  componentDidMount() {
    window.L = L;
    window.map = this.leafletMap.leafletElement;
    this.forceUpdate();
  }

  componentWillUnmount() {
    const leafletMap = this.leafletMap.leafletElement;
    leafletMap.off('click', this.onMapClick);
  }

  render() {
    const { templates, tileMap, position, bounds, clearBounds } = this.props;

    return (
      <Map
        viewport={position}
        bounds={bounds}
        animate
        useFlyTo
        ref={m => this.leafletMap = m}
        style={{ width: '100%' }}

        onViewportChanged={clearBounds}

        zoomControl={false}
        attributionControl={false}
      >
        <ZoomControl position="bottomright" />

        <LayersControl position='topright'>
          <LayersControl.BaseLayer name='OpenStreetMap' checked>
            <TileLayer
              url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name='OpenStreetMap.BlackAndWhite'>
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url='http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png'
            />
          </LayersControl.BaseLayer>
          { templates.map(template =>
            <LayersControl.Overlay name={template.name} checked>
              <GeoJSON data={template.mapItems} />
            </LayersControl.Overlay>) }
        </LayersControl>
      </Map>
    );
  }
}
