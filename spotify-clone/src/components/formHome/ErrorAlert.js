import React from 'react';
import { Alert } from 'react-bootstrap';

const ErrorAlert = ({ error }) => {
  if (!error) return null;
  return (
    <Alert variant="warning" className="mb-4">
      <i className="bi bi-exclamation-triangle me-2"></i>
      {error}
    </Alert>
  );
};

export default ErrorAlert;