import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { map } from 'ramda';
import { Button } from 'semantic-ui-react';

import { round } from '../../../util/Numbers';
import {
  setPosition as setMapPosition,
  deleteEntity,
} from '../../../redux/entities/reliefMaps';

import DrawerWrapper from '../DrawerWrapper';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '10px'
  },
};

class InformationDrawer extends Component {
  render() {
    return (
      <DrawerWrapper {...this.props}>
        <div style={styles.container}>
          { map(i => {
            const { name, category, unit } = this.props[`${i.entityType}Templates`][i.properties.template_id];
            const quantity = i.properties.quantity;

            return (
              <div key={i.properties.id}>
                <p>Name:&nbsp;{name}</p>
                { category ? <p>Category:&nbsp;{category}</p> : null }
                { quantity ? <p>quantity:&nbsp;{quantity}&nbsp;{unit}</p> : null }
                <p>Lat:{round(i.geometry.coordinates[0], 4)}</p>
                <p>Lng:{round(i.geometry.coordinates[1], 4)}</p>
                <Button onClick={() => this.props.setMapPosition(i.geometry.coordinates[0], i.geometry.coordinates[1], 17)}>Fly To</Button>
                <Button onClick={() => this.props.deleteEntity(i)} color='red'>Delete</Button>
              </div>
            );
            }, this.props.selectedEntities) }
        </div>
      </DrawerWrapper>
    );
  }
}

InformationDrawer.propTypes = {
  selectedEntities: PropTypes.array,
  setMapPosition: PropTypes.func,
  deleteEntity: PropTypes.func,
};

const mapStateToProps = state => {
  const id = state.ui.reliefMapId;
  const selectedMap = state.entities.reliefMaps[id];

  const entities = []; // todo fix this.

  return ({
    selectedMap,
    selectedEntities: entities, // todo fix this.
    templates: selectedMap.map_item_templates,
});
};

const mapDispatchToProps = (dispatch) => ({
  setMapPosition: (lat, lng, zoom) => dispatch(setMapPosition(lat, lng, zoom)),
  deleteEntity: (entity) => dispatch(deleteEntity(entity)),
});

export default connect(mapStateToProps, mapDispatchToProps)(InformationDrawer);
