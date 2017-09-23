import React from 'react';

import ModalWrapper from '../ModalWrapper';
import RegisterForm from "./RegisterForm";

const styles = {
  modal: {
    padding: '1rem',
    width: '25rem',
  }
};

const RegisterModal = props => {
  return (
    <ModalWrapper style={styles.modal} {...props}>
      <RegisterForm />
    </ModalWrapper>
  );
};

export default RegisterModal;
