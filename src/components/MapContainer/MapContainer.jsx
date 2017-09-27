import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Map, TileLayer, ZoomControl, AttributionControl } from 'react-leaflet';

import css from './MapContainer.css';

const mapStateToProps = state => {
  const id = state.ui.map.selectedMapId;
  const map = state.entities.reliefMap[id];

  // todo: do these in redux state
  const tileMap = {
    name: 'OpenStreetMap',
    url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 20,
  };
  const position = {
    center: [48.4284, -123.3656],
    zoom: 13,
  };
  const bounds = undefined;
  // either position or bounds should be set
  const clearBounds = () => console.log('clearBounds');

  return {
    map,
    tileMap,
    bounds,
    position,
    clearBounds,
  };
};

@connect(mapStateToProps)
export default class MapContainer extends Component {
  static propTypes = {
    map: PropTypes.object,
    tileMap: PropTypes.object,
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

  componentDidUpdate(prevProps) {
    if(prevProps.tileMap.attribution !== this.props.tileMap.attribution){
      this.leafletAttrib.leafletElement
          .removeAttribution(prevProps.tileMap.attribution);
      this.leafletAttrib.leafletElement
          .addAttribution(this.props.tileMap.attribution);
    }
    this.leafletMap.leafletElement.setMaxZoom(this.props.tileMap.maxZoom);
  }

  render() {
    const { map, tileMap, position, bounds, clearBounds } = this.props;

    return (
      <Map
        viewport={position}
        bounds={bounds}
        animate
        useFlyTo
        ref={m => this.leafletMap = m}
        id="mainReliefMap"

        onViewportChanged={clearBounds}

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
      </Map>
    );
  }
}
