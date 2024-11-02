// src/pages/Game.jsx
import { useMusic } from '../utils/MusicContext';
import { useState, useEffect } from 'react';


const Game = () => {

    // mount game
    const { musicKitInstance, selectedPlaylistId, selectedPlaylistTracks, MUT } = useMusic();
    const [songs, setSongs] = useState([]);

    useEffect (() => {
        console.log('navigated to game');
    
        // check if playing with playlist or library
        if (selectedPlaylistId) {
            setSongs(selectedPlaylistTracks);
            console.log(selectedPlaylistTracks);
        }
    
        return () => {
          console.log('unmounted game');
        }
    }, [MUT]);

    const playGame = () => {
        
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-blue-600 pt-20 relative">
          <h2 className="text-3xl font-semibold">Guess the Song</h2>
        </div>
      );
};

export default Game;