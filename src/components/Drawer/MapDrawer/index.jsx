import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Dropdown, Icon } from 'semantic-ui-react';

import actions from '../../../redux/entities/actionCreators';
import { showUpdateMap, showCreateMapItemTemplate, showCreateMap } from '../../../redux/ui/modal';
import { selectMap } from '../../../redux/ui/map';

import styles from './index.scss';

const mapStateToProps = state => ({
  maps: state.entities.reliefMap,
  selectedMapId: state.ui.map.selectedMapId,
});

const mapDispatchToProps = (dispatch) => ({
  getMap: values => {
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
  onClickCreateMap: () => dispatch(showCreateMap()),
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
    onClickCreateMap: PropTypes.func,
  };

  state = {
    deleteActive: false,
  }

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
        <div>
          <div>
            <label>Selected Map</label>
            <Dropdown
              className={styles.content}
              placeholder='Select a Map'
              options={options}
              onChange={this.handleChange}
              defaultValue={selectedMap && selectedMap.id}
              fluid
              search
              selection
            />
          </div>
          <div className={styles.content}>
            <Button
              onClick={this.props.onClickCreateMap}
              color="blue"
            >
              <Icon name="add" />New Map
            </Button>
          </div>
          {
            selectedMap &&
                <div className={styles.label}>
                  <label>Manage Map</label>
                  <div className={styles.content}>
                    <Icon
                      className={styles.clickable}
                      name='add'
                      color='green'
                      size='big'
                      onClick={this.props.onClickCreateTemplate}
                    />
                    <span>Add Template</span>
                  </div>
                  <div className={styles.content}>
                    <Icon
                      className={styles.clickable}
                      name='edit'
                      color='blue'
                      size='big'
                      onClick={() => this.props.updateMap(selectedMap)}
                    />
                    <span>Edit Details</span>
                  </div>
                  {
                    this.state.deleteActive ?
                      <div className={styles.content}>
                        <Icon
                          className={styles.clickable}
                          name='remove circle'
                          color='red'
                          size='big'
                          onClick={() => this.props.destroyMap(selectedMap)}
                        />
                        <span className={styles.dangerText}>Permanantly Delete Map?</span>
                        <p className={styles.safeText}>
                          <Icon
                            className={styles.clickable}
                            name='undo'
                            color='green'
                            size='big'
                            onClick={() => this.setState({ deleteActive: false })}
                          />
                          Don't Delete Map!
                        </p>
                      </div>
                    :
                      <div className={styles.content}>
                        <Icon
                          className={styles.clickable}
                          name='warning circle'
                          color='orange'
                          size='big'
                          onClick={() => this.setState({ deleteActive: true })}
                        />
                        <span className={styles.warningText}>Delete Map?</span>
                      </div>
                  }
                </div>
          }
        </div>
    );
  }
}
