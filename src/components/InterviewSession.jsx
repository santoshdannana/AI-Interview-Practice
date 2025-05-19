import React, { useState, useEffect, useRef, useCallback } from 'react';
import HeaderControls from './HeaderControls';
import './InterviewSession.css'; 

const InterviewSession = ({ questions, selectedVoice }) => {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [silenceSeconds, setSilenceSeconds] = useState(0);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [showFinishButton, setShowFinishButton] = useState(false);
  const videoRef = useRef(null);
  const currentQuestion = questions[index];
  const recognitionRef = useRef(null);


  useEffect(() => {
    window.speechSynthesis.cancel();
    if (camOn) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(err => console.error("Camera error:", err));
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  }, [camOn]);

  const speakText = useCallback((text) => {
    return new Promise(resolve => {
      const utter = new SpeechSynthesisUtterance(text);
      utter.voice = selectedVoice;
      utter.onend = () => resolve();
      speechSynthesis.speak(utter);
    });
  }, [selectedVoice]);

  const speakFeedbackAndContinue = useCallback((text) => {
    return new Promise(resolve => {
      const utter = new SpeechSynthesisUtterance(text);
      utter.voice = selectedVoice;
      utter.onend = () => resolve();
      speechSynthesis.speak(utter);
    });
  }, [selectedVoice]);

  const listenForAnswer = () => {
    return new Promise((resolve, reject) => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) return reject("Speech recognition not supported");

      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = true;
      recognition.continuous = true;
      recognitionRef.current = recognition;

      let fullTranscript = '';
      let silenceTimer = null;
      let silenceSeconds = 0;

      const resetSilenceTimer = () => {
        silenceSeconds = 0;
        setSilenceSeconds(0);
        if (silenceTimer) clearInterval(silenceTimer);
        silenceTimer = setInterval(() => {
          silenceSeconds++;
          setSilenceSeconds(silenceSeconds);
          if (silenceSeconds >= 10) recognition.stop();
        }, 1000);
      };

      recognition.onstart = () => {
        setIsListening(true);
        resetSilenceTimer();

        setTimeout(() => {
          setShowFinishButton(true);
        }, 60000);
      };

      recognition.onresult = (event) => {
        let spoken = false;
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const result = event.results[i];
          const transcript = result[0].transcript;
          if (transcript.trim()) {
            spoken = true;
            if (result.isFinal) fullTranscript += transcript + ' ';
          }
        }
        if (spoken) resetSilenceTimer();
      };

      recognition.onerror = (err) => {
        console.error('Speech recognition error:', err);
        clearInterval(silenceTimer);
        setIsListening(false);
        resolve("(no response)");
      };

      recognition.onend = () => {
        clearInterval(silenceTimer);
        setIsListening(false);
        setShowFinishButton(false);
        resolve(fullTranscript.trim() || "(no response)");
      };

      recognition.start();
    });
  };

  const handleManualFinish = () => {
    window.speechSynthesis.cancel();

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    setShowFinishButton(false);
  };


  const getAIResponse = useCallback(async (question, answer) => {
    try {
      const prompt = `You are an AI interviewer. The candidate was asked: "${question}". They answered: "${answer}". Give clear feedback in 1–2 lines.`;
      const res = await fetch('https://ai-interview-backend-40n7.onrender.com/ai-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      return data.feedback || 'No feedback received.';
    } catch (err) {
      console.error('AI error:', err);
      return 'There was an error getting feedback.';
    }
  }, []);

  useEffect(() => {
    if (!currentQuestion) return;
    const runStep = async () => {
      try {
        setAnswer('');
        setFeedback('');
        await speakText(currentQuestion);
        await new Promise(r => setTimeout(r, 500));
        const userAnswer = await listenForAnswer();
        setAnswer(userAnswer);
        const aiReply = !userAnswer || userAnswer === "(no response)"
          ? "No response detected."
          : await getAIResponse(currentQuestion, userAnswer);
        setFeedback(aiReply);
        await speakFeedbackAndContinue(aiReply);
        setIndex(i => i + 1);
      } catch (err) {
        console.error(err);
        setFeedback("Something went wrong.");
      }
    };
    runStep();
  }, [index, currentQuestion, speakText, speakFeedbackAndContinue, getAIResponse]);

  return (
    <div className="interview-wrapper">
      <header className="interview-header">
        <h1 className="interview-title">🎙️ Mock Interview</h1>
        <HeaderControls
          micOn={micOn}
          camOn={camOn}
          toggleMic={() => setMicOn(m => !m)}
          toggleCam={() => setCamOn(c => !c)}
          onEndCall={() => window.location.reload()}
        />
      </header>

      <main className="interview-body">
        <section className="video-section">
          <div className="video-card">
            <div className="video-display">
              {camOn ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted={!micOn}
                  playsInline
                  className="video-feed"
                />
              ) : (
                <div className="video-placeholder">
                  <span className="camera-off-icon">🚫</span>
                  <p>Camera is turned off</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="question-section">
          <div className="question-scrollable">
            <div className="question-header">
              <h2><strong>Question {index + 1}</strong></h2>
              <p className="question-text">{currentQuestion}</p>
            </div>

            <div className="question-scrollable">
              {isListening && (
                <p className="listening">🎤 Listening... (Silent for {silenceSeconds}s)</p>
              )}

              {answer && (
                <div className="answer-box">
                  <strong>Your Answer</strong>
                  <p>{answer}</p>
                </div>
              )}

              {feedback && (
                <div className="feedback-box">
                  <strong>AI Feedback</strong>
                  <p>{feedback}</p>
                </div>
              )}

              {showFinishButton && isListening && (
                <button
                  className="finish-button"
                  onClick={handleManualFinish}
                  title="Click if you are finished"
                >
                  I'm Finished
                </button>
              )}

              {!currentQuestion && (
                <div className="complete">🎉 Interview Complete!</div>
              )}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default InterviewSession;
