import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dropdown } from 'semantic-ui-react';

import {
  setTileMap,
  setEntityFilter,
  unsetEntityFilter,
  clearEntityFilters,
  setAllEntityFilters,
} from '../../../redux/modules/map';
import DrawerWrapper from '../DrawerWrapper';
import EntityTemplateFilter from './EntityTemplateFilter';
import R from 'ramda';

const styles = {
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    marginTop: '10px',
  },
};

class MapDrawer extends Component {
  onChangeFilter = (kind, id) => {
    if(!R.contains({kind, id}, this.props.entityFilter)) {
      this.props.setEntityFilter(kind, id);
    } else {
      this.props.unsetEntityFilter(kind, id);
    }
  }

  render() {
    const { tileMaps, selectedTileMap } = this.props;
    const tileMapOptions = tileMaps.map((elem, idx) => ({
      text: elem.name,
      value: idx,
    }));

    return (
      <DrawerWrapper { ...this.props }>
        <div style={ styles.container }>
          <Dropdown fluid selection 
            options={ tileMapOptions }
            defaultValue={ selectedTileMap }
            placeholder='Tile Map Selection'
            onChange={(e, data) => { this.props.setTileMap(data.value);}}
          />
          <EntityTemplateFilter
            entityFilter={this.props.entityFilter}
            hazardTemplates={this.props.hazardTemplates}
            resourceTemplates={this.props.resourceTemplates}
            onChange={(kind, id) => this.onChangeFilter(kind, id)}
            onClearFilters={this.props.clearEntityFilters}
            onAllFilters={this.props.setAllEntityFilters}
          />
        </div>
      </DrawerWrapper>
    );
  }
}

MapDrawer.propTypes = {
  setTileMap: PropTypes.func,
  resourceTemplates: PropTypes.object,
  hazardTemplates: PropTypes.object,
  tileMaps: PropTypes.array,
  selectedTileMap: PropTypes.number,
  entityFilter: PropTypes.array,
  setEntityFilter: PropTypes.func,
  unsetEntityFilter: PropTypes.func,
  setAllEntityFilters: PropTypes.func,
  clearEntityFilters: PropTypes.func,
};

const mapStateToProps = state => {
  const selectedMap = state.map.maps.find(i => i.id === state.map.selectedMapId);

  const hazardTemplates = selectedMap ? selectedMap.hazardTemplates : {};
  const resourceTemplates = selectedMap ? selectedMap.resourceTemplates : {};
  return {
    tileMaps: state.map.tileMaps,
    selectedTileMap: state.map.selectedTileMap,
    selectedMap,
    hazardTemplates,
    resourceTemplates,
    entityFilter: state.map.entityFilter,
  };
};

const mapDispatchToProps = dispatch => ({
  setTileMap: (index) => dispatch(setTileMap(index)),
  setEntityFilter: (kind, id) => dispatch(setEntityFilter(kind, id)),
  unsetEntityFilter: (kind, id) => dispatch(unsetEntityFilter(kind, id)),
  clearEntityFilters: () => dispatch(clearEntityFilters()),
  setAllEntityFilters: () => dispatch(setAllEntityFilters()),
});

export default connect(mapStateToProps, mapDispatchToProps)(MapDrawer);
