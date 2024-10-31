import React, { useState } from 'react';
import AuthorizeLink from '../components/AuthorizeLink';
import { useMusic } from '../MusicContext';
import { useNavigate } from 'react-router-dom';
import Playlist from './Playlist';

const Home = () => {
  const music = useMusic();
  var [MUT, setMUT] = useState(undefined);
  const navigate = useNavigate();

  // Smooth scroll to the next section
  const scrollToNextSection = () => {
    const nextSection = document.getElementById('about-section');
    nextSection.scrollIntoView({ behavior: 'smooth' });
  };

  // check if user is authorized (MUT is set)
  const isAuthorized = () => {
    return MUT !== undefined;
  }

  // authorize callback
  const handleAuthorize = (musicUserToken) => {
    setMUT(musicUserToken);
  }

  // handle user logout
  const handleUnauthorize = () => {
    music.unauthorize();
    setMUT(undefined);
    console.log("User Unauthorized.");
  }

  return (
    <div className="relative">
      {/* First Section (Welcome Section) */}
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-blue-600 pt-20 relative">
        <h1 className="text-5xl font-bold text-white mb-6">Welcome to OneSecond</h1>
        <p className="text-lg text-gray-200 mb-8">
          Connect your Apple Music and enjoy your favorite tunes seamlessly.
        </p>

        {!isAuthorized() ? (
          <AuthorizeLink onAuthorize={handleAuthorize}/>
        ) : (
          <div className="flex flex-col items-center">
            <button 
              id="playWithPlaylistButton" 
              className="flex items-center justify-center px-6 py-3 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition"
              onClick={() => navigate('/playlist')}
            >
              <span className="text-lg">Pick a Playlist</span>
            </button>
            <button 
              id="unauthorizeButton" 
              className="flex items-center justify-center px-6 py-3 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition"
              onClick={handleUnauthorize}
            >
              <span className="text-lg">Log Out</span>
            </button>
          </div>
        )}

        {/* Scroll Arrow Indicator */}
        <div className="absolute bottom-8 flex justify-center">
  <button
    onClick={scrollToNextSection}
    className="animate-bounce focus:outline-none"
  >
    <div className="flex items-center justify-center w-12 h-12 bg-gray-800 rounded-full shadow-lg">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-6 h-6 text-gray-300"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </div>
  </button>
</div>
      </div>

      {/* Next Section (About Section) */}
      <section
        id="about-section"
        className="min-h-screen bg-gradient-to-br from-blue-700 to-purple-900 flex flex-col items-center justify-center px-4"
      >
        <h2 className="text-4xl font-semibold text-white mb-6">
          About the Game
        </h2>
        <div className="w-full max-w-md flex flex-col items-center justify-center">
          <img
            src="https://help.apple.com/assets/65E21662495F1A6C8701F50A/65E21663EF8273BE1D0C2734/en_US/29537b9a58f71e9bc8e241e1ececb17b.png" // Replace this with your preferred Apple Music stock image URL
            alt="Apple Music Stock Library"
            className="w-64 rounded-lg p-8"
          />
        </div>
        <div className="w-full max-w-3xl p-8 bg-white bg-opacity-10 rounded-lg shadow-lg text-center">
          <p className="text-gray-200">
            MyMusicApp is a fun game where you connect your Apple Music account, and we play a random one-second clip from a song. Your goal is to guess which song it is! 
            The more accurate your guesses, the higher your score!
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
