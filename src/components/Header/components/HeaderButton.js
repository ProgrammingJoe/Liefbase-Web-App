import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

const styles = {
  container: {
    cursor: 'pointer',
    backgroundColor: '#EEE',
    height: '100%',
    width: '3rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

const HeaderButton = props => (
  <div style={styles.container} onClick={props.onClick}>
    <Icon name={props.icon} size="big" />
  </div>
);

HeaderButton.propTypes = {
  icon: PropTypes.string,
  selected: PropTypes.bool,
  onClick: PropTypes.func,
};

export default HeaderButton;
