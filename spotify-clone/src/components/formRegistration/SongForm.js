import React from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';

const SongForm = ({
  formData,
  handleChange,
  handleSubmit,
  validated,
  durationError,
  isLoading,
  navigate,
}) => (
  <Form noValidate validated={validated} onSubmit={handleSubmit}>
    <Form.Group className="mb-3">
      <Form.Label>Tên bài hát</Form.Label>
      <Form.Control
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
        placeholder="Nhập tên bài hát"
      />
      <Form.Control.Feedback type="invalid">
        Vui lòng nhập tên bài hát.
      </Form.Control.Feedback>
    </Form.Group>

    <Form.Group className="mb-3">
      <Form.Label>Ca sĩ</Form.Label>
      <Form.Control
        type="text"
        name="artist"
        value={formData.artist}
        onChange={handleChange}
        required
        maxLength={30}
        placeholder="Nhập tên ca sĩ (tối đa 30 ký tự)"
      />
      <Form.Control.Feedback type="invalid">
        Vui lòng nhập tên ca sĩ.
      </Form.Control.Feedback>
    </Form.Group>

    <Form.Group className="mb-3">
      <Form.Label>Nhạc sĩ</Form.Label>
      <Form.Control
        type="text"
        name="composer"
        value={formData.composer}
        onChange={handleChange}
        required
        maxLength={30}
        placeholder="Nhập tên nhạc sĩ (tối đa 30 ký tự)"
      />
      <Form.Control.Feedback type="invalid">
        Vui lòng nhập tên nhạc sĩ.
      </Form.Control.Feedback>
    </Form.Group>

    <Form.Group className="mb-3">
      <Form.Label>Thời gian phát (hh:mm)</Form.Label>
      <Form.Control
        type="text"
        name="duration"
        value={formData.duration}
        onChange={handleChange}
        required
        placeholder="Nhập thời gian phát (ví dụ: 03:45)"
        pattern="[0-9][0-9]:[0-5][0-9]"
        isInvalid={!!durationError}
      />
      <Form.Control.Feedback type="invalid">
        {durationError || 'Vui lòng nhập thời gian phát đúng định dạng hh:mm.'}
      </Form.Control.Feedback>
    </Form.Group>

    <Form.Group className="mb-3">
      <Form.Label>Số lượt yêu thích</Form.Label>
      <Form.Control
        type="number"
        name="likes"
        value={formData.likes}
        onChange={handleChange}
        min="0"
        disabled
      />
    </Form.Group>

    <Form.Group className="mb-3">
      <Form.Label>Trạng thái</Form.Label>
      <Form.Control
        as="select"
        name="status"
        value={formData.status}
        onChange={handleChange}
        disabled
      >
        <option value="Private">Lưu trữ</option>
        <option value="Public">Công khai</option>
      </Form.Control>
    </Form.Group>

    <div className="d-flex justify-content-between">
      <Button variant="secondary" onClick={() => navigate('/')}>
        Quay lại
      </Button>
      <Button variant="primary" type="submit" disabled={isLoading}>
        {isLoading ? (
          <>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              className="me-2"
            />
            Đang xử lý...
          </>
        ) : (
          'Đăng ký'
        )}
      </Button>
    </div>
  </Form>
);

export default SongForm;