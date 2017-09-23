import React from 'react';
import './App.css';

import Header from './components/Header';
import ModalContainer from './components/Modal';
import DrawerContainer from './components/Drawer';
import MapContainer from './components/MapContainer';

import { Provider } from 'react-redux';
import configureStore from './redux/configureStore';

let store = configureStore();

const App = () => (
  <Provider store={store}>
    <div className="App">
      <ModalContainer />
      <DrawerContainer />
      <div className="App-page">
        <Header />
        <MapContainer />
      </div>
    </div>
  </Provider>
);

export default App;
