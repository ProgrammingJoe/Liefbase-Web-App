import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Input, Form } from 'semantic-ui-react';

import { signIn } from '../../../../redux/authorization';

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

class SignInForm extends Component {
  componentDidMount() {
    this.email.focus();
  }

  handleSubmit(e) {
      e.preventDefault();
      this.props.signIn(this.email.inputRef.value, this.password.inputRef.value);
  }

  render() {
    return (
      <div style={styles.container}>
        <Form onSubmit={e => this.handleSubmit(e)} loading={this.props.pending}>
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
          <Button
            style={styles.submitButton}
            color="blue"
            type="submit"
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

SignInForm.propTypes = {
  signIn: PropTypes.func,
  pending: PropTypes.bool,
  error: PropTypes.string,
};

const mapStateToProps = state => ({
  error: state.user.error,
  pending: state.user.pending,
  email: state.user.email,
  type: state.user.userType,
  organization: state.user.organization,
});

const mapDispatchToProps = dispatch => ({
  signIn: (email, password) => dispatch(signIn(email, password)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignInForm);
