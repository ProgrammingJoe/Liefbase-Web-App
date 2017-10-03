import React from 'react';

import Header from './components/Header';
import ModalContainer from './components/Modal';
import DrawerContainer from './components/Drawer';
import MapContainer from './components/MapContainer';

import { Provider } from 'react-redux';
import configureStore from './redux/configureStore';

import css from './App.css';

let store = configureStore();

export default () => (
  <Provider store={store}>
    <div className={css.app}>
      <ModalContainer />
      <div className={css.appPage}>
        <Header />
        <div className={css.contentContainer}>
          <DrawerContainer />
          <MapContainer />
        </div>
      </div>
    </div>
  </Provider>
);
