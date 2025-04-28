import React, { useEffect, useState } from 'react';

const QuestionPlayer = ({ questions }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < questions.length) {
      const utterance = new SpeechSynthesisUtterance(questions[index]);
      utterance.onend = () => {
        setTimeout(() => setIndex(i => i + 1), 7000); // 7s pause
      };
      speechSynthesis.speak(utterance);
    }
  }, [index, questions]);

  return (
    <div className="p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-2">Question {index + 1}</h2>
      <p className="text-lg">{questions[index]}</p>
    </div>
  );
};

export default QuestionPlayer;
