import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectAllSongs, fetchSongsAsync, selectStatus } from '../../redux/slices/songsSlice';
import { fetchSongById } from '../../services/api';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import NotFoundMessage from './NotFoundMessage';
import SongInfo from './SongInfo';

const SongDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const songs = useSelector(selectAllSongs);
  const status = useSelector(selectStatus);
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      const songId = parseInt(id);
      const songInStore = !isNaN(songId) ? songs.find(s => s.id === songId) : null;

      if (songInStore) {
        setSong(songInStore);
        setLoading(false);
        return;
      }

      if (status === 'loading') {
        return;
      }

      const songFromLocalStorage = getSongFromLocalStorage(songId);
      if (songFromLocalStorage) {
        setSong(songFromLocalStorage);
        setLoading(false);
        return;
      }

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

    if (songs.length === 0 && status === 'idle') {
      dispatch(fetchSongsAsync()).then(() => loadSong());
    } else {
      loadSong();
    }
  }, [id, songs, status, dispatch]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!song) return <NotFoundMessage />;
  return <SongInfo song={song} />;
};

export default SongDetail;