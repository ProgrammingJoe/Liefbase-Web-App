import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';


const styles = {
  container: {
    position: 'fixed',
    height: '100%',
    width: '15rem',
    backgroundColor: 'white',
    zIndex: '5000',
    paddingTop: '2.75rem',
    marginTop: '10px'
  },
  title: {
    fontSize: 15,
  },
  closeButton: {
    cursor: 'pointer',
    float: 'right',
    marginTop: '-17px',
  },
};

const getDrawerTitle = (drawerType) => {
  switch (drawerType) {
    case 'SEARCH': return 'Select Map';
    case 'MAP': return 'Map Options';
    case 'INFO': return 'Entity Information';
    default: return '';
  }
};

const DrawerWrapper = props => {
  return (
    <div style={ styles.container }>
      <div>
        <div style={ styles.title }>{ getDrawerTitle(props.type) }</div>
        <Icon
          name="close"
          size="big"
          style={ styles.closeButton }
          onClick={ props.hideDrawer }
        />
      </div>
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
