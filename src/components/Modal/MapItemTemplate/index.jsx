import React from 'react';

import ModalWrapper from '../ModalWrapper';
import MapItemTemplateForm from './Form';

const styles = {
  modal: {
    padding: '1rem',
    width: '40rem',
  },
};

export default props =>
  <ModalWrapper style={styles.modal} {...props}>
    <MapItemTemplateForm />
  </ModalWrapper>;
