import React, { useState, useEffect, useRef, useCallback } from 'react';
import HeaderControls from './HeaderControls';

const InterviewSession = ({ questions }) => {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [silenceSeconds, setSilenceSeconds] = useState(0);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const videoRef = useRef(null);
  const currentQuestion = questions[index];

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

  useEffect(() => {
    speechSynthesis.getVoices(); // ensure voices are loaded
  }, []);

  const getHindiVoice = () => {
    const voices = speechSynthesis.getVoices();
    return voices.find(v => v.lang === 'hi-IN') || voices[0];
  };

  const speakText = useCallback((text) => {
    return new Promise(resolve => {
      const utter = new SpeechSynthesisUtterance(text);
      utter.voice = getHindiVoice();
      utter.onend = () => resolve();
      speechSynthesis.speak(utter);
    });
  }, []);

  const speakFeedbackAndContinue = useCallback((text) => {
    return new Promise(resolve => {
      const utter = new SpeechSynthesisUtterance(text);
      utter.voice = getHindiVoice();
      utter.onend = () => resolve();
      speechSynthesis.speak(utter);
    });
  }, []);

  const listenForAnswer = () => {
    return new Promise((resolve, reject) => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) return reject("Speech recognition not supported");

      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = true;
      recognition.continuous = true;

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
          if (silenceSeconds >= 10) {
            console.warn("🛑 Detected 10s of silence. Stopping...");
            recognition.stop();
          }
        }, 1000);
      };

      recognition.onstart = () => {
        setIsListening(true);
        resetSilenceTimer();
      };

      recognition.onresult = (event) => {
        let spoken = false;
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const result = event.results[i];
          const transcript = result[0].transcript;

          if (transcript.trim()) {
            spoken = true;
            if (result.isFinal) {
              fullTranscript += transcript + ' ';
            }
          }
        }

        if (spoken) {
          resetSilenceTimer();
        }
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
        resolve(fullTranscript.trim() || "(no response)");
      };

      recognition.start();
    });
  };

  const getAIResponse = useCallback(async (question, answer) => {
    try {
      const prompt = `You are an AI interviewer. The candidate was asked: "${question}". They answered: "${answer}". Give clear feedback in 1–2 lines.`;
      const res = await fetch('http://localhost:8000/ai-feedback', {
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
    <div className="min-h-screen bg-base-100 flex flex-col">
      <HeaderControls
        micOn={micOn}
        camOn={camOn}
        toggleMic={() => setMicOn(m => !m)}
        toggleCam={() => setCamOn(c => !c)}
        onEndCall={() => window.location.reload()}
      />

      <div className="flex flex-1 flex-col md:flex-row">
        <div className="md:w-1/2 p-6 flex items-center justify-center border-r border-base-300">
          <div className="card w-full shadow-xl aspect-square bg-base-200">
            <div className="card-body items-center text-center">
              <h2 className="card-title text-primary">🎥 Live Camera</h2>
              <video
                ref={videoRef}
                autoPlay
                muted={!micOn}
                playsInline
                className="rounded-xl w-full h-full object-cover border border-base-300"
              />
            </div>
          </div>
        </div>

        <div className="md:w-1/2 p-8 space-y-6">
          {currentQuestion ? (
            <>
              <div>
                <h2 className="text-2xl font-bold text-neutral-content">Question {index + 1}</h2>
                <p className="text-lg mt-2">{currentQuestion}</p>
              </div>

              {isListening && (
                <p className="text-success font-semibold">
                  🎤 Listening... (Silent for {silenceSeconds}s)
                </p>
              )}

              {answer && (
                <div className="card bg-info bg-opacity-10 text-info-content p-4">
                  <h3 className="font-bold mb-2">Your Answer</h3>
                  <p>{answer}</p>
                </div>
              )}

              {feedback && (
                <div className="card bg-warning bg-opacity-10 text-warning-content p-4">
                  <h3 className="font-bold mb-2">AI Feedback</h3>
                  <p>{feedback}</p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center mt-10">
              <h2 className="text-3xl font-bold text-success">🎉 Interview Complete!</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewSession;
