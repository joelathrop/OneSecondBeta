// src/components/AppleMusicLink.jsx
import React from 'react';
// import { FiApple } from 'react-icons/fi';




const AppleMusicLink = () => {


  // document.addEventListener('DOMContentLoaded', () => {
  //   MusicKit.configure({
  //       developerToken: developerToken,
  //       app: {
  //           name: 'MusicKit Example',
  //           build: '1978.4.1'
  //       }
  //   });
  
    // loginButton = document.getElementById('authorizeButton');

    // setTimeout(() => {
    //     music = MusicKit.getInstance();
    // }, 500);

    // if (loginButton) {
    //     loginButton.addEventListener('click', () => {
    //         music.authorize().then((musicUserToken) => {
    //             MUT = musicUserToken;
    //             console.log(MUT);

    //             // TODO: need this?
    //             sessionStorage.setItem('MUT', MUT);

    //             normalModeButton.style.display = 'inline';
    //             challengeModeButton.style.display = 'inline';
    //         }).catch((error) => {
    //             console.error('Authorization error:', error);
    //         });
    //     });
    // } else {
    //     console.log('Authorize Button failed to initialize');
    // }


  return (
    <div className="mt-8">
      <button id="authorizeButton" className="flex items-center justify-center px-6 py-3 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition">
        {/* <FiApple className="text-2xl mr-2" /> */}
        <span className="text-lg">Link Your Apple Music</span>
      </button>
    </div>
  );
};

export default AppleMusicLink;
