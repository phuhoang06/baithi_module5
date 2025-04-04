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
} from '../../redux/slices/songsSlice.js';
import { Container } from 'react-bootstrap';
import PlayerHeader from './PlayerHeader';
import ConfirmationModal from './ConfirmationModal';
import SearchBar from './SearchBar';
import AddSongButton from './AddSongButton';
import ApiStatusBadge from './ApiStatusBadge';
import ErrorAlert from './ErrorAlert';
import LoadingIndicator from './LoadingIndicator';
import SongsTable from './SongsTable';
import EmptyState from './EmptyState';

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

  // ===== Render Logic =====

  // Hiển thị loading spinner khi đang tải dữ liệu ban đầu
  if (status === 'loading' && songs.length === 0) {
    return (
      <Container className="mt-5 text-center">
        <LoadingIndicator isLoading={true} message="Đang tải dữ liệu..." />
      </Container>
    );
  }

  // Render component chính
  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4">Spotify Music Library</h1>
      
      <ApiStatusBadge status={apiStatus} />
      <SearchBar value={searchTerm} onChange={handleSearchChange} />
      <AddSongButton onClick={handleAddSong} />
      
      {error && <ErrorAlert message={error} />}
      
      {isLoading ? (
        <LoadingIndicator isLoading={true} message="Đang tải dữ liệu..." />
      ) : songs.length > 0 ? (
        <SongsTable 
          songs={songs} 
          onLike={handleLike} 
          onToggleStatus={handleToggleStatusClick} 
          onViewDetails={handleViewDetails} 
        />
      ) : (
        <EmptyState message="Không có bài hát nào để hiển thị." />
      )}
      
      <ConfirmationModal 
        show={showConfirmModal} 
        onConfirm={handleConfirmToggle} 
        onCancel={handleCloseModal} 
        message="Bạn có chắc chắn muốn công khai bài hát này không?" 
      />
    </Container>
  );
};

export default SongList;