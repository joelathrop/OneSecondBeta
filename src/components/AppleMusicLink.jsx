// src/components/AppleMusicLink.jsx
import React from 'react';
// import { FiApple } from 'react-icons/fi';
const developerToken = process.env.REACT_APP_DEVELOPER_TOKEN;




const AppleMusicLink = () => {

  const handleAuthorize = () => {
    console.log('here');
  }


  return (
    <div className="mt-8">
      <button 
        id="authorizeButton" 
        className="flex items-center justify-center px-6 py-3 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition"
        onClick={handleAuthorize}
      >
        {/* <FiApple className="text-2xl mr-2" /> */}
        <span className="text-lg">Link Your Apple Music</span>
      </button>
    </div>
  );
};

export default AppleMusicLink;
