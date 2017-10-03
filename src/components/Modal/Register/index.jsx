import React from 'react';

import ModalWrapper from '../ModalWrapper';
import RegisterForm from "./Form";

const styles = {
  modal: {
    padding: '1rem',
    width: '25rem',
  }
};

export default props =>
  <ModalWrapper style={styles.modal} {...props}>
    <RegisterForm />
  </ModalWrapper>;
