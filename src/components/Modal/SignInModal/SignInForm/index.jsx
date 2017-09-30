import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field, SubmissionError } from 'redux-form';

import { signIn } from '../../../../redux/authorization';
import { hideModal } from '../../../../redux/ui/modal';

import isEmail from 'validator/lib/isEmail';

import {
  Button,
  Form,
} from 'semantic-ui-react';

import SemanticUiField from '../../../SemanticReduxFormField';

const FORM_NAME = 'signinForm';

const signInForm = {
  form: FORM_NAME,
  validate: (values) => {
    const errors = {};

    ['username', 'password'].filter(key => !values[key])
      .forEach((key) => errors[key] = "This field is required.");

    if (values.username && !isEmail(values.username)) {
      errors.username = "Email must be valid.";
    }

    return errors;
  }
};

@reduxForm(signInForm)
export default class SignInForm extends Component {
  static propTypes = {
    // redux-form
    handleSubmit: PropTypes.func,
    submitting: PropTypes.bool,
    submitFailed: PropTypes.bool,
  };

  handleSubmit = async (values, dispatch) => {
    try {
      await dispatch(signIn(values));
      dispatch(hideModal());
    } catch (err) {
      const errors = {};

      if (err.response) {
        Object.keys(err.response.data).forEach(k => errors[k] = err.response.data[k].join('\n'));
      }

      throw new SubmissionError({ ...errors, _error: 'Registration Failed' });
    }
  }

  render = () => {
    return (
      <Form onSubmit={this.props.handleSubmit(this.handleSubmit)}>
        <Form.Field>
          <Field
            component={SemanticUiField}
            as={Form.Input}
            type="email"
            name="username"
            placeholder="example@liefbase.io"
            label="Email/Login"
        />
        </Form.Field>
        <Form.Field>
          <Field
            component={SemanticUiField}
            as={Form.Input}
            type="password"
            name="password"
            placeholder="myPass123"
            label="Password"
        />
        </Form.Field>
        <Button
          type="submit"
          color="blue"
          disabled={this.props.submitting}
        >
          Log In
        </Button>
      </Form>
    );
  }
}
