# SkillPath AI 🚀

SkillPath AI is a professional, data-driven career trajectory analyzer. This project is a full-stack integration of **Custom Machine Learning** and **Modern Web Architecture**.

## 🧠 Truly Autonomous ML (No External APIs)
Unlike many modern projects that rely on OpenAI, Gemini, or other third-party black-box APIs, **SkillPath AI is powered by a custom-built, locally trained Machine Learning model.**

- **Architecture**: Locally trained Logistic Regression core.
- **Independence**: All predictions, trait weighting, and feature influence analysis are computed locally by the backend.
- **Privacy & Speed**: No data ever leaves your server for API inference.

## 🛠 Project Components
This is a **ML Model + Web Application** synergy:
- **Backend**: FastAPI server running the custom Scikit-learn model (`model.pkl`).
- **Frontend**: Next.js (React) dashboard with a minimalist, professional ChatGPT-inspired UI.
- **Analysis**: Quantitative analysis of 11 distinct technical and psychological traits.

## 🚀 Getting Started

### 1. Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r ../requirements.txt
python main.py
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## ⚖️ Features
- **11-Trait Matrix**: Deep analysis of technical skills and psychological attributes.
- **Deterministic Influence**: Transparent "Reasoning" table showing exactly how each trait impacted the match.
- **Trajectory Mapping**: Real-time rank of optimal and alternative career paths.

---
*Built with precision and logic.*
