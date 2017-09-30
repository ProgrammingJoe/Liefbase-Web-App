import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import { denormalize } from 'normalizr';

import { hideModal } from '../../../../redux/ui/modal';
import actions from '../../../../redux/entities/actionCreators';

import schemas from '../../../../schema';

import {
  Button,
  Form,
} from 'semantic-ui-react';

import SemanticUiField from '../../../SemanticReduxFormField';

const FORM_NAME = 'mapItemForm';

const mapItemForm = {
  form: FORM_NAME,
  validate: (values) => {
    const errors = {};

    if (!values.mapItemTemplate) {
      errors.template = "This field is required.";
    }

    if (!values.quantity) {
      errors.quantity = "This field is required.";
    } else if (values.quantity < 0) {
      errors.quantity = "Must be greater than 0";
    }

    return errors;
  }
};

const mapStateToProps = state => {
  const id = state.ui.modal.updateId;
  const mapItem = state.entities.mapItem[id] || {};
  const { mapItemTemplate, quantity } = mapItem;

  const mapId = state.ui.map.selectedMapId;
  const map = state.entities.reliefMap[mapId];
  const templates = denormalize(map.mapItemTemplates, [schemas.mapItemTemplate], state.entities);

  const entity = state.ui.modal.entity;

  return {
    id,
    entity,
    templates,
    initialValues: {
      mapItemTemplate,
      quantity,
    }
  };
};

@connect(mapStateToProps)
@reduxForm(mapItemForm)
export default class ReliefMapForm extends Component {
  static propTypes = {
    // mapStateToProps
    // populated if update
    id: PropTypes.number,
    // populated if create
    entity: PropTypes.object,
    templates: PropTypes.array,


    // redux-form
    handleSubmit: PropTypes.func,
    submitting: PropTypes.bool,
    submitFailed: PropTypes.bool,
  };

  handleSubmit = async (values, dispatch) => {
    const id = this.props.id;

    const newValues = {
      id,
      type: "Feature",
      geometry: {
        type: "Point",
      },
      properties: values,
    };

    // creation
    if (!id) {
      const { lng, lat } = this.props.entity;
      newValues.geometry.coordinates = [lng, lat];
    }

    const action = id ? actions.mapItem.update : actions.mapItem.create;

    try {
      await dispatch(action(newValues));
      dispatch(hideModal());
    } catch (err) {
      const errors = {};

      console.log(err);

      if (err.response) {
        Object.keys(err.response.data).forEach(k => errors[k] = err.response.data[k].join('\n'));
      }

      throw new SubmissionError({ ...errors, _error: 'Map request failed.' });
    }
  }

  render = () =>
    <Form onSubmit={this.props.handleSubmit(this.handleSubmit)}>
      <Form.Field>
        {/* todo: use some sort of dropdown or template selector here */}
        <Field
          component={SemanticUiField}
          as={Form.Input}
          type="text"
          name="mapItemTemplate"
          placeholder="1"
          label="Template"
      />
      </Form.Field>
      <Form.Field>
        <Field
          component={SemanticUiField}
          as={Form.Input}
          type="text"
          name="quantity"
          placeholder="42"
          label="Quantity"
      />
      </Form.Field>
      <Button
        type="submit"
        color="blue"
        disabled={this.props.submitting}
      >
        Submit
      </Button>
    </Form>
}
