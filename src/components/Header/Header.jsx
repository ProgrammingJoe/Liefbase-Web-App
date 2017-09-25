import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { showSignIn, showRegister, showCreateMap } from '../../redux/ui/modal';
import { showMap, showSearch, showInfo, hideDrawer } from '../../redux/ui/drawer';
import {
  signOut,
  refresh as refreshSession
} from '../../redux/authorization';

import { Button, Dropdown, Icon } from 'semantic-ui-react';
import HeaderButton from './HeaderButton';

import css from './Header.css';

const text = {
  liefbase: 'liefbase',
  signIn: 'Log In',
  signOut: 'Log out',
  register: 'Sign up',
  createMap: 'Create Map',
};

const mapStateToProps = (state) => {
  const id = state.authorization.currentUserId;

  return {
    user: state.entities.users[id],
    modal: state.ui.modal,
    drawer: state.ui.drawer.drawerType,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onClickSignIn: () => dispatch(showSignIn()),
  onClickRegister: () => dispatch(showRegister()),
  onClickCreateMap: () => dispatch(showCreateMap()),
  onClickSignOut: () => dispatch(signOut()),
  openMapSettingsDrawer: () => dispatch(showMap()),
  openSearchDrawer: () => dispatch(showSearch()),
  openInfoDrawer: () => dispatch(showInfo()),
  hideDrawer: () => dispatch(hideDrawer()),
  refreshSession: () => dispatch(refreshSession()),
});

@connect(mapStateToProps, mapDispatchToProps)
export default class Header extends Component {
  static propTypes = {
    user: PropTypes.shape({
      firstName: PropTypes.string,
      email: PropTypes.string,
    }),

    // Buttons
    onClickSignIn: PropTypes.func,
    onClickRegister: PropTypes.func,
    onClickSignOut: PropTypes.func,
    onClickCreateMap: PropTypes.func,

    // Drawers
    drawer: PropTypes.string,
    hideDrawer: PropTypes.func,
    openInfoDrawer: PropTypes.func,
    openMapSettingsDrawer: PropTypes.func,
    openSearchDrawer: PropTypes.func,

    refreshSession: PropTypes.func,
  };

  componentWillMount() {
    this.props.refreshSession();
  }

  renderLoggedIn = () =>
    <div className={css.buttons}>
      <h4 className={css.email}>{ `Welcome ${this.props.user.firstName}!`}</h4>
      <Button
        onClick={() => this.props.onClickCreateMap()}
        color="blue"
      >{text.createMap}</Button>
      <Dropdown floating icon={<Icon name="sidebar" size="big" />} >
        <Dropdown.Menu>
          <Dropdown.Item text={ 'preferences' } />
          <Dropdown.Item text={ 'about' } />
          <Dropdown.Item text={ text.signOut } onClick={this.props.onClickSignOut} />
        </Dropdown.Menu>
      </Dropdown>
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
      <div className={css.drawerSelectors}>
        <HeaderButton
          icon="search"
          onClick={() => this.props.drawer === 'SEARCH' ? this.props.hideDrawer() : this.props.openSearchDrawer()}
        />
        <HeaderButton
          icon="map outline"
          onClick={() => this.props.drawer === 'MAP' ? this.props.hideDrawer() : this.props.openMapSettingsDrawer()}
        />
        <HeaderButton
          icon="info circle"
          onClick={() => this.props.drawer === 'INFO' ? this.props.hideDrawer() : this.props.openInfoDrawer()}
        />
        <h1 style={{margin: '15px'}}>{ text.liefbase }</h1>
      </div>
      { this.props.user ? this.renderLoggedIn() : this.renderLoggedOut() }
    </div>
}
