import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Map, TileLayer, ZoomControl, AttributionControl } from 'react-leaflet';

import MapContainer from './MapContainer'

import css from './MapContainer.css';

const mapStateToProps = state => {
  const id = state.ui.map.selectedMapId;
  const map = state.entities.reliefMap[id];

  return { map };
};

@connect(mapStateToProps)
export default class Container extends Component {
  static propTypes = {
    map: PropTypes.object,
  };

  renderPlaceHolder = () =>
    <div className={css.placeHolderContainer}>
      <p>No map selected</p>
    </div>

  render() {
    const { map } = this.props;

    return (
      <div className={css.mapContainer}>
        { map ? <MapContainer /> : this.renderPlaceHolder() }
      </div>
    );
  }
}
