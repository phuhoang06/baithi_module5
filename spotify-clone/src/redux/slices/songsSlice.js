import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchSongs, createSong, updateSong } from '../../services/api';

// Async thunks
export const fetchSongsAsync = createAsyncThunk(
  'songs/fetchSongs',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchSongs();
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch songs');
    }
  }
);

export const addSongAsync = createAsyncThunk(
  'songs/addSong',
  async (songData, { rejectWithValue }) => {
    try {
      return await createSong(songData);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add song');
    }
  }
);

export const updateSongAsync = createAsyncThunk(
  'songs/updateSong',
  async ({ id, songData }, { rejectWithValue }) => {
    try {
      return await updateSong(id, songData);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update song');
    }
  }
);

// Initial state - starts with an empty songs array
const initialState = {
  songs: [],
  searchTerm: '',
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

export const songsSlice = createSlice({
  name: 'songs',
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    likeSong: (state, action) => {
      const song = state.songs.find(song => song.id === action.payload);
      if (song) {
        song.likes += 1;
      }
    },
    toggleStatus: (state, action) => {
      const song = state.songs.find(song => song.id === action.payload);
      if (song) {
        song.status = song.status === 'Public' ? 'Private' : 'Public';
      }
    },
    addSong: (state, action) => {
      // Prevent duplicates when loading from localStorage
      const existingSong = state.songs.find(song => song.id === action.payload.id);
      if (!existingSong) {
        state.songs.push(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch songs
      .addCase(fetchSongsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSongsAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Replace the songs array with the fetched data only if we got valid data
        if (action.payload && Array.isArray(action.payload)) { // Allow empty array from API
          state.songs = action.payload;
        }
        // Reset any previous errors
        state.error = null;
      })
      .addCase(fetchSongsAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Could not fetch songs from API.';
        // Keep songs array empty if fetch fails, rely on localStorage load in component
      })
      
      // Add song
      .addCase(addSongAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addSongAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload && action.payload.id) {
          state.songs.push(action.payload);
        }
        state.error = null;
      })
      .addCase(addSongAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to add song';
      })
      
      // Update song
      .addCase(updateSongAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateSongAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload && action.payload.id) {
          const index = state.songs.findIndex(song => song.id === action.payload.id);
          if (index !== -1) {
            state.songs[index] = action.payload;
          }
        }
        state.error = null;
      })
      .addCase(updateSongAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to update song';
      });
  },
});

// Actions
export const { setSearchTerm, likeSong, toggleStatus, addSong } = songsSlice.actions;

// Selectors
export const selectAllSongs = (state) => state.songs.songs;
export const selectSearchTerm = (state) => state.songs.searchTerm;
export const selectStatus = (state) => state.songs.status;
export const selectError = (state) => state.songs.error;

export const selectFilteredSongs = (state) => {
  const songs = state.songs.songs;
  const searchTerm = state.songs.searchTerm.toLowerCase();
  
  if (!searchTerm) return songs;
  
  return songs.filter(song => 
    song.title.toLowerCase().includes(searchTerm)
  );
};

export default songsSlice.reducer; 