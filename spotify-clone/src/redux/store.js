import { configureStore } from '@reduxjs/toolkit';
import songsReducer from './slices/songsSlice';

export const store = configureStore({
  reducer: {
    songs: songsReducer,
  },
}); 