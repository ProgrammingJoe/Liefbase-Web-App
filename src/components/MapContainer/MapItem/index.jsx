import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Marker } from 'react-leaflet';

import actions from '../../../redux/entities/actionCreators';
import { showUpdateMapItem } from '../../../redux/ui/modal';

import Popup from '../PopupContent';

const mapDispatchToProps = dispatch => ({
  destroyMapItem: values => dispatch(actions.mapItem.destroy({ values })),
  showUpdateMapItem: values => dispatch(showUpdateMapItem(values)),
  updateMapItem: values => dispatch(actions.mapItem.update({ values })),
});

@connect(null, mapDispatchToProps)
export default class MapItem extends Component {
  static propTypes = {
    // external
    feature: PropTypes.object,

    // mapDispatchToProps
    updateMapItem: PropTypes.func,
    destroyMapItem: PropTypes.func,
    showUpdateMapItem: PropTypes.func,
  };

  handleDragEnd = async e => {
    const id = this.props.feature.id;
    const { lat, lng } = e.target.getLatLng();

    const values = {
      id,
      // added for proper drf geojson serialization
      properties: {},
      geometry: {
        type: "Point",
        coordinates: [lat, lng],
      },
    };

    try {
      await this.props.updateMapItem(values);
    } catch(err) {
      const oldGeometry = this.props.feature.geometry.coordinates;
      e.target.setLatLng(oldGeometry);

      // todo: alert user of error updating marker
    }
  }

  handleMouseover = e => {
    e.target.openPopup();
  }

  render() {
    const { feature } = this.props;

    return (
      <Marker
        position={feature.geometry.coordinates}
        onDragend={this.handleDragEnd}
        onMouseover={this.handleMouseover}
        draggable
      >
        <Popup {...this.props} />
      </Marker>
    );
  }
}
