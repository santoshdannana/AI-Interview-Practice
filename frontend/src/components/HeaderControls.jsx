import React from 'react';
import { FiMic, FiMicOff, FiVideo, FiVideoOff, FiPhoneOff } from 'react-icons/fi';

const HeaderControls = ({ micOn, camOn, toggleMic, toggleCam, onEndCall }) => {
  return (
    <div className="navbar bg-base-200 shadow-md justify-between px-6 sticky top-0 z-50">
      <div className="text-xl font-bold text-primary">🧑‍💻 Mock Interview</div>
      <div className="space-x-4">
        <button onClick={toggleMic} className="btn btn-sm btn-circle btn-outline">{micOn ? <FiMic /> : <FiMicOff />}</button>
        <button onClick={toggleCam} className="btn btn-sm btn-circle btn-outline">{camOn ? <FiVideo /> : <FiVideoOff />}</button>
        <button onClick={onEndCall} className="btn btn-sm btn-circle btn-error text-white"><FiPhoneOff /></button>
      </div>
    </div>
  );
};

export default HeaderControls;
