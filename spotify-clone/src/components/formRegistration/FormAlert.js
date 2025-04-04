import React from 'react';
import { Alert } from 'react-bootstrap';

const FormAlert = ({ showSuccess, setShowSuccess, error, localError }) => (
  <>
    {showSuccess && (
      <Alert variant="success" onClose={() => setShowSuccess(false)} dismissible>
        Bài hát đã được đăng ký thành công!
      </Alert>
    )}
    {(error || localError) && (
      <Alert variant="danger">
        {localError || error}
      </Alert>
    )}
  </>
);

export default FormAlert;