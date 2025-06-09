# 🧑‍💻 AI Mock Interview Simulator

This project is an interactive **AI-powered mock interview platform**. It allows users to upload their resume and job description, then get dynamically generated interview questions and real-time feedback using speech synthesis and voice recognition.

🌐 [Live Demo](https://santoshdannana.github.io/AI-Interview-Practice/)

---

## 🔐 Backend Info

The backend is built with **FastAPI**, handles resume/job description parsing, question generation, and answer feedback using **Google Gemini AI**. It is hosted privately on **Render** and communicates via REST APIs with the frontend.

➡️ If you’re reviewing the project and need API access or want to run the full stack locally, feel free to [contact me](mailto:santoshdannana3@gmail.com).

---
🙌 Feedback & Contributions
Feel free to try the app, and if you have suggestions, ideas for new features, or spot any issues, I’d love to hear from you!

- 📫 Contact me: [santoshdannana3@gmail.com]
- 💬 Open an issue or feature request right here on GitHub!

---

## 🚀 Features

- 🎤 **Voice-Based Interview Simulation**
- 📝 Upload your **Resume** & **Job Description**
- 🧠 Gemini (Google AI) powered question generation & feedback
- 🧏‍♂️ **Speech synthesis** for questions using selected voices
- 📢 Voice recognition to capture answers
- 📊 Instant **AI feedback** on every answer
- 📱 Fully responsive (Mobile + Desktop)
- 🎧 Custom voice selection

---

## 🧪 Technologies Used

- **React** (Frontend)
- **FastAPI** (Backend)
- **Google Generative AI (Gemini)**
- **Web Speech API** (Text-to-Speech & Speech Recognition)
- **Render** (Backend Hosting)
- **GitHub Pages** (Frontend Hosting)

---

## 📁 Project Structure

```
client/              → React frontend
  └── components/
       └── UploadForm.jsx
       └── InterviewSession.jsx
       └── HeaderControls.jsx
  └── App.js
  └── App.css

backend/             → FastAPI backend
  └── main.py
  └── parser.py
  └── ai_engine.py
  └── requirements.txt
```

---

## 📦 Installation

### 🖥️ Frontend

```bash
cd client
npm install
npm start
```

### ⚙️ Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

> Make sure to add your `GEMINI_API_KEY` to a `.env` file in the backend.

---

## 🌐 Deployment

### Frontend:
- Deployed using **GitHub Pages**
- Set `"homepage"` in `package.json`
- Deploy via: `npm run deploy`

### Backend:
- Deployed on **Render**
- Start Command:  
  ```bash
  uvicorn main:app --host 0.0.0.0 --port 8000
  ```

---

## 🧠 Powered By
- [FastAPI](https://fastapi.tiangolo.com/)
- [React](https://react.dev/)
- [Google Generative AI](https://ai.google.dev/)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

---

**Feel free to open issues or feature requests!**
