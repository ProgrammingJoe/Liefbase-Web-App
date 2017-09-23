import React from 'react';

import ModalWrapper from '../ModalWrapper';
import SignInForm from './components/SignInForm';

const styles = {
  modal: {
    padding: '1rem',
    width: '20rem',
  }
};

const SignInModal = props => {
  return (
    <ModalWrapper style={styles.modal} {...props}>
      <SignInForm />
    </ModalWrapper>
  );
};

export default SignInModal;
