import React, { createContext, useContext, useEffect, useState } from 'react';

const MusicContext = createContext(null);

export const MusicProvider = ({ children, music }) => {
    const [musicKitInstance, setMusicKitInstance] = useState(null);
    const developerToken = import.meta.env.VITE_DEVELOPER_TOKEN;
  
    useEffect(() => {
        MusicKit.configure({
            developerToken: developerToken,
            app: {
              name: 'MusicKit Example',
              build: '1978.4.1'
            }
        });

        const music = MusicKit.getInstance();
        setMusicKitInstance(music);
    }, [developerToken]);

    return (
        <MusicContext.Provider value={music}>
            {children}
        </MusicContext.Provider>
    );
};

export const useMusic = () => {
    return useContext(MusicContext);
};