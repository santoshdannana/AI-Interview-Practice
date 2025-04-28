import React, { useState } from 'react';
import UploadForm from './components/Uploadform';
import InterviewSession from './components/InterviewSession';

function App() {
  const [questions, setQuestions] = useState([]);
  const [config, setConfig] = useState(null); // used for passing custom inputs

  return (
    <div className="bg-base-200 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl">
        {questions.length === 0 ? (
          <UploadForm onQuestions={setQuestions} onConfig={setConfig} />
        ) : (
          <InterviewSession config={config} questions={questions} />
        )}
      </div>
    </div>
  );
}

export default App;
