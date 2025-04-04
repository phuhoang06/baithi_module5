import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingIndicator = ({ isLoading, message = "Đang cập nhật..." }) => {
  if (!isLoading) return null;
  return (
    <div className="text-center mb-3">
      <Spinner animation="border" size="sm" className="me-2" />
      {message}
    </div>
  );
};

export default LoadingIndicator;