import React from 'react';

import ModalWrapper from '../ModalWrapper';
import UpdateEntityForm from './UpdateEntityForm';

const styles = {
  modal: {
    padding: '1rem',
    width: '40rem',
  },
};

export default props =>
  <ModalWrapper style={styles.modal} {...props}>
    <UpdateEntityForm />
  </ModalWrapper>;
