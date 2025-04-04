// API base URL
const API_URL = 'http://localhost:3001';

// Default fetch options to handle CORS
const fetchOptions = {
  mode: 'cors',
  credentials: 'same-origin',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
};

// Get all songs
export const fetchSongs = async () => {
  try {
    console.log('Fetching songs from:', `${API_URL}/songs`);
    const response = await fetch(`${API_URL}/songs`, fetchOptions);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    console.log('Fetched songs successfully:', data.length);
    return data;
  } catch (error) {
    console.error('Error fetching songs:', error);
    throw error;
  }
};

// Add a new song
export const createSong = async (songData) => {
  try {
    console.log('Creating song:', songData);
    const response = await fetch(`${API_URL}/songs`, {
      ...fetchOptions,
      method: 'POST',
      body: JSON.stringify(songData),
    });
    
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Song created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error creating song:', error);
    throw error;
  }
};

// Update a song - COMPLETELY REWRITTEN
export const updateSong = async (id, songData) => {
  try {
    console.log(`Updating song ${id}:`, songData);
    
    // First, get the current song data to ensure we have all fields
    const getCurrentSong = async () => {
      const response = await fetch(`${API_URL}/songs/${id}`, fetchOptions);
      if (!response.ok) {
        throw new Error(`Could not fetch current song data: ${response.status}`);
      }
      return await response.json();
    };
    
    // Get current song and merge with updates
    let currentSong;
    try {
      currentSong = await getCurrentSong();
    } catch (error) {
      console.warn(`Couldn't fetch current song, using provided data only:`, error);
      currentSong = {}; // Fallback to empty object if fetch fails
    }
    
    // Merge current song with updates
    const mergedSongData = { ...currentSong, ...songData };
    
    console.log(`Sending complete song data:`, mergedSongData);
    
    // Now update with the complete song data
    const response = await fetch(`${API_URL}/songs/${id}`, {
      ...fetchOptions,
      method: 'PUT',
      body: JSON.stringify(mergedSongData),
    });
    
    if (!response.ok) {
      console.error(`Server response for update song ${id}:`, response.status, response.statusText);
      throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Song updated successfully:', data);
    return data;
  } catch (error) {
    console.error(`Error updating song with id ${id}:`, error);
    throw error;
  }
};

// Get a single song by ID
export const fetchSongById = async (id) => {
  try {
    console.log(`Fetching song with id ${id}`);
    const response = await fetch(`${API_URL}/songs/${id}`, fetchOptions);
    
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Song fetched successfully:', data);
    return data;
  } catch (error) {
    console.error(`Error fetching song with id ${id}:`, error);
    throw error;
  }
}; 