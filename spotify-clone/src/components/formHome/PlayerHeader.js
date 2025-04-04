import React from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';

const PlayerHeader = ({ song, onClose }) => {
  if (!song) return null;

  return (
    <Card className="mb-4 bg-dark text-white player-header">
      <Card.Body>
        <Row>
          <Col xs={10}>
            <h5>
              <i className="bi bi-music-note-beamed me-2"></i>
              <strong>{song.title}</strong>
            </h5>
            <p className="mb-0">Ca sĩ: {song.artist}</p>
          </Col>
          <Col xs={2} className="d-flex align-items-center justify-content-end">
            <Button variant="outline-light" size="sm" onClick={onClose}>
              <i className="bi bi-x-lg"></i>
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default PlayerHeader;