import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Input, Menu, Icon } from 'semantic-ui-react';

import {
  list as listMaps
} from '../../../redux/entities/reliefMaps';
import { showEditMapDetails } from '../../../redux/ui/modal';
import { setSearchText } from '../../../redux/ui/drawer';
import { selectMap } from '../../../redux/ui/map';

import DrawerWrapper from '../DrawerWrapper';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '10px',
  },
  menu: {
    top: '100px',
    bottom: '0px',
    position: 'fixed',
    overflowY: 'scroll',
  },
};

const mapStateToProps = state => ({
  maps: state.entities.reliefMaps,
  selectedMapId: state.ui.reliefMapId,
  searchText: state.ui.drawer.searchText,
});

const mapDispatchToProps = (dispatch) => ({
  listMaps: () => dispatch(listMaps()),
  selectMap: (map) => dispatch(selectMap(map)),
  setSearchText: (text) => dispatch(setSearchText(text)),
  deleteMap: (id) => dispatch(deleteMap(id)),
  editMapDetails: (id) => {
    dispatch(selectMap(id));
    dispatch(showEditMapDetails());
  },
});

@connect(mapStateToProps, mapDispatchToProps)
export default class SearchDrawer extends Component {
  static propTypes = {
    // mapStateToProps
    maps: PropTypes.object,
    selectedMapId: PropTypes.number,
    searchText: PropTypes.string,

    // mapDispatchToProps
    listMaps: PropTypes.func,
    selectMap: PropTypes.func,
    setSearchText: PropTypes.func,
    deleteMap: PropTypes.func,
    editMapDetails: PropTypes.func,
  };

  componentWillMount = () => {
    console.log('mounting');
    this.props.listMaps();
  }


  render() {
    const maps = Object.values(this.props.maps)
      .sort((m1, m2) => m1.name < m2.name);

    return (
      <DrawerWrapper { ...this.props }>
        <div style={ styles.container }>
          <Input
            placeholder="Search..."
            icon="search"
            onChange={ (e, data) => this.props.setSearchText(data.value) }
            value={ this.props.searchText }
          />

          <Menu vertical style={ styles.menu }>
          {
            maps.filter((map) => map.name.toLowerCase().includes(
              this.props.searchText.toLowerCase())
            ).map((map) =>
              <div key={ map.id }>
                <Menu.Item
                  name={ map.name }
                  onClick={ () => this.props.selectMap(map) }
                  active={ map.id === this.props.selectedMapId }
                  style={{ textAlign: 'left' }}
                >
                  {map.name}
                  <Icon
                    name='delete'
                    color='red'
                    onClick={ () => this.props.deleteMap(map.id) }
                  />
                  <Icon
                    name='edit'
                    color='blue'
                    onClick={ () => this.props.editMapDetails(map.id) }
                  />
                </Menu.Item>
              </div>
            )
          }
          </Menu>
        </div>
      </DrawerWrapper>
    );
  }
}
