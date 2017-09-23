import React from 'react';

import ModalWrapper from '../ModalWrapper';
import ReliefMapForm from './ReliefMapForm';

const styles = {
  modal: {
    padding: '1rem',
    width: '40rem',
  }
};

const ReliefMapModal = props => {
  return (
    <ModalWrapper style={styles.modal} {...props}>
      <ReliefMapForm {...props} />
    </ModalWrapper>
  );
};


export default ReliefMapModal;
