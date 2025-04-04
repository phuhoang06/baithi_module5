import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ErrorMessage = ({ message }) => {
  const navigate = useNavigate();

  return (
    <Container className="mt-5 text-center">
      <h2>Đã xảy ra lỗi</h2>
      <p>{message}</p>
      <Button variant="primary" onClick={() => navigate('/')}>
        Quay lại danh sách
      </Button>
    </Container>
  );
};

export default ErrorMessage;