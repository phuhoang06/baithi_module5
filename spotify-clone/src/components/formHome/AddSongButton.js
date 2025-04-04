import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';

const AddSongButton = ({ onClick }) => {
  return (
    <Row className="mb-4">
      <Col className="d-flex justify-content-end">
        <Button 
          variant="success" 
          onClick={onClick}
          className="d-flex align-items-center"
        >
          <i className="bi bi-plus-circle me-2"></i>
          Thêm bài hát mới
        </Button>
      </Col>
    </Row>
  );
};

export default AddSongButton;