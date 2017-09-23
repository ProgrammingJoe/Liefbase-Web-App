import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Button,
  Input,
  TextArea,
  Form,
} from 'semantic-ui-react';

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

class ReliefMapForm extends Component {
  render() {
    return (
        <div style={styles.container}>
          <Form 
            onSubmit={(e) => {
              e.preventDefault();
              this.props.handleSubmit(this.name.inputRef.value, this.description.ref.value);
            }}
            loading={this.props.pending}
          >
            <Form.Field>
              <label>Name</label>
              <Input
                ref={input => this.name = input}
                type="text"
                name="name"
                placeholder="Name"
                defaultValue={this.props.name}
              />
            </Form.Field>
            <Form.Field>
              <label>Description</label>
              <TextArea
                ref={input => this.description = input}
                type="text"
                name="description"
                placeholder="Description"
                defaultValue={this.props.description}
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
        </div>
    );
  }
}

ReliefMapForm.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  handleSubmit: PropTypes.func,

  createMap: PropTypes.func,
  pending: PropTypes.bool,
  error: PropTypes.bool,
};

const mapStateToProps = state => ({
  error: state.map.error,
  pending: state.map.pending,
  success: state.map.success,
});


export default connect(mapStateToProps)(ReliefMapForm);
