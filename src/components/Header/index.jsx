import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { showSignIn, showRegister, showCreateMap } from '../../redux/ui/modal';
import { showMap, hideDrawer } from '../../redux/ui/drawer';
import {
  signOut,
  refresh as refreshSession
} from '../../redux/authorization';

import { Button, Dropdown, Icon } from 'semantic-ui-react';
import HeaderButton from './HeaderButton';

import css from './index.css';

const text = {
  liefbase: 'liefbase',
  signIn: 'Log In',
  signOut: 'Log out',
  register: 'Sign up',
  createMap: 'New Map',
};

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
  onClickCreateMap: () => dispatch(showCreateMap()),
  onClickSignOut: () => dispatch(signOut()),
  openMapDrawer: () => dispatch(showMap()),
  hideDrawer: () => dispatch(hideDrawer()),
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
    onClickCreateMap: PropTypes.func,

    // Drawers
    drawer: PropTypes.string,
    hideDrawer: PropTypes.func,
    openMapDrawer: PropTypes.func,

    refreshSession: PropTypes.func,
  };

  componentWillMount() {
    this.props.refreshSession();
  }

  renderLoggedIn = () =>
    <div className={css.headerSection}>
      <h4 className={css.email}>{ `Welcome ${this.props.currentUser.firstName}!`}</h4>
      <Button
        onClick={() => this.props.onClickCreateMap()}
        color="blue"
      ><Icon name="add" />{text.createMap}</Button>
      <div className={css.dropdownContainer}>
        <Dropdown pointing="top right" icon={<Icon name="sidebar" size="big" />}>
          <Dropdown.Menu>
            <Dropdown.Item text='Settings' />
            <Dropdown.Divider />
            <Dropdown.Item text='Sign Out' onClick={this.props.onClickSignOut} />
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>

  renderLoggedOut = () =>
    <div>
      <Button onClick={() => this.props.onClickSignIn()}>
        { text.signIn }
      </Button>
      <Button onClick={() => this.props.onClickRegister()} color="blue">
        { text.register }
      </Button>
    </div>

  render = () =>
    <div className={css.header}>
      <div className={css.headerSection}>
        <HeaderButton
          icon="map outline"
          onClick={() => this.props.drawer === 'MAP' ? this.props.hideDrawer() : this.props.openMapDrawer()}
        />
        <h1 style={{margin: '15px'}}>{ text.liefbase }</h1>
      </div>
      { this.props.currentMap && <h3 style={{ margin: '0' }}>{this.props.currentMap.name}</h3> }
      { this.props.currentUser ? this.renderLoggedIn() : this.renderLoggedOut() }
    </div>
}
