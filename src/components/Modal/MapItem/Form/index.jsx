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
  Dropdown,
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
export default class MapItemForm extends Component {
  static propTypes = {
    // mapStateToProps
    id: PropTypes.number, // populated if update
    entity: PropTypes.object, // populated if create
    templates: PropTypes.array,


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

    console.log(values);

    // todo: handle submitting the update/create map item

    // const newValues = {
    //   id,
    //   type: "Feature",
    //   geometry: {
    //     type: "Point",
    //   },
    //   properties: values,
    // };

    // // creation
    // if (!id) {
    //   const { lng, lat } = this.props.entity;
    //   newValues.geometry.coordinates = [lng, lat];
    // }

    // const action = id ? actions.mapItem.update : actions.mapItem.create;

    // try {
    //   await dispatch(action(newValues));
    //   dispatch(hideModal());
    // } catch (err) {
    //   const errors = {};

    //   if (err.response) {
    //     Object.keys(err.response.data).forEach(k => errors[k] = err.response.data[k].join('\n'));
    //   }

    //   throw new SubmissionError({ ...errors, _error: 'Map request failed.' });
    // }
  }

  render = () => {
    let { templates: templateOptions } = this.props;

    const uniqueCategories = {};
    templateOptions.forEach(t => { uniqueCategories[t.category] = true; });
    const categoryOptions = Object.keys(uniqueCategories).map(c => ({ value: c, text: c }));

    if (this.state.category) {
      templateOptions = templateOptions.filter(t => t.category === this.state.category);
    }

    const uniqueSubCategories = {};
    templateOptions.forEach(t => { uniqueSubCategories[t.subCategory] = true; });
    let subCategoryOptions = Object.keys(uniqueSubCategories).map(sc => ({ value: sc, text: sc }));

    if (this.state.subCategory) {
      templateOptions = templateOptions.filter(t => t.subCategory === this.state.subCategory);
    }

    templateOptions = templateOptions.map(t => ({ value: t.id, text: t.name }));

    return (
      <Form onSubmit={this.props.handleSubmit(this.handleSubmit)}>
        <Form.Group widths="equal">
          <Form.Field>
            <label>Category</label>
            <Dropdown
              placeholder="Resource"
              options={categoryOptions}
              onChange={(e, d) => this.setState({ category: d.value, subCategory: null })}
              fluid
              search
              selection
            />
          </Form.Field>
          <Form.Field>
            <label>Sub-Category</label>
            <Dropdown
              placeholder="Medical"
              options={subCategoryOptions}
              onChange={(e, d) => this.setState({ subCategory: d.value })}
              fluid
              search
              selection
            />
          </Form.Field>
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
        </Form.Group>
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
