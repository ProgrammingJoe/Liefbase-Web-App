import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Sidebar, Icon, Menu, Dropdown } from 'semantic-ui-react';

import {
  hideDrawer,
  showMaps,
  showOrganizations,
  showSettings,
} from '../../redux/ui/drawer';

import css from './index.css';

const mapStateToProps = state => ({
  activeDrawer: state.ui.drawer.activeDrawer,
});

const mapDispatchToProps = dispatch => ({
  hideDrawer: () => dispatch(hideDrawer()),
  showMaps: () => dispatch(showMaps()),
  showOrganizations: () => dispatch(showOrganizations()),
  showSettings: () => dispatch(showSettings()),
});

@connect(mapStateToProps, mapDispatchToProps)
export default class MenuSidebar extends React.Component {
  static propTypes = {
    // mapStateToProps
    activeDrawer: PropTypes.string,

    // mapDispatchToProps
    hideDrawer: PropTypes.func,
    showMaps: PropTypes.func,
    showOrganizations: PropTypes.func,
    showSettings: PropTypes.func,
  }

  handleClick = (e, { name }) => {
    if (name === this.props.activeDrawer) {
      this.props.hideDrawer();
      return;
    }

    switch (name) {
    case 'maps':
      this.props.showMaps();
      break;
    case 'organizations':
      this.props.showOrganizations();
      break;
    case 'settings':
      this.props.showSettings();
      break;
    default:
      this.props.hideDrawer();
    }
  }

  render = () =>
    <Sidebar
      visible
      as={Menu}
      icon='labeled'
      vertical
      inverted
    >
      <div className={css.menuStyle}>
        <Menu.Item href="http://liefbase.io">
          liefbase
        </Menu.Item>
        <Menu.Item
          name='maps'
          onClick={this.handleClick}
          active={this.props.activeDrawer === 'maps'}
        >
          <Icon name='map outline' />
        </Menu.Item>
        <Menu.Item
          name='organizations'
          className={css.lastTopMenu}
          onClick={this.handleClick}
          active={this.props.activeDrawer === 'organizations'}
        >
          <Icon name='building outline' />
        </Menu.Item>
        <Menu.Item
          name='settings'
          onClick={this.handleClick}
          active={this.props.activeDrawer === 'settings'}
        >
          <Icon name='options' />
        </Menu.Item>
      </div>
    </Sidebar>
}
