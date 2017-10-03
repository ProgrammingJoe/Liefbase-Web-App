import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { hideDrawer } from '../../redux/ui/drawer';
import MapDrawer from  './MapDrawer';

const DrawerManager = props => {
  const Drawers = {
    MAP: <MapDrawer title="Map Settings" {...props} />,
  };
  return Drawers[props.type] || null;
};

DrawerManager.propTypes = {
  type: PropTypes.oneOf(['MAP', null]),
};

const mapStateToProps = state => ({
  type: state.ui.drawer.drawerType,
});

const mapDispatchToProps = dispatch => ({
  hideDrawer: () => dispatch(hideDrawer()),
});

export default connect(mapStateToProps, mapDispatchToProps)(DrawerManager);
