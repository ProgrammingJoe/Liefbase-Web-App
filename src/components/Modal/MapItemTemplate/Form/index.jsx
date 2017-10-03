import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, Field, SubmissionError } from 'redux-form';

import { hideModal } from '../../../../redux/ui/modal';
import actions from '../../../../redux/entities/actionCreators';

import {
  Button,
  Form,
} from 'semantic-ui-react';

import SemanticUiField from '../../../SemanticReduxFormField';

const FORM_NAME = 'mapItemTemplateForm';

const mapItemForm = {
  form: FORM_NAME,
  validate: (values) => {
    const errors = {};

    if (!values.category) {
      errors.category = "This field is required.";
    }

    if (!values.subCategory) {
      errors.subCategory = "This field is required.";
    }

    if (!values.name) {
      errors.name = "This field is required.";
    }

    return errors;
  }
};

const mapStateToProps = state => {
  const id = state.ui.modal.updateId;
  const mapItemTemplate = state.entities.mapItemTemplate[id] || {};
  const { category, subCategory, name } = mapItemTemplate;

  const mapId = state.ui.map.selectedMapId;

  return {
    id,
    mapId,
    initialValues: {
      category,
      subCategory,
      name,
    }
  };
};

@connect(mapStateToProps)
@reduxForm(mapItemForm)
export default class MapItemTemplateForm extends Component {
  static propTypes = {
    // mapStateToProps
    id: PropTypes.number,
    mapId: PropTypes.number,

    // redux-form
    handleSubmit: PropTypes.func,
    submitting: PropTypes.bool,
    submitFailed: PropTypes.bool,
  };

  handleSubmit = async (values, dispatch) => {
    const id = this.props.id;

    let action;
    const params = new URLSearchParams();
    if (id) {
      action = actions.mapItemTemplate.update;
    } else {
      // update the reliefMap on creation.
      action = actions.mapItemTemplate.create;
      params.append('include[]', 'reliefMap.*');
    }

    const newValues = {
      ...values,
      reliefMap: this.props.mapId,
    };

    try {
      await dispatch(action({
        values: newValues,
        params,
      }));
      dispatch(hideModal());
    } catch (err) {
      const errors = {};

      if (err.response) {
        Object.keys(err.response.data).forEach(k => errors[k] = err.response.data[k].join('\n'));
      }

      throw new SubmissionError({ ...errors, _error: 'Map request failed.' });
    }
  }

  render = () =>
    <Form onSubmit={this.props.handleSubmit(this.handleSubmit)}>
      <Form.Field>
        <Field
          component={SemanticUiField}
          as={Form.Input}
          type="text"
          name="category"
          placeholder="Resource"
          label="Category"
      />
      </Form.Field>
      <Form.Field>
        <Field
          component={SemanticUiField}
          as={Form.Input}
          type="text"
          name="subCategory"
          placeholder="Medical"
          label="Sub Category"
      />
      </Form.Field>
      <Form.Field>
        <Field
          component={SemanticUiField}
          as={Form.Input}
          type="text"
          name="name"
          placeholder="First Aid Kit"
          label="Name"
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
