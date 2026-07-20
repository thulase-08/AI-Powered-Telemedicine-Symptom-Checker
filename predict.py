import os
import pandas as pd
import numpy as np
import joblib
from ml.nlp_extractor import extract_symptoms, SYMPTOM_SYNONYMS

# -------------------------------
# Paths
# -------------------------------
BASE_DIR = os.path.dirname(__file__)
DATA_DIR = os.path.join(BASE_DIR, "..", "data")

DISEASE_DESCRIPTION_FILE = os.path.join(DATA_DIR, "disease_description.csv")
DISEASE_PRECAUTION_FILE = os.path.join(DATA_DIR, "disease_precaution.csv")
SYMPTOM_SEVERITY_FILE = os.path.join(DATA_DIR, "symptom_severity.csv")  # your CSV
MODEL_FILE = os.path.join(BASE_DIR, "model.pkl")
FEATURES_FILE = os.path.join(BASE_DIR, "feature_columns.pkl")

# -------------------------------
# Load Models & CSVs
# -------------------------------
disease_description_df = pd.read_csv(DISEASE_DESCRIPTION_FILE)
disease_precaution_df = pd.read_csv(DISEASE_PRECAUTION_FILE)
symptom_severity_df = pd.read_csv(SYMPTOM_SEVERITY_FILE)

try:
    ensemble_model = joblib.load(MODEL_FILE)
    feature_columns = joblib.load(FEATURES_FILE)
except Exception as e:
    print("Warning: Could not load ML model. Falling back to heuristic.", e)
    ensemble_model = None
    feature_columns = []

# Build severity dictionary
SYMPTOM_SEVERITY = {
    str(k).strip().lower(): v
    for k, v in zip(
        symptom_severity_df['Symptom'],
        symptom_severity_df['Symptom_severity']
    )
}

# -------------------------------
# Build symptom-to-disease mapping
# -------------------------------
SYMPTOM_TO_DISEASE = {}

for _, row in disease_description_df.iterrows():
    disease = row['Disease'].strip()
    desc = row['Symptom_Description'].strip().lower().replace("_", " ")

    for canonical_symptom in set(SYMPTOM_SYNONYMS.values()):
        if canonical_symptom not in SYMPTOM_TO_DISEASE:
            SYMPTOM_TO_DISEASE[canonical_symptom] = set()

        # Full word match
        symptom_words = canonical_symptom.split("_")
        if all(word in desc for word in symptom_words):
            SYMPTOM_TO_DISEASE[canonical_symptom].add(disease)

# Fallback: partial match
for canonical_symptom in set(SYMPTOM_SYNONYMS.values()):
    if not SYMPTOM_TO_DISEASE[canonical_symptom]:
        for _, row in disease_description_df.iterrows():
            disease = row['Disease'].strip()
            desc = row['Symptom_Description'].strip().lower()
            if any(word in desc for word in canonical_symptom.split("_")):
                SYMPTOM_TO_DISEASE[canonical_symptom].add(disease)

# -------------------------------
# High-risk threshold
# -------------------------------
HIGH_RISK_THRESHOLD = 5      # severity >=5 is high risk
CRITICAL_THRESHOLD = 7       # severity >=7 is critical

# -------------------------------
# Predict disease
# -------------------------------
def predict_disease(user_text):
    symptoms = extract_symptoms(user_text)
    if not symptoms:
        return [], "No symptoms detected. Please enter clear symptoms."

    predicted_items = []
    
    if ensemble_model is not None and feature_columns:
        input_vector = np.zeros(len(feature_columns))
        # Create index map (add this once)
        feature_index = {f: i for i, f in enumerate(feature_columns)}
        for symptom in symptoms:
            if symptom in feature_index:
                input_vector[feature_index[symptom]] = 1
                
        probs = ensemble_model.predict_proba([input_vector])[0]
        top3_idx = np.argsort(probs)[-3:][::-1]
        
        for idx in top3_idx:
            disease = ensemble_model.classes_[idx]
            confidence = round(probs[idx] * 100, 2)
            predicted_items.append((disease, confidence))
            
    else:
        # Fallback heuristic
        disease_scores = {}
        total_words = sum(len(s.split("_")) for s in symptoms)
    
        for symptom in symptoms:
            words = symptom.split("_")
            for disease in SYMPTOM_TO_DISEASE.get(symptom, []):
                if disease not in disease_scores:
                    disease_scores[disease] = 0
                desc = disease_description_df[disease_description_df['Disease']==disease]['Symptom_Description'].values[0].lower()
                disease_scores[disease] += sum(word in desc for word in words)
    
        if not disease_scores:
            return [], "No matching diseases found for the symptoms."
    
        sorted_diseases = sorted(disease_scores.items(), key=lambda x: x[1], reverse=True)
        for disease, match_count in sorted_diseases[:3]:
            # Better distribution of confidence based on relative metrics
            confidence = round(min((match_count / max(total_words, 1)) * 100, 99.0), 2)
            predicted_items.append((disease, confidence))

    results = []
    for disease, confidence in predicted_items:
        # Filter out very low confidence predictions (< 5%)
        if confidence < 5.0:
            continue

        desc_row = disease_description_df[disease_description_df['Disease'] == disease]
        description = desc_row['Symptom_Description'].values[0] if not desc_row.empty else "No description available"

        prec_row = disease_precaution_df[disease_precaution_df['Disease'] == disease]
        if not prec_row.empty:
            precautions = [str(prec).strip() for prec in prec_row.iloc[0, 1:] if str(prec).lower() != "null"]
        else:
            precautions = ["No precautions found for this disease"]

        results.append({
            "disease": disease,
            "confidence": confidence,
            "description": description,
            "precautions": precautions
        })

    # Ensure we always return at least one result
    if not results and predicted_items:
        # Return top prediction regardless of confidence if nothing passed filter
        disease, confidence = predicted_items[0]
        desc_row = disease_description_df[disease_description_df['Disease'] == disease]
        description = desc_row['Symptom_Description'].values[0] if not desc_row.empty else "No description available"
        prec_row = disease_precaution_df[disease_precaution_df['Disease'] == disease]
        precautions = []
        if not prec_row.empty:
            precautions = [str(prec).strip() for prec in prec_row.iloc[0, 1:] if str(prec).lower() != "null"]
        results.append({
            "disease": disease,
            "confidence": confidence,
            "description": description,
            "precautions": precautions if precautions else ["Consult a healthcare provider"]
        })

    return results, None

# -------------------------------
# Determine urgency
# -------------------------------
def get_urgency(symptoms):
    # Single non-specific symptoms should be low urgency
    if len(symptoms) == 1:
        single_symptom = symptoms[0]
        severity = SYMPTOM_SEVERITY.get(single_symptom, 0)
        # Non-specific symptoms like malaise, tiredness, headache are lower risk
        non_specific = ['malaise', 'tiredness', 'headache', 'itching', 'cough']
        if single_symptom in non_specific and severity < HIGH_RISK_THRESHOLD:
            return "Low", f"Single non-specific symptom: {single_symptom.replace('_', ' ')}"
    
    # Check critical symptoms from CSV
    if any(SYMPTOM_SEVERITY.get(s,0) >= CRITICAL_THRESHOLD for s in symptoms):
        return "High", "Critical symptoms detected"

    # Count high-risk symptoms
    high_risk_count = sum(1 for s in symptoms if SYMPTOM_SEVERITY.get(s,0) >= HIGH_RISK_THRESHOLD)

    if high_risk_count == 0:
        return "Low", "Mild symptoms detected"
    elif high_risk_count <= 2:
        return "Mid", "Moderate symptoms detected"
    else:
        return "High", "Multiple severe symptoms detected"

# -------------------------------
# Add prediction warnings
# -------------------------------
def add_prediction_warnings(predictions, symptoms):
    """Add warning flags to predictions for better user awareness"""
    for pred in predictions:
        warnings = []
        
        # Low confidence warning
        if pred['confidence'] < 30:
            warnings.append("Low confidence prediction - consider consulting a doctor")
        
        # Single symptom warning
        if len(symptoms) == 1:
            warnings.append("Based on single symptom - results may be less accurate")
        
        # Serious disease with low symptoms warning
        serious_diseases = ['Heart attack', 'Paralysis (brain hemorrhage)', 'Hepatitis B', 'Hepatitis C']
        if pred['disease'] in serious_diseases and pred['confidence'] < 50:
            warnings.append(f"Serious condition flagged but confidence is moderate")
        
        pred['warnings'] = warnings
    
    return predictions

# -------------------------------
# Interactive loop
# -------------------------------
if __name__ == "__main__":
    print("=== Disease Predictor ===")
    while True:
        text = input("Enter your symptoms (or 'quit' to exit): ")
        if text.lower() == "quit":
            break

        predictions, error = predict_disease(text)
        extracted_symptoms = extract_symptoms(text)

        if error:
            print(error)
            print("="*50)
            continue

        print("\nExtracted Symptoms:", extracted_symptoms)
        urgency, reason = get_urgency(extracted_symptoms)
        print("Urgency Level:", urgency)
        print("Reason:", reason)

        # Add warnings to predictions
        predictions = add_prediction_warnings(predictions, extracted_symptoms)

        print("\nTop Predictions:")
        for pred in predictions:
            print(f" - {pred['disease']} ({pred['confidence']}% confidence)")
            print(f"   Description: {pred['description']}")
            print(f"   Precautions: {', '.join(pred['precautions'])}")
            if pred.get('warnings'):
                for warning in pred['warnings']:
                    print(f"   ⚠️  {warning}")
            print()
        print("="*50)