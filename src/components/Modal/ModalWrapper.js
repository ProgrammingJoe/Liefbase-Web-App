import React from 'react';
import PropTypes from 'prop-types';
import './ModalWrapper.css';

const styles = {
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
      <div className="modal-background" onClick={onClickBackground}> </div>
        <div className="modal" style={props.style}>
          { props.title && <h3 style={styles.title}>{ props.title }</h3> }
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
