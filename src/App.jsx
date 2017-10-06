import React from 'react';
import { Provider } from 'react-redux';

import Header from './components/Header';
import SidebarMenu from './components/Sidebar';
import ModalContainer from './components/Modal';
import ContentContainer from './components/ContentContainer';

import configureStore from './redux/configureStore';

let store = configureStore();

export default () => (
  <Provider store={store}>
    <div>
      <ModalContainer />
      <SidebarMenu />
      <Header />
      <ContentContainer />
    </div>
  </Provider>
);
