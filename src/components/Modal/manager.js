import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { hideModal } from '../../redux/modules/modal';
import { createMap, updateMap } from '../../redux/modules/map';

import SignInModal from './SignInModal';
import RegisterModal from './RegisterModal';
import ReliefMapModal from './ReliefMapModal';
import UpdateEntityModal from './UpdateEntityModal';

const ModalManager = props => {
  switch(props.modalType){
  case 'SIGN_IN':
    return <SignInModal title="Sign In" {...props} />;

  case 'REGISTER':
    return <RegisterModal title="Register" {...props} />;

  case 'CREATE_MAP':
    return <ReliefMapModal 
            title="Create Map"
            handleSubmit={props.createMap}
            {...props} />;

  case 'EDIT_MAP_DETAILS':
    return <ReliefMapModal 
            title="Update Map Details"
            handleSubmit={props.updateMap}
            name={props.selectedMap.name}
            description={props.selectedMap.description}
            {...props} />;

  case 'UPDATE_ENTITY':
    return <UpdateEntityModal title="Update Details" {...props} />;

  default:
    return null;
  }
};

ModalManager.propTypes = {
  modalType: PropTypes.string,
  createMap: PropTypes.func,
  updateMap: PropTypes.func,
  selectedMap: PropTypes.object,
};

const mapStateToProps = state => {
  const selectedMap = state.map.maps.find((m) => m.id === state.map.selectedMapId);
  
  return {
    modalType: state.modal.modalType,
    selectedMap
  };
};

const mapDispatchToProps = dispatch => ({
  hideModal: () => dispatch(hideModal()),
  createMap: (name, description) => dispatch(createMap(name, description)),
  updateMap: (name, description) => dispatch(updateMap(name, description)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalManager);
