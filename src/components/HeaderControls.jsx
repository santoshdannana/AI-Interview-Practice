import React from 'react';
import { FiMic, FiMicOff, FiVideo, FiVideoOff, FiPhoneOff } from 'react-icons/fi';
import './HeaderControls.css'; // add new styles below

const HeaderControls = ({ micOn, camOn, toggleMic, toggleCam, onEndCall }) => {
  return (
    <div className="header-bar">
      <div className="header-controls">
        <button onClick={toggleMic} className="icon-button" title="Toggle Microphone">
          {micOn ? <FiMic /> : <FiMicOff />}
        </button>
        <button onClick={toggleCam} className="icon-button" title="Toggle Camera">
          {camOn ? <FiVideo /> : <FiVideoOff />}
        </button>
        <button onClick={onEndCall} className="icon-button end-call" title="End Call">
          <FiPhoneOff />
        </button>
      </div>
    </div>
  );
};

export default HeaderControls;
