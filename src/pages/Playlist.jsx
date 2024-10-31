// src/pages/Music.jsx
import React, { useState } from 'react';
import { useMusic } from '../MusicContext';
import Home from './Home';

const Playlist = () => {
  const[searchQuery, setSearchQuery] = useState('');
  const music = useMusic();
  const developerToken = import.meta.env.VITE_DEVELOPER_TOKEN;
  const MUT = Home.MUT;
  const playlistsURL = 'https://api.music.apple.com/v1/me/library/playlists?limit=100';

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const fetchPlaylistsPage = (searchQuery) => {
    // fetch playlists
    fetch(playlistsURL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${developerToken}`,
        'Music-User-Token': MUT
      }
    })
  }
  fetchPlaylistsPage


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-blue-600 pt-20 relative">
      <h2 className="text-3xl font-semibold">Play with a Playlist</h2>
      <input 
        type="text"
        placeholder='Search for a playlist...'
        value={searchQuery}
        onChange={handleInputChange}
        className='border border-gray-300 rounded p-2 mr-2'
      />
    </div>
  );
};

export default Playlist;
