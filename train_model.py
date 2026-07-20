import pandas as pd
import joblib
import numpy as np

from sklearn.ensemble import RandomForestClassifier, VotingClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from sklearn.model_selection import cross_val_score

# Load datasets
train_df = pd.read_csv("../data/Training.csv")
test_df = pd.read_csv("../data/Testing.csv")

# Clean column names
train_df.columns = train_df.columns.str.strip().str.lower()
test_df.columns = test_df.columns.str.strip().str.lower()

# Remove duplicates (IMPORTANT)
train_df = train_df.drop_duplicates()

TARGET = "prognosis"

X_train = train_df.drop(TARGET, axis=1)
y_train = train_df[TARGET]

X_test = test_df.drop(TARGET, axis=1)
y_test = test_df[TARGET]

# -------------------------------
# Models (Ensemble)
# -------------------------------
rf = RandomForestClassifier(
    n_estimators=200,
    random_state=42,
    n_jobs=-1,
    class_weight="balanced"
)

nb = GaussianNB()

lr = LogisticRegression(max_iter=1000)

# Voting Ensemble (Soft Voting = probability averaging)
model = VotingClassifier(
    estimators=[
        ('rf', rf),
        ('nb', nb),
        ('lr', lr)
    ],
    voting='soft'
)

# Train
model.fit(X_train, y_train)

# Test Accuracy
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print("Test Accuracy:", accuracy)

# Cross-validation (STRONG POINT)
cv_score = cross_val_score(model, X_train, y_train, cv=5).mean()
print("Cross-validation Accuracy:", cv_score)

# Save
joblib.dump(model, "model.pkl")
joblib.dump(list(X_train.columns), "feature_columns.pkl")

print("✅ Improved model saved!")