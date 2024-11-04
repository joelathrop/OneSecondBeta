import React, { useState } from 'react';
import AuthorizeLink from '../components/AuthorizeLink';
import { useMusic } from '../utils/MusicContext';
import { useNavigate } from 'react-router-dom';

/////////////////////////
//////// TODOS //////////
/////////////////////////
// set everything back to session storage?
// easter eggs when users route to places they can't get to?
// set playlist to session/local storage so it doesn't go away on refresh

const Home = () => {
  const { musicKitInstance, setMUT, MUT, gameMode, setGameMode } = useMusic();
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
    musicKitInstance.unauthorize();
    localStorage.removeItem('MUT');
    setMUT(undefined);    // should it be 'null'? if so need to also change isAuthorized
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
          <AuthorizeLink onAuthorize={handleAuthorize} />
        ) : (
          <div className="flex flex-col items-center">
            {/* Game Mode Buttons Container */}
            <div className="p-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl shadow-lg flex flex-col items-center gap-6 w-full max-w-md">
              <button
                className={`w-full px-6 py-4 rounded-xl shadow-md transition transform hover:scale-105 ${
                  gameMode === 1 ? 'bg-gradient-to-r from-green-400 to-blue-500' : 'bg-gradient-to-r from-gray-800 to-gray-700 text-white'
                }`}
                onClick={() => setGameMode(1)}
              >
                <span className="text-lg font-semibold">Normal Mode</span>
              </button>
              <button
                className={`w-full px-6 py-4 rounded-xl shadow-md transition transform hover:scale-105 ${
                  gameMode === 2 ? 'bg-gradient-to-r from-yellow-400 to-red-500' : 'bg-gradient-to-r from-gray-800 to-gray-700 text-white'
                }`}
                onClick={() => setGameMode(2)}
              >
                <span className="text-lg font-semibold">Challenge Mode</span>
              </button>

              {gameMode > 0 && (
                <button
                  id="playWithPlaylistButton"
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-md hover:scale-105 transition transform"
                  onClick={() => navigate('/playlist')}
                >
                  <span className="text-lg">Pick a Playlist</span>
                </button>
              )}
            </div>

            {/* Logout Button */}
            <button
              id="unauthorizeButton"
              className="mt-4 w-half max-w-md px-6 py-3 text-white bg-gradient-to-r from-red-500 to-red-700 rounded-xl shadow-md hover:bg-red-600 transition transform hover:scale-105"
              onClick={handleUnauthorize}
            >
              Log Out
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
            src="https://help.apple.com/assets/65E21662495F1A6C8701F50A/65E21663EF8273BE1D0C2734/en_US/29537b9a58f71e9bc8e241e1ececb17b.png"
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