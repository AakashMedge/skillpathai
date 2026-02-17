from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and scaler
model = joblib.load("model/model.pkl")
scaler = joblib.load("model/scaler.pkl")

class UserInput(BaseModel):
    likes_coding: int
    likes_design: int
    math_score: int
    social_skill: int
    analytical_thinking: int
    creativity: int
    risk_tolerance: int
    leadership: int
    public_speaking: int
    teamwork: int
    structure: int

@app.post("/predict")
def predict(data: UserInput):
    # Prepare input
    features_list = [
        data.likes_coding, data.likes_design, data.math_score, data.social_skill,
        data.analytical_thinking, data.creativity, data.risk_tolerance,
        data.leadership, data.public_speaking, data.teamwork, data.structure
    ]
    
    feature_names = [
        "Likes Coding", "Likes Design", "Math Score", "Social Skills",
        "Analytical Thinking", "Creativity", "Risk Tolerance",
        "Leadership", "Public Speaking", "Teamwork", "Work Structure"
    ]

    # Convert to DataFrame for easier handling
    df = pd.DataFrame([features_list], columns=[
        "likes_coding", "likes_design", "math_score", "social_skill", 
        "analytical_thinking", "creativity", "risk_tolerance", 
        "leadership", "public_speaking", "teamwork", "structure"
    ])

    # Scale input
    X_scaled = scaler.transform(df)

    # Predict
    probabilities = model.predict_proba(X_scaled)[0]
    classes = model.classes_
    
    # Sort results
    results = list(zip(classes, probabilities))
    results.sort(key=lambda x: x[1], reverse=True)
    
    top_career = results[0][0]
    top_class_index = list(model.classes_).index(top_career)

    # Calculate "Why" contribution
    # Contribution = coefficient * scaled_value
    coefficients = model.coef_[top_class_index]
    contributions = coefficients * X_scaled[0]
    
    # Map index to feature name and contribution value
    reasoning = []
    for i, (name, val) in enumerate(zip(feature_names, contributions)):
        reasoning.append({"feature": name, "impact": round(float(val), 2)})
    
    # Sort reasoning by impact (top 3 factors)
    reasoning.sort(key=lambda x: abs(x["impact"]), reverse=True)
    top_reasons = reasoning[:3]

    return {
        "predictions": [
            {"career": career, "confidence": round(float(prob) * 100, 2)}
            for career, prob in results
        ],
        "reasoning": top_reasons
    }
