import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { denormalize } from 'normalizr';
import { Icon } from 'semantic-ui-react';

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
import { showCreateMapItem, showUpdateMapItem } from '../../redux/ui/modal';

import schemas from '../../schema';

import css from './MapContainer.css';

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
  updateMapItem: values => dispatch(actions.mapItem.update({ values })),
  destroyMapItem: values => {
    dispatch(actions.mapItem.destroy({ values }));
  },
  showCreateMapItem: values => dispatch(showCreateMapItem(values)),
  showUpdateMapItem: values => dispatch(showUpdateMapItem(values)),
});

@connect(mapStateToProps, mapDispatchToProps)
export default class MapContainer extends Component {
  static propTypes = {
    // mapStateToProps
    templates: PropTypes.array,
    bounds: PropTypes.array,

    // mapDispatchToProps
    updateMapItem: PropTypes.func,
    destroyMapItem: PropTypes.func,
    showCreateMapItem: PropTypes.func,
    showUpdateMapItem: PropTypes.func,
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

    const values = {
      id,
      // added for proper drf geojson serialization
      properties: {},
      geometry: {
        type: "Point",
        coordinates: [lng, lat],
      },
    };

    try {
      await this.props.updateMapItem(values);
    } catch(err) {
      const oldGeometry = e.target.feature.geometry.coordinates;
      e.target.setLatLng(oldGeometry);

      // todo: alert user of error updating marker
    }
  }

  handleCreate = e => {
    this.props.showCreateMapItem(e.layer.getLatLng());
    e.layer.remove();
  }

  renderPopup = feature => {
    const lastUpdate = new Date(feature.properties.updatedAt);
    const timeSinceUpdated = Math.abs((new Date()).getTime() - lastUpdate.getTime());

    const totalTimes = {
      second: Math.floor(timeSinceUpdated / 1000),
      minute: Math.floor(timeSinceUpdated / 1000 / 60),
      hour: Math.floor(timeSinceUpdated / 1000 / 60 / 60),
      day: Math.floor(timeSinceUpdated / 1000 / 60 / 60 / 60),
    };

    let timeDeltaDisplay;
    Object.entries(totalTimes).forEach(([k, v]) => {
      if (v) {
        if (v === 1) {
          timeDeltaDisplay = `${v} ${k} ago`;
        } else {
          timeDeltaDisplay = `${v} ${k}s ago`;
        }
      }
    });

    return (
      <div>
        <p>Template: <b>{feature.properties.mapItemTemplate.name}</b></p>
        <p>Quantity: <b>{feature.properties.quantity}</b></p>
        <p>Last Updated: <b>{timeDeltaDisplay}</b></p>
        <div className={css.center}>
          <Icon
            className={css.clickable}
            name='edit'
            color='blue'
            size='large'
            onClick={() => this.props.showUpdateMapItem(feature)}
          />
          <Icon
            className={css.clickable}
            name='remove circle'
            color='red'
            size='large'
            onClick={() => this.props.destroyMapItem(feature)}
          />
        </div>
      </div>
    );
  }

  renderGeoJson = template =>
    <LayersControl.Overlay
      key={`${template.id}:${template.mapItems.length}`}
      name={template.name}
      checked
    >
      <GeoJSON
        data={template.mapItems}
        onEachFeature={(feature, layer) => {
          layer.on('dragend', this.handleMarkerDragEnd);

          const popup = document.createElement('div');
          ReactDOM.render(this.renderPopup(feature), popup);
          layer.bindPopup(popup);
          layer.on('mouseover', () => layer.openPopup());

          // todo: only dragable if member or admin of this map.
          layer.options.draggable = true;
        }}
      />
    </LayersControl.Overlay>

  render() {
    const { templates, bounds } = this.props;

    return (
      <Map
        bounds={bounds}
        animate
        useFlyTo
        ref={m => this.leafletMap = m}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <ScaleControl position="bottomleft" />
        <ZoomControl position="bottomleft" />
        <LayersControl position='topleft'>
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
          { templates.map(this.renderGeoJson) }
        </LayersControl>
        {/* todo: only display this if member or admin of map */}
        <FeatureGroup>
          <EditControl
            position='topleft'
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
