import React from 'react';
import PropTypes from 'prop-types';
import { FeatureGroup, Marker, Tooltip } from 'react-leaflet';

const FixedLayer = (props) => {
  const entities = props.entities;
  return (
    <FeatureGroup ref={(m) => this.fixedGroup = m}>
      { entities.map(i => (
          <Marker id={i.id} key={i.id} position={i.position}>
            <Tooltip direction="top" offset={[0, -10]}>
              <span>{ i.name }</span>
            </Tooltip>
          </Marker>
      ))}
    </FeatureGroup>
  );
};

FixedLayer.propTypes = {
  entities: PropTypes.array,
};

export default FixedLayer;
