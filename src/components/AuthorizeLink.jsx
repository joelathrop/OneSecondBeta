import React from 'react';
import { useMusic } from '../MusicContext';
// import { FiApple } from 'react-icons/fi';

const developerToken = import.meta.env.VITE_DEVELOPER_TOKEN;
var MUT = "";

const AuthorizeLink = ({ onAuthorize }) => {
  const music = useMusic();

  const handleAuthorize = () => {
    if (!music || typeof music.authorize !== 'function') {
      console.error('not initialized');
      return;
    }

    console.log('MusicKit initialized, proceeding with authorization');

    if (music.isAuthorized) {
      console.log("its authorized");
    }

    music.authorize()
    .then((musicUserToken) => {
      MUT = musicUserToken;
      onAuthorize(musicUserToken);
      // console.log(MUT);
    }).catch((error) => {
      console.error('Authorization Error: ', error);
    });

  };


  return (
    <div className="mt-8">
      <button 
        id="authorizeButton" 
        className="flex items-center justify-center px-6 py-3 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition"
        onClick={handleAuthorize}
      >
        {/* <FiApple className="text-2xl mr-2" /> */}
        <span className="text-lg">Log In</span>
      </button>
    </div>
  );
};

export const getMUT = () => {
  return MUT;
}

export default AuthorizeLink;
