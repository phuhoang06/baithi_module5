import React from 'react';
import { Row, Col, Form } from 'react-bootstrap';

const SearchBar = ({ searchTerm, onChange }) => {
  return (
    <Row className="mb-4">
      <Col md={6} className="mx-auto">
        <Form.Group>
          <Form.Control
            type="text"
            placeholder="Tìm kiếm bài hát..."
            value={searchTerm}
            onChange={onChange}
            className="search-input"
          />
        </Form.Group>
      </Col>
    </Row>
  );
};

export default SearchBar;