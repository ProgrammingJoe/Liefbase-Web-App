import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Sidebar, Icon, Menu } from 'semantic-ui-react';

import {
  hideDrawer,
  showDrawer,
} from '../../redux/ui/drawer';

import css from './index.css';

const mapStateToProps = state => ({
  isCurrentUser: Boolean(state.authorization.currentUserId),
  activeDrawer: state.ui.drawer.activeDrawer,
});

const mapDispatchToProps = dispatch => ({
  hideDrawer: () => dispatch(hideDrawer()),
  showDrawer: drawer => dispatch(showDrawer(drawer)),
});

@connect(mapStateToProps, mapDispatchToProps)
export default class MenuSidebar extends React.Component {
  static propTypes = {
    // mapStateToProps
    activeDrawer: PropTypes.string,
    isCurrentUser: PropTypes.bool,

    // mapDispatchToProps
    hideDrawer: PropTypes.func,
    showDrawer: PropTypes.func,
  }

  handleClick = (e, { name }) => {
    if (name === this.props.activeDrawer) {
      this.props.hideDrawer();
    } else {
      this.props.showDrawer(name);
    }
  }

  render = () =>
    <Sidebar
      visible
      as={Menu}
      icon='labeled'
      vertical
      inverted
      className={css.sideBarStyle}
    >
      <div className={css.menuStyle}>
        <Menu.Item
          className={this.props.isCurrentUser ? '' : css.lastTopMenu}
          name='maps'
          onClick={this.handleClick}
          active={this.props.activeDrawer === 'maps'}
        >
          <Icon name='map outline' />
        </Menu.Item>
        {
          this.props.isCurrentUser &&
            [<Menu.Item
              key='organizations'
              name='organizations'
              onClick={this.handleClick}
              active={this.props.activeDrawer === 'organizations'}
            >
              <Icon name='building outline' />
            </Menu.Item>,
            <Menu.Item
              key='teams'
              name='teams'
              className={css.lastTopMenu}
              onClick={this.handleClick}
              active={this.props.activeDrawer === 'teams'}
            >
              <Icon name='users' />
            </Menu.Item>,
            <Menu.Item
              key='settings'
              name='settings'
              onClick={this.handleClick}
              active={this.props.activeDrawer === 'settings'}
            >
              <Icon name='options' />
            </Menu.Item>]
        }
      </div>
    </Sidebar>
}
