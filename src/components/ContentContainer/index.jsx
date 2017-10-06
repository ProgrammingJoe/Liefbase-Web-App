import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Sidebar, Segment } from 'semantic-ui-react';

import MapDrawer from '../Drawer/MapDrawer';
import MapContainer from '../MapContainer';
import css from './index.css';

// Use style prop to override semantic css.
const segmentStyle = {
  margin: 0,
  borderRadius: 0,
};

const mapStateToProps = state => ({
  activeDrawer: state.ui.drawer.activeDrawer,
});

@connect(mapStateToProps)
export default class ContentContainer extends Component {
  static propTypes = {
    activeDrawer: PropTypes.string,
  }
  render() {
    const { activeDrawer } = this.props;

    return (
      <div className={css.contentContainer}>
        <Sidebar.Pushable as={Segment} style={segmentStyle}>
          <Sidebar
            animation='slide along'
            visible={activeDrawer === 'maps'}
            className={css.sidebar}
          >
            <MapDrawer />
          </Sidebar>
          <Sidebar
            animation='slide along'
            visible={activeDrawer === 'organizations'}
            className={css.sidebar}
          >
            <div>ORGANIZATION CONTENT</div>
          </Sidebar>
          <Sidebar
            animation='slide along'
            visible={activeDrawer === 'settings'}
            className={css.sidebar}
          >
            <div>SETTINGS CONTENT</div>
          </Sidebar>
          <Sidebar.Pusher>
            <div className={css.mapContent}>
              <MapContainer />
            </div>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>);
  }
}
