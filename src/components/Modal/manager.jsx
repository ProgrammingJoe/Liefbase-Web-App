import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { hideModal } from '../../redux/ui/modal';

import SignInModal from './SignInModal';
import RegisterModal from './RegisterModal';
import ReliefMapModal from './ReliefMapModal';
import UpdateEntityModal from './UpdateEntityModal';

const mapStateToProps = state => ({
  modalType: state.ui.modal.modalType,
});

const mapDispatchToProps = dispatch => ({
  hideModal: () => dispatch(hideModal()),
});

@connect(mapStateToProps, mapDispatchToProps)
export default class ModalManager extends Component {
  static propTypes = {
    modalType: PropTypes.string,
  };

  render = () => {
    switch(this.props.modalType){
    case 'SIGN_IN':
      return <SignInModal title="Sign In" {...this.props} />;

    case 'REGISTER':
      return <RegisterModal title="Register" {...this.props} />;

    case 'CREATE_MAP':
      return <ReliefMapModal title="Create Map" {...this.props} />;

    case 'UPDATE_MAP':
      return <ReliefMapModal title="Update Map" {...this.props} />;

    case 'UPDATE_ENTITY':
      return <UpdateEntityModal title="Update Details" {...this.props} />;
    }

    return null;
  }
}
