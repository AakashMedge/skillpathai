import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import StandardScaler
import joblib
import numpy as np

# --- 1. Expand Dataset Generation ---
np.random.seed(42)
rows = 1000  # Increased rows for better generalization

data = pd.DataFrame({
    "likes_coding": np.random.randint(0, 2, rows),
    "likes_design": np.random.randint(0, 2, rows),
    "math_score": np.random.randint(30, 100, rows),
    "social_skill": np.random.randint(30, 100, rows),
    "analytical_thinking": np.random.randint(30, 100, rows),
    "creativity": np.random.randint(30, 100, rows),
    "risk_tolerance": np.random.randint(30, 100, rows),
    "leadership": np.random.randint(30, 100, rows),
    "public_speaking": np.random.randint(30, 100, rows),
    "teamwork": np.random.randint(0, 101, rows),  # 0: Independent, 100: Team
    "structure": np.random.randint(0, 101, rows),  # 0: Flexible, 100: Structured
})

def assign_career(row):
    # Data Science: Analytical + Coding + Math + Structure
    if row["analytical_thinking"] > 70 and row["likes_coding"] == 1 and row["math_score"] > 70:
        return "Data Science"
    # UI/UX: Creativity + Design + Social + Flexible
    elif row["creativity"] > 70 and row["likes_design"] == 1 and row["structure"] < 50:
        return "UI/UX"
    # Web Dev: Coding + Structure + Teamwork
    elif row["likes_coding"] == 1 and row["structure"] > 60:
        return "Web Development"
    # Marketing: Social + Public Speaking + Risk + Creative
    elif row["social_skill"] > 65 and row["public_speaking"] > 60:
        return "Marketing"
    # Management: Leadership + Social + Teamwork
    elif row["leadership"] > 75 and row["teamwork"] > 70:
        return "Management"
    # Default based on highest characteristic
    else:
        if row["analytical_thinking"] > row["creativity"]:
            return "Data Science"
        else:
            return "Marketing"

data["career"] = data.apply(assign_career, axis=1)

# --- 2. Training with Logistic Regression ---
features = [
    "likes_coding", "likes_design", "math_score", "social_skill", 
    "analytical_thinking", "creativity", "risk_tolerance", 
    "leadership", "public_speaking", "teamwork", "structure"
]
X = data[features]
y = data["career"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Logistic Regression needs scaling
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Model: C=1.0, max_iter=100 for stability
model = LogisticRegression(max_iter=1000)
model.fit(X_train_scaled, y_train)

# --- 3. Save Model + Scaler ---
joblib.dump(model, "model.pkl")
joblib.dump(scaler, "scaler.pkl")

# Metrics
y_pred = model.predict(X_test_scaled)
print(f"Model Accuracy: {accuracy_score(y_test, y_pred) * 100:.2f}%")
print("Model and Scaler saved successfully.")