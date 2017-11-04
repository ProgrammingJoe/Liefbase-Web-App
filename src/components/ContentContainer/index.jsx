import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Sidebar, Segment } from 'semantic-ui-react';

import { drawerTypes } from '../../redux/ui/drawer';

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

    const content = {
      maps: <MapDrawer />,
      organizations: <div>ORGANIZATION CONTENT</div>,
      teams: <div>TEAMS CONTENT</div>,
      settings: <div>SETTINGS CONTENT</div>,
    };

    return (
      <div className={css.contentContainer}>
        <Sidebar.Pushable as={Segment} style={segmentStyle}>
          {
            drawerTypes.map(d =>
              <Sidebar
                key={d}
                animation='overlay'
                visible={activeDrawer === d}
                className={css.sidebar}
              >
                {content[d]}
              </Sidebar>
            )
          }
          <Sidebar.Pusher>
            <div className={css.mapContent}>
              <MapContainer />
            </div>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>);
  }
}
