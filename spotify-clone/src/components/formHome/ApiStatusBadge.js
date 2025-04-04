import React from 'react';
import { Badge } from 'react-bootstrap';

const ApiStatusBadge = ({ status }) => {
  let variant, text;
  switch (status) {
    case 'connected':
      variant = 'success';
      text = 'API Connected';
      break;
    case 'checking':
      variant = 'warning';
      text = 'Checking API Connection...';
      break;
    default:
      variant = 'danger';
      text = 'API Disconnected (Using Local Data)';
  }

  return (
    <div className="d-flex justify-content-center mb-3">
      <Badge bg={variant} className="p-2">
        {text}
      </Badge>
    </div>
  );
};

export default ApiStatusBadge;