import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

import css from './DrawerWrapper.css';

const getDrawerTitle = (drawerType) => {
  switch (drawerType) {
    case 'MAP': return 'Map Options';
    default: return '';
  }
};

const DrawerWrapper = props => {
  return (
    <div className={css.drawerContainer}>
      <h3 className={css.title}>{ getDrawerTitle(props.type) }</h3>
      <Icon className={css.closeButton} name="close" size="big" onClick={ props.hideDrawer } />
      { props.children }
    </div>
  );
};

DrawerWrapper.propTypes = {
  type: PropTypes.string,
  children: PropTypes.element,
  hideDrawer: PropTypes.func.isRequired,
};

export default DrawerWrapper;
