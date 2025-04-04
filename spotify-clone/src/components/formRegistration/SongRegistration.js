import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addSongAsync, selectStatus, selectError, addSong } from '../../redux/slices/songsSlice';
import { Container, Row, Col, Card } from 'react-bootstrap';
import FormHeader from './FormHeader';
import FormAlert from './FormAlert';
import SongForm from './SongForm';

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

  const [durationError, setDurationError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'duration') {
      setDurationError('');
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateDuration = (duration) => {
    const regex = /^([0-9][0-9]):([0-5][0-9])$/;
    if (!regex.test(duration)) {
      setDurationError('Thời gian phát phải đúng định dạng hh:mm (ví dụ: 03:45)');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    const form = e.currentTarget;
    const durationValid = validateDuration(formData.duration);

    if (!durationValid || !form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    const newSong = {
      ...formData,
      likes: parseInt(formData.likes),
    };

    try {
      const resultAction = await dispatch(addSongAsync(newSong));
      if (addSongAsync.rejected.match(resultAction)) {
        console.warn('API save failed, using localStorage fallback');
        const savedLocally = saveToLocalStorage(newSong);
        if (!savedLocally) {
          return;
        }
      }
      setShowSuccess(true);
      setFormData({
        title: '',
        artist: '',
        composer: '',
        duration: '',
        likes: 0,
        status: 'Private',
      });
      setValidated(false);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Failed to save the song: ', err);
      setLocalError('An unexpected error occurred. Please try again.');
    }
  };

  const saveToLocalStorage = (song) => {
    try {
      const existingSongsJSON = localStorage.getItem('spotifyCloneSongs');
      let songs = [];
      if (existingSongsJSON) {
        songs = JSON.parse(existingSongsJSON);
      }
      const newSong = {
        ...song,
        id: Date.now(),
      };
      songs.push(newSong);
      localStorage.setItem('spotifyCloneSongs', JSON.stringify(songs));
      dispatch(addSong(newSong));
      return true;
    } catch (err) {
      console.error('Error saving to localStorage:', err);
      setLocalError('Failed to save song locally. Please try again.');
      return false;
    }
  };

  const isLoading = status === 'loading';

  return (
    <Container className="mt-4">
      <Row>
        <Col md={8} className="mx-auto">
          <Card>
            <FormHeader />
            <Card.Body>
              <FormAlert
                showSuccess={showSuccess}
                setShowSuccess={setShowSuccess}
                error={error}
                localError={localError}
              />
              <SongForm
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                validated={validated}
                durationError={durationError}
                isLoading={isLoading}
                navigate={navigate}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SongRegistration;