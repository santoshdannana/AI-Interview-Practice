import React, { useState } from "react";
import './Uploadform.css';

const UploadForm = ({ onQuestions }) => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jdFile, setJdFile] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [focusArea, setFocusArea] = useState("Mixed");
  const [difficulty, setDifficulty] = useState("Moderate");
  const [duration, setDuration] = useState("30 mins");
  const [loading, setLoading] = useState(false);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("job_description", jdFile);
    formData.append("company", companyName);
    formData.append("focus_area", focusArea);
    formData.append("difficulty", difficulty);
    formData.append("duration", duration);

    try {
      const response = await fetch("https://your-api-url.onrender.com/upload/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed.");
      const data = await response.json();
      onQuestions(data.questions); // will trigger switch to InterviewSession
    } catch (err) {
      console.error("Upload error:", err);
      setLoading(false); // hide loading if failed
    }
  };
  if (loading) {
    return (
      <div className="spotify-loader">
        <div className="bars">
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
        <p className="loader-text">Getting your questions ready...</p>
      </div>
    );
  }


  return (
    <form onSubmit={handleSubmit} className="form-clean">
      <h2 className="form-title">Upload Interview Inputs</h2>

      <div className="form-group">
        <label>Company Name</label>
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="form-input"
          required
        />
      </div>

      <div className="form-group">
        <label>Resume (PDF or Word)</label>
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={(e) => setResumeFile(e.target.files[0])}
          className="form-input"
          required
        />
      </div>

      <div className="form-group">
        <label>Job Description (PDF or Word)</label>
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={(e) => setJdFile(e.target.files[0])}
          className="form-input"
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Focus Area</label>
          <select
            value={focusArea}
            onChange={(e) => setFocusArea(e.target.value)}
            className="form-select"
          >
            <option value="More on Resume">Resume-based</option>
            <option value="More on Job description">Job Description based</option>
            <option value="Behavioral">Behavioral</option>
            <option value="Technical">Technical</option>
            <option value="Managerial">Managerial</option>
            <option value="Mixed">Mixed</option>
          </select>
        </div>

        <div className="form-group">
          <label>Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="form-select"
          >
            <option value="Easy">Easy</option>
            <option value="Moderate">Moderate</option>
            <option value="Challenging">Challenging</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Interview Duration</label>
        <select
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="form-select"
        >
          <option value="30 mins">30 mins</option>
          <option value="1 hour">1 hour</option>
          <option value="2 hours">2 hours</option>
        </select>
      </div>

      <button className="form-button" disabled={loading}>
      {loading ? (
        <span className="spinner"></span>
      ) : (
        "Start Interview"
      )}
    </button>

    </form>

  );
};

export default UploadForm;
