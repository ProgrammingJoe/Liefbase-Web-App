import React from 'react';

import ModalWrapper from '../ModalWrapper';
import SignInForm from './Form';

const styles = {
  modal: {
    padding: '1rem',
    width: '20rem',
  }
};

export default props =>
  <ModalWrapper style={styles.modal} {...props}>
    <SignInForm />
  </ModalWrapper>;
