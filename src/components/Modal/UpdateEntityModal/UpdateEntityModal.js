import React from 'react';

import ModalWrapper from '../ModalWrapper';
import UpdateEntityForm from './components/UpdateEntityForm';

const styles = {
  modal: {
    padding: '1rem',
    width: '40rem',
  },
};

const UpdateEntityModal = props => (
  <ModalWrapper style={styles.modal} {...props}>
    <UpdateEntityForm />
  </ModalWrapper>
);

export default UpdateEntityModal;
