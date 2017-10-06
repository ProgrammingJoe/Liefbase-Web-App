import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { showSignIn, showRegister } from '../../redux/ui/modal';
import {
  signOut,
  refresh as refreshSession
} from '../../redux/authorization';

import { Menu } from 'semantic-ui-react';

const mapStateToProps = state => {
  const userId = state.authorization.currentUserId;
  const currentUser = state.entities.user[userId];

  const mapId = state.ui.map.selectedMapId;
  const currentMap = state.entities.reliefMap[mapId];

  return {
    currentUser,
    currentMap,
    modal: state.ui.modal,
    drawer: state.ui.drawer.drawerType,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onClickSignIn: () => dispatch(showSignIn()),
  onClickRegister: () => dispatch(showRegister()),
  onClickSignOut: () => dispatch(signOut()),
  refreshSession: () => dispatch(refreshSession()),
});

@connect(mapStateToProps, mapDispatchToProps)
export default class Header extends Component {
  static propTypes = {
    currentUser: PropTypes.shape({
      firstName: PropTypes.string,
      email: PropTypes.string,
    }),
    currentMap: PropTypes.object,

    // Buttons
    onClickSignIn: PropTypes.func,
    onClickRegister: PropTypes.func,
    onClickSignOut: PropTypes.func,
    refreshSession: PropTypes.func,
  };

  componentWillMount() {
    this.props.refreshSession();
  }

  renderLoggedIn = () =>
    <Menu style={{ margin: 0 }}>
      <Menu.Menu position='right'>
        <Menu.Item onClick={this.props.onClickSignIn}>
         Log Out
        </Menu.Item>
      </Menu.Menu>
    </Menu>;

  renderLoggedOut = () =>
    <Menu style={{ margin: 0 }}>
      <Menu.Menu position='right'>
        <Menu.Item onClick={this.props.onClickSignIn}>
         Log In
        </Menu.Item>
        <Menu.Item onClick={this.props.onClickRegister}>
         Register
        </Menu.Item>
      </Menu.Menu>
    </Menu>;

  render = () => this.props.currentUser ? this.renderLoggedIn() : this.renderLoggedOut();
}
