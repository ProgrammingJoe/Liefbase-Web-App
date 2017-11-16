import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { showDrawer } from '../../redux/ui/drawer';

import MapContainer from './MapContainer';
import styles from './index.scss';

const mapStateToProps = state => {
  const id = state.ui.map.selectedMapId;
  const map = state.entities.reliefMap[id];

  return { map };
};

const mapDispatchToProps = dispatch => ({
  showMapsDrawer: () => dispatch(showDrawer('maps')),
});

@connect(mapStateToProps, mapDispatchToProps)
export default class Container extends Component {
  static propTypes = {
    // mapStateToProps
    map: PropTypes.object,

    // mapDispatchToProps
    showMapsDrawer: PropTypes.func,
  };

  renderPlaceHolder = () =>
    <div className={styles.placeHolderContainer}>
      <div>
        <p>No map selected</p>
        <a
          className={styles.clickable}
          onClick={this.props.showMapsDrawer}
        >
          Create 🗺 ?
        </a>
      </div>
    </div>

  render() {
    const { map } = this.props;

    return (
      <div className={styles.mapContainer}>
        { map ? <MapContainer /> : this.renderPlaceHolder() }
      </div>
    );
  }
}
