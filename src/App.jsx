// src/App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MusicProvider } from './utils/MusicContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Playlist from './pages/Playlist';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

// const developerToken = import.meta.env.VITE_DEVELOPER_TOKEN;

const App = () => {

  return (
    <MusicProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/playlist" element={<Playlist />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            {/* Add more routes as needed */}
          </Routes>
        </div>
      </Router>
    </MusicProvider>
  );
};

export default App;
