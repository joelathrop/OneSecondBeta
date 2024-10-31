// src/pages/Music.jsx
import React, { useState, useEffect, createContext, useContext } from 'react';
import { useMusic } from '../utils/MusicContext';
import AuthorizeLink from '../components/AuthorizeLink';

const Playlist = () => {
  const[searchQuery, setSearchQuery] = useState('');
  const {music, setMUT, MUT, setAllPlaylists, allPlaylists } = useMusic();
  const developerToken = import.meta.env.VITE_DEVELOPER_TOKEN;
  const playlistsURL = 'https://api.music.apple.com/v1/me/library/playlists?limit=100';

  // let [allPlaylists, setAllPlaylists] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState('');

  // mount playlists route
  useEffect (() => {
    console.log('navigated to playlists page');

    fetchPlaylists();

    return () => {
      console.log('unmounted...?');
    }
  }, [MUT]);

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

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
      // allPlaylists.push(...data.data);
      setAllPlaylists(prevPlaylists => [...prevPlaylists, ...data.data]);
      if (data.next) {
        fetchPlaylists(data.next);
      } else {
        console.log('Number of playlists: ' + allPlaylists.length);
        // call displayitems
        displayItems(allPlaylists);
      }
    })
    .catch(error => {
      console.error('Error fetching playlists: ', error);
    })
  }

  function displayItems(items) {
    const itemList = document.getElementById('itemList');
    itemList.innerHTML = '';

    items.forEach(playlist => {
      const playlistButton = document.createElement('playlistButton');

      playlistButton.textContent = item.attributes.name;
      playlistButton.setAttribute('data-id', item.id);
      playlistButton.classList.add('button', 'is-small', 'is-focused', 'is-dark', 'is-link');
      playlistButton.addEventListener('click', () => {
        setSelectedPlaylistId(playlist.id);
        itemList.innerHTML = '';

        // route?
      });
      itemList.appendChild(playlistButton);
    });
  }

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
      <section className="section">
        <div className="container">
          <ul id="itemList" className="mt-4"></ul>
        </div>
      </section>
    </div>
  );
};

export default Playlist;
