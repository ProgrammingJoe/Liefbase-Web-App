import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Checkbox, Button, Icon } from 'semantic-ui-react';
import R from 'ramda';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  scrollingContainer: {
    display: 'flex',
    alignItems: 'start',
    flexDirection: 'column',
    overflowY: 'scroll',
  },
  item: {
    paddingLeft: '5px',
  },
  inputIcon: {
    height: '25px',
    width: '15px',
    left: '90%',
    paddingTop: '6px',
    cursor: 'pointer',
    position: 'absolute'
  }
};

export default class EntityTemplateFilter extends Component {
  static propTypes = {
    hazardTemplates: PropTypes.object,
    resourceTemplates: PropTypes.object,
    onClearFilters: PropTypes.func,
    onAllFilters: PropTypes.func,
    onChange: PropTypes.func,
    entityFilter: PropTypes.array,
  };

  constructor() {
    super();
    this.state = { searchText: '' };
  }

  render() {
    return (
      <div style={styles.container}>
        <h3>Filter Markers</h3>
        <div>
          <Input
            fluid
            size="small"
            placeholder="Search..."
            icon={ <div style={styles.inputIcon}>
              <Icon name="close" onClick={() => this.setState({searchText: ''})} />
            </div>}
            onChange={ (e, { value }) => this.setState({searchText: value.toLowerCase()})}
            value={ this.state.searchText }
          />
        </div>
        <div>
          <Button onClick={this.props.onClearFilters}>All</Button>
          <Button onClick={this.props.onAllFilters}>None</Button>
        </div>
        <div style={styles.scrollingContainer}>
        <h5>Resources</h5>
        { Object.values(this.props.resourceTemplates)
                .filter(i => i.name.toLowerCase().includes(this.state.searchText))
                .sort((a,b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1)
                .map(i => {
              return (
                <Checkbox
                  style={styles.item}
                  key={i.id}
                  label={i.name}
                  checked={!R.contains({kind: 'resource', id: i.id}, this.props.entityFilter)}
                  onChange={() => this.props.onChange('resource', i.id)}/>
              );
          })}
          <h5>Hazards</h5>
          { Object.values(this.props.hazardTemplates)
                  .filter(i => i.name.toLowerCase().includes(this.state.searchText))
                  .sort((a,b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1)
                  .map(i => {
              return (
                <Checkbox
                  style={styles.item}
                  key={i.id}
                  label={i.name}
                  checked={!R.contains({kind: 'hazard', id: i.id}, this.props.entityFilter)}
                  onChange={() => this.props.onChange('hazard', i.id)}/>
              );
          })}
        </div>
      </div>
    );
  }
}
