import React, { useState, useEffect } from 'react';
import UploadForm from './components/Uploadform';
import InterviewSession from './components/InterviewSession';
import './App.css';

function App() {
  const [questions, setQuestions] = useState([]);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulate loading animation for 1.5 seconds
  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
  return (
      <div className="loader">
        <div className="bars">
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
        <p className="loader-text">Getting things ready...</p>
      </div>
    );
  }


  return (
    <div className="app-container fade-in">
      {questions.length === 0 ? (
        <UploadForm onQuestions={setQuestions} onConfig={setConfig} />
      ) : (
        <InterviewSession config={config} questions={questions} />
      )}
    </div>
  );
}

export default App;
