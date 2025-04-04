import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  selectFilteredSongs, 
  selectSearchTerm,
  selectStatus,
  selectError,
  setSearchTerm, 
  likeSong, 
  toggleStatus,
  fetchSongsAsync,
  updateSongAsync,
  addSong
} from '../redux/slices/songsSlice';
import { Table, Form, Container, Row, Col, Button, Alert, Spinner, Badge, Modal, Card } from 'react-bootstrap';

// Sub-component để hiển thị player header khi một bài hát được chọn
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

// Sub-component cho modal xác nhận công khai bài hát
const ConfirmationModal = ({ show, song, onConfirm, onClose }) => {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Xác nhận công khai</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Bạn có chắc chắn muốn công khai bài hát "<strong>{song?.title}</strong>" không?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Hủy
        </Button>
        <Button variant="success" onClick={onConfirm}>
          Xác nhận
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

// Sub-component cho thanh tìm kiếm
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

// Sub-component cho nút thêm bài hát mới
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

// Component chính
const SongList = () => {
  // Redux hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const songs = useSelector(selectFilteredSongs);
  const searchTerm = useSelector(selectSearchTerm);
  const status = useSelector(selectStatus);
  const error = useSelector(selectError);
  
  // Local state
  const [apiStatus, setApiStatus] = useState('checking');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [songToConfirm, setSongToConfirm] = useState(null);
  const [selectedSong, setSelectedSong] = useState(null);
  
  // Derived state
  const isLoading = status === 'loading';

  // ===== API và Data Loading =====
  
  // Kiểm tra kết nối API khi component mount
  useEffect(() => {
    const checkApiConnection = async () => {
      try {
        const response = await fetch('http://localhost:3001/songs');
        if (response.ok) {
          setApiStatus('connected');
          console.log('API connection successful');
        } else {
          setApiStatus('error');
          console.error('API connection error:', response.status, response.statusText);
        }
      } catch (err) {
        setApiStatus('error');
        console.error('API connection failed:', err);
      }
    };
    
    checkApiConnection();
  }, []);

  // Hàm để load dữ liệu từ localStorage
  const loadFromLocalStorage = useCallback(() => {
    try {
      const storedSongs = localStorage.getItem('spotifyCloneSongs');
      if (storedSongs) {
        const parsedSongs = JSON.parse(storedSongs);
        if (Array.isArray(parsedSongs) && parsedSongs.length > 0) {
          // Add each song to the store if not already present
          const currentSongIds = songs.map(s => s.id);
          parsedSongs.forEach(song => {
            if (!currentSongIds.includes(song.id)) {
              dispatch(addSong(song));
            }
          });
          console.log('Loaded songs from localStorage');
        }
      }
    } catch (err) {
      console.error('Error loading from localStorage:', err);
    }
  }, [dispatch, songs]);

  // Load songs khi component mount
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchSongsAsync())
        .then(resultAction => {
          // Nếu API fetch thất bại, thử load từ localStorage
          if (fetchSongsAsync.rejected.match(resultAction)) {
            console.log('API fetch failed, trying localStorage');
            loadFromLocalStorage();
          }
        });
    }
  }, [status, dispatch, loadFromLocalStorage]);

  // Hàm cập nhật localStorage
  const updateLocalStorage = useCallback((id, updates) => {
    try {
      const storedSongs = localStorage.getItem('spotifyCloneSongs');
      if (storedSongs) {
        let songs = JSON.parse(storedSongs);
        const index = songs.findIndex(song => song.id === id);
        
        if (index !== -1) {
          songs[index] = { ...songs[index], ...updates };
          localStorage.setItem('spotifyCloneSongs', JSON.stringify(songs));
        }
      }
    } catch (err) {
      console.error('Error updating localStorage:', err);
    }
  }, []);

  // ===== Event Handlers =====
  
  // Xử lý tìm kiếm
  const handleSearchChange = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  // Xử lý chọn bài hát để phát
  const handleSelectedSong = (song) => {
    setSelectedSong(song);
  };

  // Xử lý thích bài hát
  const handleLike = (id) => {
    const song = songs.find(s => s.id === id);
    if (song) {
      // Cập nhật UI ngay lập tức thông qua reducer
      dispatch(likeSong(id));
      
      // Tạo bản sao của bài hát với lượt like cập nhật
      const updatedSong = { ...song, likes: song.likes + 1 };
      
      // Cập nhật localStorage
      updateLocalStorage(id, { likes: updatedSong.likes });
      
      // Gọi API với dữ liệu bài hát đầy đủ
      dispatch(updateSongAsync({ 
        id, 
        songData: updatedSong 
      }))
      .catch(err => {
        console.warn('API update failed, data saved to localStorage only:', err);
      });
    }
  };

  // Xử lý click vào nút chuyển đổi trạng thái
  const handleToggleStatusClick = (song) => {
    if (song.status === 'Private') {
      // Hiển thị modal xác nhận trước khi công khai
      setSongToConfirm(song);
      setShowConfirmModal(true);
    } else {
      // Chuyển sang trạng thái lưu trữ trực tiếp
      performToggleStatus(song.id, 'Private');
    }
  };

  // Thực hiện chuyển đổi trạng thái
  const performToggleStatus = useCallback((id, newStatus) => {
    // Tìm bài hát hiện tại
    const song = songs.find(s => s.id === id);
    if (!song) return;
    
    // Cập nhật UI ngay lập tức
    dispatch(toggleStatus(id));
    
    // Tạo bản sao của bài hát với trạng thái đã cập nhật
    const updatedSong = { ...song, status: newStatus };
    
    // Cập nhật localStorage
    updateLocalStorage(id, { status: newStatus });
    
    console.log(`Trying to update song with ID ${id} to status: ${newStatus}`);
    
    // Gọi API với dữ liệu bài hát đầy đủ
    dispatch(updateSongAsync({ 
      id,
      songData: updatedSong 
    }))
    .catch(err => {
      console.warn('API update failed, data saved to localStorage only:', err);
    });
  }, [dispatch, songs, updateLocalStorage]);
  
  // Xử lý xác nhận chuyển đổi trạng thái
  const handleConfirmToggle = () => {
    if (songToConfirm) {
      performToggleStatus(songToConfirm.id, 'Public');
    }
    handleCloseModal();
  };

  // Đóng modal xác nhận
  const handleCloseModal = () => {
    setShowConfirmModal(false);
    setSongToConfirm(null);
  };

  // Xem chi tiết bài hát
  const handleViewDetails = (id) => {
    navigate(`/song/${id}`);
  };

  // Chuyển đến trang thêm bài hát mới
  const handleAddSong = () => {
    navigate('/add-song');
  };

  // Hiển thị loading spinner khi đang tải dữ liệu ban đầu
  if (status === 'loading' && songs.length === 0) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </Spinner>
        <p className="mt-2">Đang tải dữ liệu...</p>
      </Container>
    );
  }

  // Render component chính
  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4">Spotify Music Library</h1>
      
      {/* API Status Badge */}
      <div className="d-flex justify-content-center mb-3">
        <Badge bg={apiStatus === 'connected' ? 'success' : apiStatus === 'checking' ? 'warning' : 'danger'} className="p-2">
          {apiStatus === 'connected' ? 'API Connected' : 
           apiStatus === 'checking' ? 'Checking API Connection...' : 
           'API Disconnected (Using Local Data)'}
        </Badge>
      </div>
      
      {/* Error Alert */}
      {error && (
        <Alert variant="warning" className="mb-4">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      )}
      
      {/* Player Header */}
      <PlayerHeader 
        song={selectedSong} 
        onClose={() => setSelectedSong(null)} 
      />
      
      {/* Search Bar */}
      <SearchBar 
        searchTerm={searchTerm} 
        onChange={handleSearchChange} 
      />
      
      {/* Add Song Button */}
      <AddSongButton onClick={handleAddSong} />
      
      {/* Loading Indicator */}
      {isLoading && (
        <div className="text-center mb-3">
          <Spinner animation="border" size="sm" className="me-2" />
          Đang cập nhật...
        </div>
      )}
      
      {/* Songs Table */}
      <Table striped bordered hover responsive>
        <thead className="bg-dark text-white">
          <tr>
            <th className="text-center">STT</th>
            <th>Tên bài hát</th>
            <th>Ca sĩ</th>
            <th className="text-center">Thời gian phát</th>
            <th className="text-center">Lượt yêu thích</th>
            <th className="text-center">Trạng thái</th>
            <th className="text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song, index) => (
            <tr key={song.id} className={selectedSong && selectedSong.id === song.id ? 'table-primary' : ''}>
              <td className="text-center">{index + 1}</td>
              <td>
                <span 
                  className="text-primary" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleSelectedSong(song)}
                >
                  {song.title}
                </span>
              </td>
              <td>{song.artist}</td>
              <td className="text-center">{song.duration}</td>
              <td className="text-center">
                {song.likes}
                <Button 
                  variant="link" 
                  onClick={() => handleLike(song.id)}
                  className="ms-2 p-0"
                >
                  <i className="bi bi-heart-fill text-danger"></i>
                </Button>
              </td>
              <td className="text-center">
                <span className={`badge ${song.status === 'Public' ? 'bg-success' : 'bg-secondary'}`}>
                  {song.status === 'Public' ? 'Công khai' : 'Lưu trữ'}
                </span>
              </td>
              <td className="text-center">
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => handleSelectedSong(song)}
                  className="me-2"
                >
                  <i className="bi bi-play-fill"></i> Phát
                </Button>
                <Button 
                  variant={song.status === 'Public' ? 'warning' : 'success'} 
                  size="sm"
                  onClick={() => handleToggleStatusClick(song)}
                  className="me-2"
                >
                  {song.status === 'Public' ? 'Lưu trữ' : 'Công khai'}
                </Button>
                <Button 
                  variant="info" 
                  size="sm"
                  onClick={() => handleViewDetails(song.id)}
                >
                  Chi tiết
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      
      {/* Empty State */}
      {songs.length === 0 && !isLoading && (
        <div className="text-center mt-4">
          <p>Không tìm thấy bài hát nào.</p>
        </div>
      )}
      
      {/* Confirmation Modal */}
      <ConfirmationModal 
        show={showConfirmModal}
        song={songToConfirm}
        onConfirm={handleConfirmToggle}
        onClose={handleCloseModal}
      />
    </Container>
  );
};

export default SongList; 