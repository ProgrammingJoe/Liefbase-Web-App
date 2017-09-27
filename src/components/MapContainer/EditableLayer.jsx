// import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import { FeatureGroup, Tooltip } from 'react-leaflet';
// import { EditControl } from 'react-leaflet-draw';
// import L from 'leaflet';
// import DivIcon from 'react-leaflet-div-icon';
// import { Icon } from 'semantic-ui-react';

// import './MapIcons.css';
// import markerImagesMap from './MarkerImages';


// // Care of: https://stackoverflow.com/questions/18014907/leaflet-draw-retrieve-layer-type-on-drawedited-event
// // Saving this for later as it could be useful when re-integrating the drawn shapes.
// // REMOVE IF STILL COMMENTED AND SHAPES CAN BE DRAWN!
// /* var getShapeType = function(layer) {
//  *
//  *   if (layer instanceof L.Circle) {
//  *         return 'circle';
//  *     }
//  *
//  *     if (layer instanceof L.Marker) {
//  *         return 'marker';
//  *     }
//  *
//  *     if ((layer instanceof L.Polyline) && ! (layer instanceof L.Polygon)) {
//  *         return 'polyline';
//  *     }
//  *
//  *     if ((layer instanceof L.Polygon) && ! (layer instanceof L.Rectangle)) {
//  *         return 'polygon';
//  *     }
//  *
//  *     if (layer instanceof L.Rectangle) {
//  *         return 'rectangle';
//  *     }
//  *
//  * };*/

// const createEntityObject = (
//   id,
//   name,
//   position,
//   status='new',
//   geometryType='Point',
//   quantity=1
// ) => ({
//   type: 'Feature',
//   geometry: {
//     type: geometryType,
//     coordinates: position,
//   },
//   properties: {
//     id: id,
//     quantity: quantity,
//     template: {
//       name
//     },
//     organization_id: undefined,
//   },
//   status,
//   entityType: undefined,
// });

// class EditableLayer extends Component {
//   componentDidMount() {
//     this.editGroup = this.editGroup.leafletElement;
//     /* this.editGroup.on('layeradd', this._onCreate);*/
//   }

//   _onCreate(e) {
//     const position = e.layer.getLatLng();
//     const name = `New Marker #${e.layer._leaflet_id}`;
//     const newEntity = createEntityObject(
//       `tmp_${e.layer._leaflet_id}`,
//       name,
//       [position.lat, position.lng],
//       'new',
//     );

//     this.props.showUpdateModal(newEntity);
//     this.props.map.removeLayer(e.layer);
//   }

//   getEntityFromLeafletId = leafletId => {
//     const [type, id] = leafletId.split("_");
//     return this.props.entities.find(i => (i.properties.id === parseInt(id) && i.entityType === type));
//   }

//    _onDeleted(e) {
//    *   debugger;
//    *   const entity = this.getEntityFromLeafletId(e.layer._leaflet_id);
//    *   this.props.deleteEntity(entity);
//    * }

//   handleDragEnd = (e) => {
//     const currentEntity = this.getEntityFromLeafletId(e.target.options.id);
//     const { lat, lng } = e.target.getLatLng();
//     const updatedEntity = {
//       ...currentEntity,
//       geometry: {
//         ...currentEntity.geometry,
//         coordinates: [lat, lng],
//       }
//     };
//     this.props.onUpdate(updatedEntity);
//   }

//   render() {
//     const { entities }  = this.props;
//     return (
//       <FeatureGroup ref={(m) => this.editGroup = m}>
//         <EditControl
//           position='topright'
//           onCreated={this._onCreate.bind(this)}
//           draw={{
//             polyline: false,
//             polygon: false,
//             circle: false,
//             rectangle: false
//           }}
//           edit={{
//             edit: false,
//             remove: false,
//           }}
//         />
//         { entities.map(i => {
//           const mapMarker = i.entityType === 'hazard' ? 'redMarker.png' : 'blueMarker.png';
//           const markerImage = markerImagesMap.get(i.template.name);

//           return (
//             <div id={`${i.entityType}_${i.properties.id}_Container`} key={`${i.entityType}_${i.properties.id}_Container`}>
//               <DivIcon
//                 id={`${i.entityType}_${i.properties.id}`}
//                 key={`${i.entityType}_${i.properties.id}`}
//                 position={i.geometry.coordinates}
//                 onClick={() => {this.props.onClickMarker(i.properties.id, i.entityType)();}}
//                 draggable
//                 iconAnchor={[18, 56.47]}
//                 onDragEnd={e => this.handleDragEnd(e)}
//               >
//                 <div id="marker">
//                   <img src={'static/media/' + mapMarker} className="pinImage"/>
//                   <Icon name={markerImage} className="iconImage" size="big"/>
//                   <Tooltip className="pinTooltip" direction="top" offset={L.point(-11, -55)}>
//                     <span>{ i.template.name }</span>
//                   </Tooltip>
//                 </div>
//               </DivIcon>
//             </div>
//           );
//         }) }
//       </FeatureGroup>
//     );
//   }
// }

// EditableLayer.propTypes = {
//   entities: PropTypes.array,
//   onUpdate: PropTypes.func.isRequired,
//   onCreate: PropTypes.func.isRequired,
//   onClickMarker: PropTypes.func.isRequired,
//   showUpdateModal: PropTypes.func,
//   map: PropTypes.object,
// };

// export default EditableLayer;
