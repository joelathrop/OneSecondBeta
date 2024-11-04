// src/pages/Game.jsx
import { useMusic } from '../utils/MusicContext';
import { useState, useEffect } from 'react';


const Game = () => {

    // mount game
    const { musicKitInstance, selectedPlaylistId, selectedPlaylistTracks, MUT, gameMode } = useMusic();
    const [searchQuery, setSearchQuery] = useState('');
    const [songs, setSongs] = useState([]);
    const [shuffledQueue, setShuffledQueue] = useState([]);
    const [currentSongId, setCurrentSongId] = useState(null);
    let q;
    const [playTime, setPlayTime] = useState(1000);
    const [songCount, setSongCount] = useState(0);

    useEffect (() => {
        console.log('navigated to game');
    
        // check if playing with playlist or library
        if (selectedPlaylistId) {
            setSongs(selectedPlaylistTracks);
            setShuffledQueue([]);
            setCurrentSongId(null);
            setSongCount(0);
        } else {
            // playing with library
        }
    
        return () => console.log('unmounted game');
    }, [selectedPlaylistId, selectedPlaylistTracks]);

    useEffect(() => {
        if (songs.length > 0 && shuffledQueue.length === 0) {
            shuffleAndSetQueue(songs);
        }
    }, [songs]);

    useEffect(() => {
        
    }, [searchQuery]);

    const play = () => {
        // console.log(shuffledQueue[songCount].id);
        setCurrentSongId(shuffledQueue[songCount].id);

        if (songCount < shuffledQueue.length) {
            musicKitInstance.changeToMediaAtIndex(songCount).then(() => {
                console.log('playback started');
                setTimeout(() => {
                    musicKitInstance.stop();
                }, playTime);
            }).catch(error => {
                console.error('Error starting playback', error);
            });
        }
    }

    const handleGuess = (selectedSong) => {
        console.log(selectedSong.id);
        if (currentSongId === selectedSong.id) {
            console.log('guessed correctly');
            setPlayTime(1000);
            setSongCount(songCount + 1);
        }
    }

    const addTime = () => {
        if (gameMode === 1) {
            if (playTime < 10000) {
                setPlayTime(playTime + 1000);
            }
        } else if (gameMode === 2) {
            if (playTime < 3000) {
                setPlayTime(playTime + 2000);
            }
        }
    }

    /**
     * Shuffles a passed array
     * In our case this is the collection chosen, shuffles the songs
     * @param {Array} array 
     */
    const shuffleAndSetQueue = async (array) => {
        const shuffledArray = [...array];
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
        }

        setShuffledQueue(shuffledArray);
        
        try {
            q = (await musicKitInstance.setQueue({ items: shuffledArray }));
            // console.log('Playback queue set', q);
            setCurrentSongId(shuffledArray[0]?.id);
            console.log('current song id', shuffledArray[0]?.id);
        } catch (error) {
            console.log('Error setting playback queue', error);
        }
    };

    /**
     * Changes searchQuery variable to what's in the search bar
     * @param {event} event 
     */
    const handleInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    /**
     * Filters the displayed songs based on the search bar query
     */
    const filteredSongs = songs.filter(song =>
        song.attributes?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-blue-600 pt-20 relative">
    <h2 className="text-3xl font-semibold">Guess the Song</h2>
    
    {/* Play Button and Play Time on the Same Line */}
    <div className="flex items-center gap-4 mt-4">
      <button
        onClick={play}
        className="flex items-center justify-center px-5 py-2 bg-green-500 text-white rounded-full shadow hover:bg-green-600 transition"
        style={{
          fontSize: '18px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '4px', // Spacing between icon and text
        }}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          fill="currentColor" 
          viewBox="0 0 16 16"
          style={{ marginRight: '8px' }}  // Optional spacing adjustment
        >
          <path d="M10.804 8 5.198 3.5v9L10.804 8z"/>
        </svg>
        Play
      </button>

      <p style={{ fontSize: '18px', lineHeight: '1.6', color: 'white' }}>
        {playTime / 1000} {playTime / 1000 === 1 ? 'second' : 'seconds'}
      </p>

        {/* Add Time Button */}
        <button
            onClick={addTime}
            className="flex items-center justify-center px-3 py-2 mt-3 bg-blue-700 text-white font-semibold rounded-full shadow hover:bg-blue-800 transition"
            style={{
                display: 'flex',
                alignItems: 'center',
            }}
        >
        Add Time
        </button>
    </div>  

    {/* Search Bar */}
    <input
      type="text"
      placeholder='Search for a song...'
      value={searchQuery}
      onChange={handleInputChange}
      className='border border-gray-300 rounded p-2 mt-5 w-64'
    />

    {/* Song Buttons */}
    {searchQuery && filteredSongs.length > 0 && (
      <div 
        id="itemList" 
        style={{ 
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '10px',
          marginTop: '10px',
          maxHeight: '150px',
          overflowY: 'auto',
          border: '1px solid #ccc',
          padding: '10px',
          borderRadius: '5px',
          width: '300px'
        }}
      >   
        {filteredSongs
          .sort((a, b) => a.attributes.name.localeCompare(b.attributes.name))
          .map((song, index) => (
            <button
              key={`${song.id}-${index}`}
              data-id={song.id}
              className="button is-small is-focused is-dark is-link"
              onClick={() => handleGuess(song)}
              style={{ padding: '8px 12px', textAlign: 'center', flex: '1 0 45%' }}
            >
              {song.attributes.name}
            </button>
          ))}
      </div>
    )}

    {/* No Results */}
    {searchQuery && filteredSongs.length === 0 && (
      <p className="mt-3 text-white">No results found for "{searchQuery}".</p>
    )}
  </div>
);

};

export default Game;