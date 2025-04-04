import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NotFoundMessage = () => {
  const navigate = useNavigate();

  return (
    <Container className="mt-5 text-center">
      <h2>Bài hát không tồn tại</h2>
      <Button variant="primary" onClick={() => navigate('/')}>
        Quay lại danh sách
      </Button>
    </Container>
  );
};

export default NotFoundMessage;