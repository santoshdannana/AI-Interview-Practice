import React, { useState, useEffect } from 'react';
import UploadForm from './components/Uploadform';
import InterviewSession from './components/InterviewSession';
import './App.css';
import AppLoadAnimation from './components/AppLoadAnimation';

function App() {
  const [questions, setQuestions] = useState([]);
  const [config, setConfig] = useState(null);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return <AppLoadAnimation />;
  }

  return (
    <div className="app-container fade-in">
      {questions.length === 0 ? (
        <UploadForm
          onQuestions={setQuestions}
          onConfig={setConfig}
          onVoiceSelected={setSelectedVoice} 
        />
      ) : (
        <InterviewSession
          config={config}
          questions={questions}
          selectedVoice={selectedVoice} 
        />
      )}
    </div>
  );
}

export default App;
