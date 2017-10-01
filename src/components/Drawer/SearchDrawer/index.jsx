import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Input, Menu, Icon } from 'semantic-ui-react';

import actions from '../../../redux/entities/actionCreators';
import { showUpdateMap } from '../../../redux/ui/modal';
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
  maps: state.entities.reliefMap,
  selectedMapId: state.ui.reliefMapId,
  searchText: state.ui.drawer.searchText,
});

const mapDispatchToProps = (dispatch) => ({
  listMaps: () => dispatch(actions.reliefMap.list()),
  selectMap: (map) => dispatch(selectMap(map)),
  setSearchText: (text) => dispatch(setSearchText(text)),
  destroyMap: (map) => dispatch(actions.reliefMap.destroy(map)),
  updateMap: (map) => dispatch(showUpdateMap(map)),
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
    destroyMap: PropTypes.func,
    updateMap: PropTypes.func,
  };

  componentWillMount = () => this.props.listMaps()

  render() {
    const maps = Object.values(this.props.maps)
      .sort((m1, m2) => {
        // case insensitive.
        if (m1.name.toLowerCase() > m2.name.toLowerCase()) return 1;
        if (m1.name.toLowerCase() < m2.name.toLowerCase()) return -1;

        // upper case first if same name.
        if (m1.name > m2.name) return 1;
        if (m1.name < m2.name) return -1;

        // deterministic
        return m1.id > m2.id;
      });

    return (
      <DrawerWrapper { ...this.props }>
        <div style={ styles.container }>
          {/* todo: better mechanism for search (semantic autocomplete element?)*/}
          <Input
            placeholder="Search..."
            icon="search"
            onChange={ (e, data) => this.props.setSearchText(data.value) }
            value={ this.props.searchText }
          />

          <Menu vertical style={styles.menu}>
          {
            maps.filter((map) => map.name.toLowerCase().includes(
              this.props.searchText.toLowerCase())
            ).map((map) =>
              <div key={map.id}>
                <Menu.Item
                  name={map.name}
                  onClick={() => this.props.selectMap(map)}
                  active={ map.id === this.props.selectedMapId }
                  style={{ display: 'flex', wordBreak: 'break-all' }}
                >
                  {map.name}
                  {
                    !map.public && // todo: check if current user is admin of map for these buttons
                      <div style={{ marginLeft: 'auto' }}>
                        <Icon
                          name='edit'
                          color='blue'
                          onClick={e => {
                            e.stopPropagation();
                            this.props.updateMap(map);
                          }}
                        />
                        <Icon
                          name='delete'
                          color='red'
                          onClick={e => {
                            e.stopPropagation();
                            this.props.destroyMap(map);
                          }}
                        />
                      </div>
                  }
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
