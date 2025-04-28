import React from 'react';
import { FiMicOff } from 'react-icons/fi';

const VideoFeedPanel = () => {
  return (
    <div className="relative h-full bg-black text-white">
      {/* Main Speaker */}
      <div className="absolute inset-0 flex items-center justify-center">
        <video className="rounded-lg shadow-lg w-5/6 h-5/6 object-cover" autoPlay muted playsInline />
        <span className="absolute bottom-6 left-6 bg-black bg-opacity-60 px-3 py-1 rounded text-white">Jerom</span>
      </div>

      {/* Right Side Participants */}
      <div className="absolute right-4 top-20 flex flex-col gap-4">
        {[1, 2, 3, 4].map((_, i) => (
          <div key={i} className="relative w-20 h-20 rounded overflow-hidden border border-gray-300">
            <img src={`https://i.pravatar.cc/100?img=${i + 1}`} alt="participant" />
            <FiMicOff className="absolute bottom-1 right-1 text-red-500 bg-white rounded-full p-1 text-lg" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoFeedPanel;
