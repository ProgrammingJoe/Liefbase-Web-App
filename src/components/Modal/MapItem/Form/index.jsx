import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector, Field, SubmissionError } from 'redux-form';
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

    // todo: fix validation.
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
  const { mapItemTemplate, properties = { } } = mapItem;
  const quantity = properties.quantity;

  const mapId = state.ui.map.selectedMapId;
  const map = state.entities.reliefMap[mapId];
  const templates = denormalize(map.mapItemTemplates, [schemas.mapItemTemplate], state.entities);

  const entity = state.ui.modal.entity;

  const templateId = formValueSelector(FORM_NAME)(state, 'mapItemTemplate');

  const selectedTemplate = state.entities.mapItemTemplate[templateId];

  return {
    id,
    entity,
    templates,
    initialValues: {
      mapItemTemplate,
      quantity,
    },
    selectedTemplate,
  };
};

@connect(mapStateToProps)
@reduxForm(mapItemForm)
export default class MapItemForm extends Component {
  static propTypes = {
    // mapStateToProps
    id: PropTypes.number, // populated if update
    entity: PropTypes.object, // populated if create
    templates: PropTypes.array,
    selectedTemplate: PropTypes.object,


    // redux-form
    handleSubmit: PropTypes.func,
    submitting: PropTypes.bool,
    submitFailed: PropTypes.bool,
  };

  static defaultProps = {
    templates: [],
  }

  state = {
    category: null,
    subCategory: null,
  }

  handleSubmit = async (values, dispatch) => {
    const id = this.props.id;

    const newValues = {
      id,
      properties: values,
    };

    // creation
    if (!id) {
      const { lng, lat } = this.props.entity;

      newValues.type = 'Feature';
      newValues.geometry = {
        type: 'Point',
        coordinates: [lat, lng],
      };
    }

    const action = id ? actions.mapItem.update : actions.mapItem.create;

    const params = new URLSearchParams();
    params.append('include[]', 'mapItemTemplate.*');

    try {
      await dispatch(action({ params, values: newValues }));
      dispatch(hideModal());
    } catch (err) {
      console.error(err);
      const errors = {};

      if (err.response) {
        Object.keys(err.response.data).forEach(k => errors[k] = err.response.data[k].join('\n'));
      }

      throw new SubmissionError({ ...errors, _error: 'Map request failed.' });
    }
  }

  render = () => {
    const templateOptions = this.props.templates.map(t => ({ value: t.id, text: t.name }));

    return (
      <Form onSubmit={this.props.handleSubmit(this.handleSubmit)}>
        <Form.Field>
          <Field
            component={SemanticUiField}
            as={Form.Dropdown}
            name="mapItemTemplate"
            placeholder="Vaccines"
            label="Template"
            options={templateOptions}
            onChange={this.handleChange}
            fluid
            search
            selection
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
    );
  }
}
