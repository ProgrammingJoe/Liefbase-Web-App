import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Button,
  Input,
  Dropdown,
  Form,
} from 'semantic-ui-react';

import { getOrganizations } from '../../../../redux/modules/organization';
import { register, clearStatus } from '../../../../redux/modules/registration';

const styles = {
  container: {
    display: 'flex',
    textAlign: 'start',
    flexDirection: 'column',
  },
  submitButton: {
    float: 'right',
    margin: 0,
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
  }
};

class RegisterForm extends Component {
  componentWillMount() {
    this.props.fetchOrganizations();
  }

  componentDidMount() {
    this.firstName.focus();
  }

  componentWillUnmount() {
    this.props.clearStatus();
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.register(
      this.firstName.inputRef.value,
      this.lastName.inputRef.value,
      this.email.inputRef.value,
      this.password.inputRef.value,
      this.confirmPassword.inputRef.value,
      this.organization.getSelectedItem().id
    );
  }


  render() {
    return (
      <div style={styles.container}>
        <Form onSubmit={e => this.handleSubmit(e)} loading={this.props.pending}>
          <Form.Field>
            <label>First Name</label>
            <Input
              ref={input => this.firstName = input}
              type="text"
              name="firstName"
              placeholder="First Name"
            />
          </Form.Field>
          <Form.Field>
            <label>Last Name</label>
            <Input
              ref={input => this.lastName = input}
              type="text"
              name="lastName"
              placeholder="Last Name"
            />
          </Form.Field>
          <Form.Field>
            <label>Email</label>
            <Input
              ref={input => this.email = input}
              type="email"
              name="email"
              placeholder="Email"
            />
          </Form.Field>
          <Form.Field>
            <label>Password</label>
            <Input
              ref={input => this.password = input}
              type="password"
              name="password"
              placeholder="Password"
            />
          </Form.Field>
          <Form.Field>
            <label>Confirm Password</label>
            <Input
              ref={input => this.confirmPassword = input}
              type="password"
              name="password"
              placeholder="Confirm Password"
            />
          </Form.Field>
          <Form.Field>
            <label>Organization</label>
            <Dropdown placeholder="Organization"
                      fluid
                      selection
                      ref={input => this.organization = input}
                      loading={this.props.organizationsLoading}
                      options={this.props.organizations.map(i => ({...i, text: i.name, value: i.name}))}
            />
          </Form.Field>
          <Button
            style={styles.submitButton}
            type="submit"
            color="blue"
          >
            Submit
          </Button>

        </Form>
        {
          this.props.error
          ? <div style={styles.error}>
            {this.props.error}
          </div>
          : null
        }
      </div>
    );
  }
}

RegisterForm.propTypes = {
  register: PropTypes.func,
  pending: PropTypes.bool,
  error: PropTypes.string,
  organizations: PropTypes.array,
  fetchOrganizations: PropTypes.func,
  organizationsLoading: PropTypes.bool,
  clearStatus: PropTypes.func,
};

const mapStateToProps = state => ({
  error: state.registration.error,
  pending: state.registration.pending,
  success: state.registration.success,
  organizations: state.organization.organizations,
  organizationsLoading: state.organization.pending,
});

const mapDispatchToProps = dispatch => ({
  fetchOrganizations: () => dispatch(getOrganizations()),
  register: (firstName, lastName, email, password, cpassword, organization) => dispatch(register(firstName, lastName, email, password, cpassword, organization)),
  clearStatus: () => dispatch(clearStatus()),
});


export default connect(mapStateToProps, mapDispatchToProps)(RegisterForm);
