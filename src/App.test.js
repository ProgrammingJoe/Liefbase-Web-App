import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import App from './App';
import ModalContainer from './components/Modal';
import DrawerContainer from './components/Drawer';
import Header from './components/Header';
import MapContainer from './components/MapContainer';

describe('render()', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
  });

  it('renders modal container', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.contains(<ModalContainer />)).to.equal(true);
  });

  it('renders drawer container', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.contains(<DrawerContainer />)).to.equal(true);
  });

  it('renders the app body', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find('div.App-page')).to.have.length(1);
  });

  it('app body renders header', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find('div.App-page').contains(<Header />)).to.equal(true);
  });

  it('app body renders MapContainer', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find('div.App-page').contains(<MapContainer />)).to.equal(true);
  });
});
