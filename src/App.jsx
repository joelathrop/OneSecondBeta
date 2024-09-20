// src/App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MusicProvider } from './MusicContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Music from './pages/Music';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

// const developerToken = import.meta.env.VITE_DEVELOPER_TOKEN;

const App = () => {
  
//   const [musicKitInstance, setMusicKitInstance] = useState(null);

//   useEffect(() => {
//       MusicKit.configure({
//         developerToken: developerToken,
//         app: {
//           name: 'MusicKit Example',
//           build: '1978.4.1'
//         }
//     });

//     const music = MusicKit.getInstance();
//     setMusicKitInstance(music);
  
//     if (music != null) {
//       console.log('music initialized');
//     } else {
//       console.log('nope');
//     }
// }, []);

  return (
    <MusicProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/music" element={<Music />} />
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
