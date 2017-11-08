import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import { Popup } from 'react-leaflet';

import styles from './index.scss';

export default class PopupContent extends Component {
  static propTypes = {
    // external
    feature: PropTypes.object,
    destroyMapItem: PropTypes.func,
    showUpdateMapItem: PropTypes.func,
  }

  constructor(props) {
    super(props);

    const { updatedDisplay, intervalMs } = this.getSince(props.feature.properties.updatedAt);

    this.state = {
      updatedDisplay,
      intervalMs,
    };
  }

  componentDidMount = () => {
    this.interval = setInterval(this.updateTimeDisplay, this.state.intervalMs);
  }

  componentWillUnmount = () => {
    clearInterval(this.interval);
  }

  updateTimeDisplay = () => {
    const { updatedDisplay, intervalMs } = this.getSince(this.props.feature.properties.updatedAt);
    this.setState({ updatedDisplay, intervalMs });

    clearInterval(this.interval);
    this.interval = setInterval(this.updateTimeDisplay, this.state.intervalMs);
  }

  getSince = time => {
    const lastUpdate = new Date(time);
    const timeSinceUpdated = Math.abs((new Date()).getTime() - lastUpdate.getTime());

    const intervals = {
      second: 1000,
      minute: 1000 * 60,
      hour: 1000 * 60 * 60,
      day: 1000 * 60 * 60 * 24,
    };

    const totalTimes = {
      second: Math.floor(timeSinceUpdated / intervals.second),
      minute: Math.floor(timeSinceUpdated / intervals.minute),
      hour: Math.floor(timeSinceUpdated / intervals.hour),
      day: Math.floor(timeSinceUpdated / intervals.day),
    };

    let updatedDisplay = 'now';
    let intervalMs = intervals.second;

    Object.entries(totalTimes).forEach(([k, v]) => {
      if (v) {
        if (v === 1) {
          updatedDisplay = `${v} ${k} ago`;
        } else {
          updatedDisplay = `${v} ${k}s ago`;
        }
        intervalMs = intervals[k];
      }
    });

    return {
      updatedDisplay,
      intervalMs,
    };
  }

  render() {
    const { feature } = this.props;
    const { updatedDisplay } = this.state;

    return (
      <Popup>
        <div>
          <p>Template: <b>{feature.properties.mapItemTemplate.name}</b></p>
          <p>Quantity: <b>{feature.properties.quantity}</b></p>
          <p>Last Updated: <b>{updatedDisplay}</b></p>
          <div className={styles.center}>
            <Icon
              className={styles.clickable}
              name='edit'
              color='blue'
              size='large'
              onClick={() => this.props.showUpdateMapItem(feature)}
            />
            <Icon
              className={styles.clickable}
              name='remove circle'
              color='red'
              size='large'
              onClick={() => this.props.destroyMapItem(feature)}
            />
          </div>
        </div>
      </Popup>
    );
  }
}
