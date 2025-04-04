import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { selectAllSongs, fetchSongsAsync, selectStatus } from '../redux/slices/songsSlice';
import { fetchSongById } from '../services/api';
import { Card, Container, Row, Col, Button, Spinner } from 'react-bootstrap';

const SongDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const songs = useSelector(selectAllSongs);
  const status = useSelector(selectStatus);
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Try to find the song in localStorage
  const getSongFromLocalStorage = (songId) => {
    try {
      const storedSongs = localStorage.getItem('spotifyCloneSongs');
      if (storedSongs) {
        const songs = JSON.parse(storedSongs);
        return songs.find(s => s.id === songId);
      }
    } catch (err) {
      console.error('Error reading from localStorage:', err);
    }
    return null;
  };
  
  useEffect(() => {
    const loadSong = async () => {
      setLoading(true);
      
      // Try to find the song in the Redux store first
      const songId = parseInt(id);
      const songInStore = !isNaN(songId) ? songs.find(s => s.id === songId) : null;
      
      if (songInStore) {
        setSong(songInStore);
        setLoading(false);
        return;
      }
      
      // If songs are still loading in the store, wait for them
      if (status === 'loading') {
        return;
      }
      
      // Try to find the song in localStorage
      const songFromLocalStorage = getSongFromLocalStorage(songId);
      if (songFromLocalStorage) {
        setSong(songFromLocalStorage);
        setLoading(false);
        return;
      }
      
      // If song is not in the store, localStorage, and store is not loading, try to fetch it directly
      try {
        const fetchedSong = await fetchSongById(songId);
        setSong(fetchedSong);
      } catch (err) {
        setError('Không thể tải thông tin bài hát. Vui lòng thử lại sau.');
        console.error('Error fetching song:', err);
      } finally {
        setLoading(false);
      }
    };
    
    // If the store is empty, fetch all songs first
    if (songs.length === 0 && status === 'idle') {
      dispatch(fetchSongsAsync())
        .then(resultAction => {
          // Even if the fetch fails, try to load the specific song
          loadSong();
        });
    } else {
      loadSong();
    }
  }, [id, songs, status, dispatch]);
  
  // Update loading status based on Redux store loading status
  useEffect(() => {
    if (status !== 'loading' && loading && songs.length > 0) {
      const songId = parseInt(id);
      const songInStore = !isNaN(songId) ? songs.find(s => s.id === songId) : null;
      
      if (songInStore) {
        setSong(songInStore);
        setLoading(false);
      }
    }
  }, [status, songs, id, loading]);

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </Spinner>
        <p className="mt-2">Đang tải thông tin bài hát...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5 text-center">
        <h2>Đã xảy ra lỗi</h2>
        <p>{error}</p>
        <Button variant="primary" onClick={() => navigate('/')}>
          Quay lại danh sách
        </Button>
      </Container>
    );
  }

  if (!song) {
    return (
      <Container className="mt-5 text-center">
        <h2>Bài hát không tồn tại</h2>
        <Button variant="primary" onClick={() => navigate('/')}>
          Quay lại danh sách
        </Button>
      </Container>
    );
  }

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

export default SongDetail; 