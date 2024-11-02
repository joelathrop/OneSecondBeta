import React, { createContext, useContext, useEffect, useState } from 'react';

const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
    const [musicKitInstance, setMusicKitInstance] = useState(null);
    const [MUT, setMUT] = useState(localStorage.getItem('MUT') || null);
    const [allPlaylists, setAllPlaylists] = useState([]);
    const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
    const [selectedPlaylistTracks, setSelectedPlaylistTracks] = useState([]);
    const developerToken = import.meta.env.VITE_DEVELOPER_TOKEN;
  
    useEffect(() => {
        async function configureMusicKit() {
            await MusicKit.configure({
                developerToken: developerToken,
                app: {
                    name: 'MusicKit Example',
                    build: '1978.4.1'
                }
            });

            const music = MusicKit.getInstance();
            setMusicKitInstance(music);

            if (!music) {
                console.log("Error initializing MusicKit Instance");
            } else {
                console.log('Successfully initialized MusicKit', music);
            }
        }

        configureMusicKit();
    }, [developerToken]);

    useEffect(() => {
        console.log('MusicKit instance:', musicKitInstance);
    }, [musicKitInstance]);

    return (
        // Set things in here that you want to be able to get across pages
        <MusicContext.Provider value={{ musicKitInstance, MUT, setMUT, allPlaylists, 
            setAllPlaylists, setSelectedPlaylistId, selectedPlaylistId, selectedPlaylistTracks, setSelectedPlaylistTracks }}>
            {children}
        </MusicContext.Provider>
    );
};

export const useMusic = () => {
    return useContext(MusicContext);
};