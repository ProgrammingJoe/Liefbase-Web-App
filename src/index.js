import React from 'react';
import { render } from 'react-dom';
import App from './App';
/* import registerServiceWorker from './registerServiceWorker';*/
import './index.css';

import L from 'leaflet';
// fix leaflet images/markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});


render(
    <App />,
  document.getElementById('root')
);
/* registerServiceWorker();*/
