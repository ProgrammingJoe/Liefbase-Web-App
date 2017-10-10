import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { LayersControl, LayerGroup } from 'react-leaflet';

import actions from '../../../redux/entities/actionCreators';
import { showUpdateMapItem } from '../../../redux/ui/modal';

import MapItem from '../MapItem';

const mapDispatchToProps = dispatch => ({
  updateMapItem: values => dispatch(actions.mapItem.update({ values })),
  destroyMapItem: values => dispatch(actions.mapItem.destroy({ values })),
  showUpdateMapItem: values => dispatch(showUpdateMapItem(values)),
});

@connect(null, mapDispatchToProps)
export default class TemplateLayer extends Component {
  static propTypes = {
    // external
    template: PropTypes.object,

    // mapDispatchToProps
    updateMapItem: PropTypes.func,
    destroyMapItem: PropTypes.func,
    showUpdateMapItem: PropTypes.func,
  };

  render() {
    const { template, ...passThrough } = this.props;

    return (
      <LayersControl.Overlay
        {...passThrough}
        name={template.name}
        checked
      >
        <LayerGroup>
          { template.mapItems.map(feature => <MapItem key={feature.id} feature={feature} />) }
        </LayerGroup>
      </LayersControl.Overlay>
    );
  }
}
