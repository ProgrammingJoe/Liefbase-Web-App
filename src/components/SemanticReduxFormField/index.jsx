import React from 'react';
import PropTypes from 'prop-types';

import { Input, Message } from 'semantic-ui-react';

export default class SemanticReduxFormField extends React.Component {
  static propTypes = {
    as: PropTypes.any,
    input: PropTypes.any,
    meta: PropTypes.any
  }

  handleChange = (e, { value }) => {
    this.props.input.onChange(value);
  }

  render() {
    const {
      input,
      as: As = Input
    } = this.props;

    const { meta, ...passThrough } = this.props;
    const { touched, error } = meta;

    const isError = Boolean(error);

    return (
      <div>
        <As {...input} value={input.value} {...passThrough} onChange={this.handleChange} error={touched && isError} />
        {
          touched && isError &&
            <Message
              negative
              content={error}
            />
        }
      </div>
    );
  }
}
