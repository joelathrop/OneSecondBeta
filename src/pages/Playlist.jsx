// src/pages/Music.jsx
import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import { useMusic } from '../utils/MusicContext';
import '../App';
import { useNavigate } from 'react-router-dom';
import { GiConsoleController } from 'react-icons/gi';
// import AuthorizeLink from '../components/AuthorizeLink';

const Playlist = () => {
  const[searchQuery, setSearchQuery] = useState('');
  const { MUT, setAllPlaylists, allPlaylists, selectedPlaylistId, setSelectedPlaylistId, selectedPlaylistTracks, setSelectedPlaylistTracks, gameMode } = useMusic();
  const developerToken = import.meta.env.VITE_DEVELOPER_TOKEN;
  const playlistsURL = 'https://api.music.apple.com/v1/me/library/playlists?limit=100';
  const offsetRef = useRef(0);
  const navigate = useNavigate();
  const [play, setPlay] = useState(false);
  // const [selectedPlaylistId, setSelectedPlaylistId] = useState('');

  // mount playlists route
  useEffect (() => {
    console.log('navigated to playlists page');
    console.log('gamemode:', gameMode);

    setSelectedPlaylistTracks([]);
    fetchPlaylists();

    return () => {
      console.log('unmounted playlist');
    }
  }, [MUT]);

  /**
   * Callback for selecting a playlist
   */
  useEffect(() => {
    // console.log('Selected playlist id: ', selectedPlaylistId);
    // console.log('Total tracks in the playlist:', selectedPlaylistTracks.length);
    // console.log(selectedPlaylistTracks);
  }, [selectedPlaylistTracks, selectedPlaylistId]);

  /**
   * Changes searchQuery variable to what's in the search bar
   * @param {event} event 
   */
  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  /**
   * Filters the playlists based on search query
   */
  const filteredPlaylists = allPlaylists.filter(playlist =>
    playlist.attributes?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchPlaylists = () => {
    
    // checking user authentication
    if (!MUT) {
      console.error('MUT is undefined');
      return;
    }

    // call pagination fetch
    console.log('fetching playlists');
    // reset allPlaylists
    setAllPlaylists([]);
    fetchPlaylistsPage(playlistsURL);
  }

  /**
   * Fetches next page of playlists
   * 
   * @param {nextUrl} nextUrl 
   */
  const fetchPlaylistsPage = (nextUrl) => {
    // console.log('dev token', developerToken);
    // console.log('MUT: ', MUT);

    fetch(nextUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${developerToken}`,
        'Music-User-Token': MUT
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response not ok');
      }
      return response.json();
    })
    .then(data => {
      setAllPlaylists(prevPlaylists => {
        const updatedPlaylists = [...prevPlaylists, ...data.data]

        // fetch next page
        if (data.next) {
          fetchPlaylists(data.next);
        }
        return updatedPlaylists;
      });
    })
    .catch(error => {
      console.error('Error fetching playlists: ', error);
    })
  }

  const fetchPlaylistSongs = (playlistId) => {
    const url = `https://api.music.apple.com/v1/me/library/playlists/${playlistId}/tracks`;
    fetchPlaylistSongsPage(url);
  }

  const fetchPlaylistSongsPage = (url) => {
    // reset playlist arrays ?? can't do this because this is recursive
    // setSelectedPlaylistTracks([]);
    fetch(`${url}?offset=${offsetRef.current}`, {
      method: 'GET',
        headers: {
            'Authorization': `Bearer ${developerToken}`,
            'Music-User-Token': MUT
        }
    })
    .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      setSelectedPlaylistTracks(prevTracks => [...prevTracks, ...data.data]);

      if (data.data.length === 100) {
        offsetRef.current += 100;
        fetchPlaylistSongsPage(url);
      } else {
        offsetRef.current = 0;
        navigate('/game');
      }
    })
    .catch(error => {
        console.log('Error fetching playlist songs; may have reached end of playlist pagination:', error);
        // console.log('Total tracks in the playlist:', selectedPlaylistTracks.length);
    });
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-blue-600 pt-20 relative">
      <h2 className="text-3xl font-semibold">Play with a Playlist</h2>

      {/* Search Bar */}
      <input 
        type="text"
        placeholder='Search for a playlist...'
        value={searchQuery}
        onChange={handleInputChange}
        className='border border-gray-300 rounded p-2 mr-2'
      />

      {/* Playlist Buttons */}
      <div 
        id="itemList" 
        style={{ 
          display: 'flex', 
          flexDirection: 'row', // Set to row to allow wrapping into columns
          flexWrap: 'wrap', // Allow wrapping to create multiple columns
          gap: '10px', 
          width: '500px',
          marginTop: '10px',
          maxHeight: '150px', // Fixed height
          overflowY: 'auto', // Enable vertical scrolling
          border: '1px solid #ccc', // Optional: border for the box
          padding: '10px', // Optional: padding inside the box
          borderRadius: '5px' // Optional: rounded corners
        }}
          >
        {filteredPlaylists.map((playlist) => (
          <button
          key={playlist.id}
          data-id={playlist.id}
          className="button is-small is-focused is-dark is-link"
          onClick={() => {
            setSelectedPlaylistId(playlist.id); 
            fetchPlaylistSongs(playlist.id);
          }}
          style={{ 
            width: 'calc(50% - 5px)', // Width for two columns with gap
            padding: '8px 12px', 
            textAlign: 'center' 
          }}
        >
          {playlist.attributes.name}
        </button>
        ))}
      </div>
    </div>
  );
};

export default Playlist;
