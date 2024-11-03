// src/pages/Game.jsx
import { useMusic } from '../utils/MusicContext';
import { useState, useEffect } from 'react';


const Game = () => {

    // mount game
    const { musicKitInstance, selectedPlaylistId, selectedPlaylistTracks, MUT } = useMusic();
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
        if (playTime < 10000) {
            setPlayTime(playTime + 1000);
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
            {/* Play Button */}
            <button 
                className="button is-success is-fullwidth"
                onClick={play}
            >Play</button>

            {/* Add Time Button */}
            <button 
                className="button is-success is-fullwidth"
                onClick={addTime}
            >Add Time</button>

            {/* Search Bar */}
            <input 
                type="text"
                placeholder='Search for a song...'
                value={searchQuery}
                onChange={handleInputChange}
                className='border border-gray-300 rounded p-2 mr-2'
            />

            {/* Song Buttons */}
            {searchQuery && filteredSongs.length > 0 && (
                <div 
                    id="itemList" 
                    style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '10px', 
                        marginTop: '10px',
                        maxHeight: '150px', // Set the height limit for the box
                        overflowY: 'auto', // Enable vertical scrolling
                        border: '1px solid #ccc', // Optional: add a border to the box
                        padding: '10px', // Optional: add some padding
                        borderRadius: '5px' // Optional: rounded corners
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
                        style={{ padding: '8px 12px', textAlign: 'center' }}
                    >
                        {song.attributes.name}
                    </button>
                    ))}
                </div>
            )}

            {/* no results */}
            {searchQuery && filteredSongs.length === 0 && (
                <p>No results found for "{searchQuery}".</p>
            )}
        </div>
    );
};

export default Game;