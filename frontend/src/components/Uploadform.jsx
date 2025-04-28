import React, { useState } from "react";

const UploadForm = ({ onQuestions }) => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jdFile, setJdFile] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [focusArea, setFocusArea] = useState("Mixed");
  const [difficulty, setDifficulty] = useState("Moderate");
  const [duration, setDuration] = useState("30 mins");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("job_description", jdFile);
    formData.append("company", companyName);
    formData.append("focus_area", focusArea);
    formData.append("difficulty", difficulty);
    formData.append("duration", duration);

    try {
      const response = await fetch("http://localhost:8000/upload/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed.");
      }

      const data = await response.json();
      onQuestions(data.questions);
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card bg-base-100 shadow-xl p-6 space-y-5 mx-auto w-full max-w-md"
    >
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <span className="text-purple-500">📄</span> Upload Interview Inputs
      </h2>

      <div className="form-control">
        <label className="label font-medium">Company Name</label>
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="input input-bordered w-full"
          required
        />
      </div>

      <div className="form-control">
        <label className="label font-medium">Resume (PDF or Word)</label>
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={(e) => setResumeFile(e.target.files[0])}
          className="file-input file-input-bordered w-full"
          required
        />
      </div>

      <div className="form-control">
        <label className="label font-medium">Job Description (PDF or Word)</label>
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={(e) => setJdFile(e.target.files[0])}
          className="file-input file-input-bordered w-full"
          required
        />
      </div>

      <div className="form-control">
        <label className="label font-medium">Focus Area</label>
        <select
          value={focusArea}
          onChange={(e) => setFocusArea(e.target.value)}
          className="select select-bordered w-full"
        >
          <option value="More on Resume">Resume-based</option>
          <option value="More on Job description">Job Description based</option>
          <option value="Behavioral">Behavioral</option>
          <option value="Technical">Technical</option>
          <option value="Managerial">Managerial</option>
          <option value="Mixed">Mixed</option>
        </select>
      </div>

      <div className="form-control">
        <label className="label font-medium">Difficulty</label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="select select-bordered w-full"
        >
          <option value="Easy">Easy</option>
          <option value="Moderate">Moderate</option>
          <option value="Challenging">Challenging</option>
        </select>
      </div>

      <div className="form-control">
        <label className="label font-medium">Interview Duration</label>
        <select
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="select select-bordered w-full"
        >
          <option value="30 mins">30 mins</option>
          <option value="1 hour">1 hour</option>
          <option value="2 hours">2 hours</option>
        </select>
      </div>

      <button className="btn btn-primary btn-block text-white font-semibold text-lg shadow-md transition hover:scale-105 hover:brightness-110 duration-200">
        🚀 Start Interview
      </button>
    </form>

  );
};

export default UploadForm;
