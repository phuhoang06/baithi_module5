import React from 'react';
import { Container, Spinner } from 'react-bootstrap';

const LoadingSpinner = () => (
  <Container className="mt-5 text-center">
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Đang tải...</span>
    </Spinner>
    <p className="mt-2">Đang tải thông tin bài hát...</p>
  </Container>
);

export default LoadingSpinner;