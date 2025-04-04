import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addSongAsync, selectStatus, selectError, addSong } from '../redux/slices/songsSlice';
import { Form, Button, Container, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';

const SongRegistration = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const status = useSelector(selectStatus);
  const error = useSelector(selectError);
  
  const [validated, setValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    composer: '',
    duration: '',
    likes: 0,
    status: 'Private',
  });
  
  // For custom duration validation
  const [durationError, setDurationError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Reset duration error when the user changes the duration input
    if (name === 'duration') {
      setDurationError('');
    }
    
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateDuration = (duration) => {
    // Regular expression for hh:mm format (00:00 to 99:59)
    const regex = /^([0-9][0-9]):([0-5][0-9])$/;
    
    if (!regex.test(duration)) {
      setDurationError('Thời gian phát phải đúng định dạng hh:mm (ví dụ: 03:45)');
      return false;
    }
    
    return true;
  };

  // Fallback function to save song to localStorage if API fails
  const saveToLocalStorage = (song) => {
    try {
      // Get existing songs from localStorage
      const existingSongsJSON = localStorage.getItem('spotifyCloneSongs');
      let songs = [];
      
      if (existingSongsJSON) {
        songs = JSON.parse(existingSongsJSON);
      }
      
      // Generate an ID if one doesn't exist
      const newSong = {
        ...song,
        id: Date.now(), // Use timestamp as ID
      };
      
      // Add the new song
      songs.push(newSong);
      
      // Save back to localStorage
      localStorage.setItem('spotifyCloneSongs', JSON.stringify(songs));
      
      // Add to Redux store directly
      dispatch(addSong(newSong));
      
      return true;
    } catch (err) {
      console.error('Error saving to localStorage:', err);
      setLocalError('Failed to save song locally. Please try again.');
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear any previous errors
    setLocalError(null);
    
    // Validate form
    const form = e.currentTarget;
    
    // Custom validation for duration
    const durationValid = validateDuration(formData.duration);
    
    if (!durationValid || !form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    // Create a new song (without id, the API will generate it)
    const newSong = {
      ...formData,
      likes: parseInt(formData.likes)
    };
    
    // Dispatch async action to add song to API
    try {
      const resultAction = await dispatch(addSongAsync(newSong));
      
      if (addSongAsync.rejected.match(resultAction)) {
        // API call failed, try localStorage fallback
        console.warn('API save failed, using localStorage fallback');
        const savedLocally = saveToLocalStorage(newSong);
        
        if (!savedLocally) {
          // Both API and localStorage failed
          return;
        }
      }
      
      // Show success message
      setShowSuccess(true);
      
      // Reset form
      setFormData({
        title: '',
        artist: '',
        composer: '',
        duration: '',
        likes: 0,
        status: 'Private',
      });
      setValidated(false);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Failed to save the song: ', err);
      setLocalError('An unexpected error occurred. Please try again.');
    }
  };

  const isLoading = status === 'loading';

  return (
    <Container className="mt-4">
      <Row>
        <Col md={8} className="mx-auto">
          <Card>
            <Card.Header className="bg-dark text-white">
              <h2>Đăng ký bài hát mới</h2>
            </Card.Header>
            <Card.Body>
              {showSuccess && (
                <Alert variant="success" onClose={() => setShowSuccess(false)} dismissible>
                  Bài hát đã được đăng ký thành công!
                </Alert>
              )}
              
              {(error || localError) && (
                <Alert variant="danger">
                  {localError || error}
                </Alert>
              )}
              
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
                  <Button 
                    variant="primary" 
                    type="submit"
                    disabled={isLoading}
                  >
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
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SongRegistration; 