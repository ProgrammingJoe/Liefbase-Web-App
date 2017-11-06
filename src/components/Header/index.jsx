import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { showSignIn, showRegister } from '../../redux/ui/modal';
import {
  signOut,
  refresh as refreshSession
} from '../../redux/authorization';

import { Menu } from 'semantic-ui-react';

import css from './index.css';

const mapStateToProps = state => ({
  isCurrentUser: Boolean(state.authorization.currentUserId),
});

const mapDispatchToProps = (dispatch) => ({
  onClickSignIn: () => dispatch(showSignIn()),
  onClickRegister: () => dispatch(showRegister()),
  onClickSignOut: () => dispatch(signOut()),
  refreshSession: () => dispatch(refreshSession()),
});

@connect(mapStateToProps, mapDispatchToProps)
export default class Header extends Component {
  static propTypes = {
    // mapStateToProps
    isCurrentUser: PropTypes.bool,

    // mapDispatchToProps
    onClickSignIn: PropTypes.func,
    onClickRegister: PropTypes.func,
    onClickSignOut: PropTypes.func,
    refreshSession: PropTypes.func,
  };

  componentWillMount() {
    this.props.refreshSession();
  }

  render = () =>
    <Menu className={css.headerStyle}>
      <a position='left' className={css.branding} href="http://liefbase.io">
        liefbase
      </a>
      <Menu.Menu position='right'>
        {
          this.props.isCurrentUser ?
            <Menu.Item onClick={this.props.onClickSignOut}>
             Log Out
            </Menu.Item>
          :
            [<Menu.Item key='login' onClick={this.props.onClickSignIn}>
             Log In
            </Menu.Item>,
            <Menu.Item key='register' onClick={this.props.onClickRegister}>
             Register
            </Menu.Item>]
        }
      </Menu.Menu>
    </Menu>
}
