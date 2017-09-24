import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Dropdown, Button } from 'semantic-ui-react';

import { hideModal } from '../../../../redux/ui/modal';
import { getTemplates, createEntity } from '../../../../redux/entities/reliefMaps';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  error: {
    backgroundColor: 'lightpink',
    color: 'darkred',
    margin: '5px',
    padding: '5px',
    borderWidth: '0.5px',
    borderColor: 'darkred',
    borderRadius: '5px',
    borderStyle: 'solid'
  },
  button: {
    float: 'right',
    marginRight: 0,
    marginLeft: '10px',
  },
};

class UpdateModalForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: undefined,
      typeTemplate: undefined,
      name: props.entity.properties.id,
      lat: props.entity.geometry.coordinates[0],
      lng: props.entity.geometry.coordinates[1],
      quantity: 1,
    };
  }

  componentWillMount() {
    // TODO: use real mapId from state
    this.props.getMapTemplates(this.props.selectedMapId);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const newEntity = {
      geometry: {
        coordinates: [this.state.lat, this.state.lng].map(parseFloat),
      },
      properties: {
        quantity: this.state.quantity || 1,
        template_id: this.state.typeTemplate.id,
        template: {
          id: this.state.typeTemplate.id,
        },
      },
      entityType: this.state.typeTemplate.markerType,
    };
    this.props.createEntity(newEntity);
  }

  handleType = (e, { value }) => {
    this.setState({ type: value.name, typeTemplate: value });
  }

  hazardData() {
    const dropdownHazardOptions = Object.values(this.props.hazardTemplates).map(i => ({
      key: `hazard_${i.id}`, text: i.name, value: {...i, markerType: 'hazard'}
    }));
    return dropdownHazardOptions;

  }

  resourceData() {
    const dropdownResourceOptions = Object.values(this.props.resourceTemplates).map(i => ({
      key: `resource_${i.id}`, text: i.name, value: {...i, markerType: 'resource'}
    }));
    return dropdownResourceOptions;
  }

  categoryData() {
    switch(this.state.category) {
      case 'hazard':
        return this.hazardData();
      case 'resource':
        return this.resourceData();
      default:
        return null;
    }
  }

  handleChange = (e, {name, value}) => this.setState({ [name]: value})

  render() {
    const { lat, lng, quantity } = this.state;
    return (
      <div style={styles.container}>
        <Form onSubmit={e => this.handleSubmit(e)} loading={this.props.pending}>
          <Form.Field inline>
            <label>Type (required):&nbsp;</label>
            <Dropdown text={this.state.type} placeholder={this.state.type ? undefined : 'Type'} inline scrolling>
              <Dropdown.Menu >
                <Dropdown.Header content="Hazards"/>
                  { this.hazardData().map(i => <Dropdown.Item {...i} content={i.name} onClick={this.handleType} />) }
                <Dropdown.Divider />
                <Dropdown.Header content="Resources" />
                  { this.resourceData().map(i => <Dropdown.Item {...i} content={i.name} onClick={this.handleType} />) }
              </Dropdown.Menu>
            </Dropdown>
          </Form.Field>
          <Form.Group widths="equal">
            <Form.Input name="lat" label="Latitude" placeholder="Latitude" value={lat} onChange={this.handleChange} />
            <Form.Input name="lng" label="Longitude" placeholder="Longitude" value={lng} onChange={this.handleChange} />
          </Form.Group>
          { (this.state.typeTemplate && this.state.typeTemplate.markerType === 'resource') ? <Form.Input name="quantity" label="Quantity" placeholder="Quantity" value={quantity} onChange={this.handleChange} /> : null }
          <Button
            style={styles.button}
            color="grey"
            type="button"
            onClick={() => {
                this.props.hideModal();
            }}
          >
            Cancel
          </Button>
          <Button
            disabled={!this.state.type}
            style={styles.button}
            type="submit"
            color="blue"
          >
            Create
          </Button>
        </Form>
      </div>
    );
  }
}

UpdateModalForm.propTypes = {
  pending: PropTypes.bool,
  resourceTemplates: PropTypes.object,
  hazardTemplates: PropTypes.object,
  selectedMapId: PropTypes.number,
  hideModal: PropTypes.func,
  entity: PropTypes.object,
  createEntity: PropTypes.object,
  getMapTemplates: PropTypes.func,
};

const mapStateToProps = state => ({
  error: state.map.error,
  pending: state.map.pending,
  success: state.map.success,
  hazardTemplates: state.map.hazardTemplates,
  resourceTemplates: state.map.resourceTemplates,
  entity: state.modal.entity,
  selectedMapId: state.map.selectedMapId,
});

const mapDispatchToProps = dispatch => ({
  createEntity: () => dispatch(createEntity()),
  clearStatus: () => dispatch(clearStatus()),
  getMapTemplates: (mapId) => dispatch(getTemplates(mapId)),
  createEntity: (payload) => dispatch(createEntity(payload)),
  hideModal: () => dispatch(hideModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(UpdateModalForm);
