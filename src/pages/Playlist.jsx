// src/pages/Music.jsx
import React, { useState, useEffect, createContext, useContext } from 'react';
import { useMusic } from '../utils/MusicContext';
import '../App';
import { useNavigate } from 'react-router-dom';
// import AuthorizeLink from '../components/AuthorizeLink';

const Playlist = () => {
  const[searchQuery, setSearchQuery] = useState('');
  const { MUT, setAllPlaylists, allPlaylists, selectedPlaylistId, setSelectedPlaylistId, selectedPlaylistTracks, setSelectedPlaylistTracks } = useMusic();
  const developerToken = import.meta.env.VITE_DEVELOPER_TOKEN;
  const playlistsURL = 'https://api.music.apple.com/v1/me/library/playlists?limit=100';
  const navigate = useNavigate();
  // const [selectedPlaylistId, setSelectedPlaylistId] = useState('');

  // mount playlists route
  useEffect (() => {
    console.log('navigated to playlists page');

    fetchPlaylists();

    return () => {
      console.log('unmounted playlist');
    }
  }, [MUT]);

  // playlist songs callback
  useEffect(() => {
    console.log('Selected playlist id: ', selectedPlaylistId);
    console.log('Total tracks in the playlist:', selectedPlaylistTracks.length);
    console.log(selectedPlaylistTracks);
  }, [selectedPlaylistId, selectedPlaylistTracks]);

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

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
    console.log('dev token', developerToken);
    console.log('MUT: ', MUT);

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

        console.log('# of playlists: ', updatedPlaylists.length);

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
    // reset playlist arrays
    setSelectedPlaylistTracks([]);
    fetch(url, {
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
      if (data.data.length <= 100) {  // TODO: There's gotta be a better way to do this but how
          setSelectedPlaylistTracks(prevPlaylistTracks => [...prevPlaylistTracks, ...data.data]);
          fetchPlaylistSongsPage(`https://api.music.apple.com/v1/me/library/playlists/${selectedPlaylistId}/tracks?offset=${offset}`);
          offset += 100;
          console.log('offset' + offset);

      }
      //  else {
      //     console.log('Total tracks in the playlist:', selectedPlaylistTracks.length);
      // }
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
      <div id="itemList" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
        {filteredPlaylists.map((playlist) => (
          <button
          key={playlist.id}
          data-id={playlist.id}
          className="button is-small is-focused is-dark is-link"
          onClick={() => {
            setSelectedPlaylistId(playlist.id); 
            fetchPlaylistSongs(playlist.id); 
            // console.log('playlist id: ', selectedPlaylistId);
            // console.log('total tracks in playlist again', selectedPlaylistTracks.length);
            // navigate('/game');
          }}
          style={{ padding: '8px 12px', textAlign: 'center' }}
        >
          {playlist.attributes.name}
        </button>
        ))}
      </div>
    </div>
  );
};

export default Playlist;
