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

import './Header.css';

const text = {
  liefbase: 'liefbase',
  signIn: 'Log In',
  signOut: 'Log out',
  register: 'Sign up',
  createMap: 'Create Map',
};

const styles = {
  container: {
    backgroundColor: '#FFF',
    height: '3rem',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: '5px',
    zIndex: '8000',
  },
  leftGroup: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
  },
  rightGroup: {
    display: 'flex',
    alignItems: 'center',
  },
  email: {
    margin: '0px',
    paddingRight: '10px',
  }
};

const mapStateToProps = (state) => {
  const id = state.ui.userId;
  return {
    user: state.entities.users[id],
    modal: state.ui.modal,
    drawer: state.ui.drawer.drawerType,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onClickSignIn: () => dispatch(showSignIn()),
    onClickRegister: () => dispatch(showRegister()),
    onClickCreateMap: () => dispatch(showCreateMap()),
    onClickSignOut: () => dispatch(signOut()),
    openMapSettingsDrawer: () => dispatch(showMap()),
    openSearchDrawer: () => dispatch(showSearch()),
    openInfoDrawer: () => dispatch(showInfo()),
    hideDrawer: () => dispatch(hideDrawer()),
    refreshSession: () => dispatch(refreshSession()),
  };
};

@connect(mapStateToProps, mapDispatchToProps)
export default class Header extends Component {
  static propTypes = {
    user: PropTypes.shape({email: PropTypes.string}),
    drawer: PropTypes.string,
    hideDrawer: PropTypes.func,
    onClickSignIn: PropTypes.func,
    onClickRegister: PropTypes.func,
    onClickSignOut: PropTypes.func,
    onClickCreateMap: PropTypes.func,
    openInfoDrawer: PropTypes.func,
    openMapSettingsDrawer: PropTypes.func,
    openSearchDrawer: PropTypes.func,
    refreshSession: PropTypes.func,
  };

  componentWillMount() {
    this.props.refreshSession();
  }

  renderLoggedIn = () =>
    <div style={styles.rightGroup}>
      <h4 style={styles.email}>{ 'Welcome TODO WELCOME MESSAGE' }</h4>
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
    <div style={styles.container}>
      <div style={styles.leftGroup}>
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
      { false ? this.renderLoggedIn() : this.renderLoggedOut() }
    </div>

    // todo remove false above
}
