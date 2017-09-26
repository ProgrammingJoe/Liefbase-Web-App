import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field, SubmissionError } from 'redux-form';

import { behaviours } from '../../../../redux/entities/actionCreators';
import { signIn } from '../../../../redux/authorization';
import { hideModal } from '../../../../redux/ui/modal';

import isEmail from 'validator/lib/isEmail';

import {
  Button,
  Form,
} from 'semantic-ui-react';

import SemanticUiField from '../../../SemanticReduxFormField';

const FORM_NAME = 'register';

const registerForm = {
  form: FORM_NAME,
  validate: (values) => {
    const errors = {};

    ['username', 'password', 'confirmPassword'].filter(key => !values[key])
      .forEach((key) => errors[key] = "This field is required.");

    const {
      username,
      password,
      confirmPassword,
    } = values;

    if (username && !isEmail(username)) {
      errors.username = "Email must be valid.";
    }

    if (password && confirmPassword && password !== confirmPassword) {
      errors.confirmPassword = "Passwords must match.";
    }

    return errors;
  }
};

@reduxForm(registerForm)
export default class RegisterForm extends Component {
  static propTypes = {
    // redux-form
    handleSubmit: PropTypes.func,
    submitting: PropTypes.bool,
    submitFailed: PropTypes.bool,
  };

  handleSubmit = async (values, dispatch) => {
    try {
      await dispatch(behaviours.user.create(values));
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
            name="firstName"
            placeholder="John"
            label="First Name"
          />
        </Form.Field>
        <Form.Field>
          <Field
            component={SemanticUiField}
            as={Form.Input}
            name="lastName"
            placeholder="Smith"
            label="Last Name"
          />
        </Form.Field>
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
        <Form.Field>
          <Field
            component={SemanticUiField}
            as={Form.Input}
            type="password"
            name="confirmPassword"
            placeholder="myPass123"
            label="Confirm Password"
        />
        </Form.Field>
        <Button
          type="submit"
          color="blue"
          disabled={this.props.submitting}
        >
          Sign Up
        </Button>
      </Form>
    );
  }
}
