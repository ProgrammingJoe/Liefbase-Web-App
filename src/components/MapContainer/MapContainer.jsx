import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { denormalize } from 'normalizr';

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Map,
  LayersControl,
  ScaleControl,
  ZoomControl,
  FeatureGroup,
  GeoJSON,
  TileLayer,
} from 'react-leaflet';

import 'leaflet-draw/dist/leaflet.draw.css';
import { EditControl } from 'react-leaflet-draw';

import actions from '../../redux/entities/actionCreators';
import { showCreateMapItem } from '../../redux/ui/modal';

import schemas from '../../schema';

const mapStateToProps = state => {
  const id = state.ui.map.selectedMapId;
  const map = state.entities.reliefMap[id];

  // todo: put this in reselect eventually..
  const templates = denormalize(map.mapItemTemplates, [schemas.mapItemTemplate], state.entities);

  // todo: do this in redux state based on map entities, default to victoria bounds.
  const bounds = [
    [40.712, -74.227],
    [40.774, -74.125],
  ];

  return {
    templates,
    bounds,
  };
};

const mapDispatchToProps = dispatch => ({
  updateMapItem: (values) => dispatch(actions.mapItem.update(values)),
  showCreateMapItem: (values) => dispatch(showCreateMapItem(values)),
});

@connect(mapStateToProps, mapDispatchToProps)
export default class MapContainer extends Component {
  static propTypes = {
    // mapStateToProps
    templates: PropTypes.array,
    bounds: PropTypes.array,

    // mapDispatchToProps
    updateMapItem: PropTypes.func,
    showCreateMapItem: PropTypes.func,
  };

  componentDidMount() {
    window.L = L;
    window.map = this.leafletMap.leafletElement;
    this.forceUpdate();
  }

  componentWillUnmount() {
    const leafletMap = this.leafletMap.leafletElement;
    leafletMap.off('click', this.onMapClick);
  }

  handleMarkerDragEnd = async e => {
    const id = e.target.feature.id;
    const { lat, lng } = e.target.getLatLng();

    const newValues = {
      id,
      // added for proper drf geojson serialization
      properties: {},
      geometry: {
        type: "Point",
        coordinates: [lng, lat],
      },
    };

    try {
      await this.props.updateMapItem(newValues);
    } catch(err) {
      const oldGeometry = e.target.feature.geometry.coordinates;
      e.target.setLatLng(oldGeometry);

      // todo: alert user of error updating marker
    }
  }

  handleCreate = e => {
    this.props.showCreateMapItem(e.layer.getLatLng());
    e.layer.remove();

    // todo:
    //   -update the appropriate geojson layer on success (note data is not a dynamic prop so we need to figure out how to reconstruct child?)
    //   -display message on failure?
  }

  render() {
    const { templates, bounds } = this.props;

    return (
      <Map
        bounds={bounds}
        animate
        useFlyTo
        ref={m => this.leafletMap = m}
        style={{ width: '100%' }}
        zoomControl={false}
      >
        <ScaleControl position="bottomright" />
        <ZoomControl position="bottomright" />
        <LayersControl position='topright'>
          <LayersControl.BaseLayer name='OpenStreetMap' checked>
            <TileLayer
              url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name='Humanitarian OpenStreetMap'>
            <TileLayer
              url='http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
              attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name='ESRI World Imagery'>
            <TileLayer
              url='http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
              attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name='ESRI World Topographic Map'>
            <TileLayer
              url='http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
              attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
            />
          </LayersControl.BaseLayer>

          { templates.map(template =>
            <LayersControl.Overlay key={template.id} name={template.name} checked>
              <GeoJSON
                data={template.mapItems}
                onEachFeature={(feature, layer) => {
                  layer.on('dragend', this.handleMarkerDragEnd);

                  // todo: only dragable if member or admin of this map.
                  layer.options.draggable = true;
                }}
              />
            </LayersControl.Overlay>) }
        </LayersControl>
        {/* todo: only display this if member or admin of map */}
        <FeatureGroup>
          <EditControl
            position='topright'
            onCreated={this.handleCreate}
            draw={{
              circle: false,
              circlemarker: false,
              polygon: false,
              polyline: false,
              rectangle: false,
            }}
            edit={{
              edit: false,
              remove: false,
            }}
          />
        </FeatureGroup>
      </Map>
    );
  }
}
