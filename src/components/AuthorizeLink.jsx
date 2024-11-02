import React from 'react';
import { useMusic } from '../utils/MusicContext';
// import { FiApple } from 'react-icons/fi';

const AuthorizeLink = ({ onAuthorize }) => {
  const { musicKitInstance, setMUT, MUT } = useMusic();

  const handleAuthorize = () => {
    if (!musicKitInstance || typeof musicKitInstance.authorize !== 'function') {
      console.error('not initialized');
      return;
    }

    console.log('MusicKit initialized, proceeding with authorization');

    if (musicKitInstance.isAuthorized) {
      console.log("its authorized");
    }

    if (MUT) {
      musicKitInstance.setMUT(MUT);
      console.log('MUT loaded from session');
    } else {
      musicKitInstance.authorize()
      .then((musicUserToken) => {-
        setMUT(musicUserToken);
        localStorage.setItem('MUT', musicUserToken);
        onAuthorize(musicUserToken);
        // console.log(MUT);
      }).catch((error) => {
        console.error('Authorization Error: ', error);
      });
    }

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

// export const getMUT = () => {
//   return MUT;
// }

export default AuthorizeLink;
