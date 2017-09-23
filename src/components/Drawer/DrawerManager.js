import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { hideDrawer } from '../../redux/modules/drawer';
import SearchDrawer from './SearchDrawer';
import MapDrawer from  './MapDrawer';
import InformationDrawer from './InformationDrawer';

const DrawerManager = props => {
  const Drawers = {
    SEARCH: <SearchDrawer title="Search" {...props} />,
    MAP: <MapDrawer title="Map Settings" {...props} />,
    INFO: <InformationDrawer title="Details" {...props} />,
  };
  return Drawers[props.type] || null;
};

DrawerManager.propTypes = {
  type: PropTypes.oneOf(['SEARCH', 'MAP', 'INFO', null]),
};

const mapStateToProps = state => ({
  type: state.drawer.drawerType,
});

const mapDispatchToProps = dispatch => ({
  hideDrawer: () => dispatch(hideDrawer()),
});

export default connect(mapStateToProps, mapDispatchToProps)(DrawerManager);
