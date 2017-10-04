import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Dropdown, Icon } from 'semantic-ui-react';

import actions from '../../../redux/entities/actionCreators';
import { showUpdateMap, showCreateMapItemTemplate } from '../../../redux/ui/modal';
import { selectMap } from '../../../redux/ui/map';

import DrawerWrapper from '../DrawerWrapper';

import css from './index.css';

const mapStateToProps = state => ({
  maps: state.entities.reliefMap,
  selectedMapId: state.ui.map.selectedMapId,
});

const mapDispatchToProps = (dispatch) => ({
  getMap: values => {
    // todo: polyfill for URLSearchParams?
    const params = new URLSearchParams();
    params.append('include[]', 'mapItemTemplates.*');
    params.append('include[]', 'mapItemTemplates.mapItems.*');

    return dispatch(actions.reliefMap.get({
      values,
      params,
    }));
  },
  listMaps: () => dispatch(actions.reliefMap.list()),
  selectMap: map => dispatch(selectMap(map)),
  destroyMap: values => dispatch(actions.reliefMap.destroy({ values })),
  updateMap: map => dispatch(showUpdateMap(map)),
  onClickCreateTemplate: () => dispatch(showCreateMapItemTemplate()),
});

@connect(mapStateToProps, mapDispatchToProps)
export default class MapDrawer extends Component {
  static propTypes = {
    // mapStateToProps
    maps: PropTypes.object,
    selectedMapId: PropTypes.number,

    // mapDispatchToProps
    listMaps: PropTypes.func,
    selectMap: PropTypes.func,
    destroyMap: PropTypes.func,
    updateMap: PropTypes.func,
    onClickCreateTemplate: PropTypes.func,
  };

  componentWillMount = () => this.props.listMaps()

  handleChange = async (e, data) => {
    const mapId = data.value;
    const map = this.props.maps[mapId];
    await this.props.getMap(map);
    this.props.selectMap(map);
  }

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

    const options = maps.map(m => ({ value: m.id, text: m.name }));
    const selectedMap = this.props.maps[this.props.selectedMapId];

    return (
      <DrawerWrapper { ...this.props }>
        <div>
          <div className={css.label}>
            <label>Selected Map</label>
            <Dropdown
              className={css.content}
              placeholder='Select a Map'
              options={options}
              onChange={this.handleChange}
              fluid
              search
              selection
            />
          </div>
          {
            selectedMap &&
                <div className={css.label}>
                  <label>Manage Map</label>
                  <div className={css.content}>
                    <Button

                      onClick={() => this.props.onClickCreateTemplate()}
                      color="green"
                    ><Icon name="add" />New Template</Button>
                  </div>
                  <div className={css.content}>
                    <Icon
                      className={css.clickable}
                      name='edit'
                      color='blue'
                      size='big'
                      onClick={e => {
                        e.stopPropagation();
                        this.props.updateMap(selectedMap);
                      }}
                    />
                    <Icon
                      className={css.clickable}
                      name='delete'
                      color='red'
                      size='big'
                      onClick={e => {
                        e.stopPropagation();
                        this.props.destroyMap(selectedMap);
                      }}
                    />
                  </div>
                </div>
          }
        </div>
      </DrawerWrapper>
    );
  }
}

/*
<Menu vertical style={styles.menu}>
{
  maps.filter((map) => map.name.toLowerCase().includes(
    this.props.searchText.toLowerCase())
  ).map((map) =>
    <div key={map.id}>
      <Menu.Item
        name={map.name}
        onClick={ async () => {
          await this.props.getMap(map);
          this.props.selectMap(map);
        }}
        active={ map.id === this.props.selectedMapId }
        style={{ display: 'flex', wordBreak: 'break-all' }}
      >
        {map.name}
        {
          !map.public && // todo: check if current user is admin of map for these buttons
            <div style={{ marginLeft: 'auto' }}>

            </div>
        }
      </Menu.Item>
    </div>
  )
}
</Menu>
*/
