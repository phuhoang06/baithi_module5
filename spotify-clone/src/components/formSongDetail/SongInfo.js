import React from 'react';
import { Card, Row, Col, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const SongInfo = ({ song }) => {
  const navigate = useNavigate();

  return (
    <Container className="mt-4">
      <Button
        variant="outline-secondary"
        className="mb-4"
        onClick={() => navigate('/')}
      >
        &larr; Quay lại danh sách
      </Button>

      <Row>
        <Col md={8} className="mx-auto">
          <Card>
            <Card.Header className="bg-dark text-white">
              <h2>{song.title}</h2>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col md={4} className="fw-bold">Ca sĩ:</Col>
                <Col md={8}>{song.artist}</Col>
              </Row>
              <Row className="mb-3">
                <Col md={4} className="fw-bold">Nhạc sĩ:</Col>
                <Col md={8}>{song.composer}</Col>
              </Row>
              <Row className="mb-3">
                <Col md={4} className="fw-bold">Thời gian phát:</Col>
                <Col md={8}>{song.duration}</Col>
              </Row>
              <Row className="mb-3">
                <Col md={4} className="fw-bold">Lượt yêu thích:</Col>
                <Col md={8}>{song.likes}</Col>
              </Row>
              <Row className="mb-3">
                <Col md={4} className="fw-bold">Trạng thái:</Col>
                <Col md={8}>
                  <span className={`badge ${song.status === 'Public' ? 'bg-success' : 'bg-secondary'}`}>
                    {song.status === 'Public' ? 'Công khai' : 'Lưu trữ'}
                  </span>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SongInfo;