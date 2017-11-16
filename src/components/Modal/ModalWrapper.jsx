import React from 'react';
import PropTypes from 'prop-types';
import styles from './ModalWrapper.scss';

const JSstyles = {
  title: {
    marginTop: '0px',
  }
};

const ModalWrapper = props => {
  const onClickBackground = e => {
    if(e.target === e.currentTarget) props.hideModal();
  };

  return (
    <div>
      <div className={styles.modalBackground} onClick={onClickBackground} />
      <div className={styles.modal} style={props.style}>
        { props.title && <h3 style={JSstyles.title}>{ props.title }</h3> }
        {props.children}
      </div>
    </div>
  );
};

ModalWrapper.propTypes = {
  hideModal: PropTypes.func,
  style: PropTypes.object,
  title: PropTypes.string,
  children: PropTypes.element,
};

export default ModalWrapper;
