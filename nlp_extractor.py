import os
import re
import torch
from sentence_transformers import SentenceTransformer, util
from deep_translator import GoogleTranslator

# -------------------------------
# Paths
# -------------------------------
BASE_DIR = os.path.dirname(__file__)
SYMPTOMS_FILE = os.path.join(BASE_DIR, "symptoms.txt")
EMBEDDING_CACHE_FILE = os.path.join(BASE_DIR, "symptom_embeddings.pt")


# -------------------------------
# ✅ FULL SYMPTOM DICTIONARY
# -------------------------------
SYMPTOM_SYNONYMS = {

    # FEVER
    "running a high temperature": "high_fever",
    "high temperature": "high_fever",
    "running a temperature": "high_fever",
    "very high fever": "high_fever",
    "feverish": "high_fever",
    "having fever": "high_fever",
    "i have fever": "high_fever",
    "temperature": "high_fever",
    "fever": "high_fever",
    "mild fever": "mild_fever",
    "low fever": "mild_fever",
    "slight fever": "mild_fever",
    "feeling hot": "high_fever",
    "heat in body": "high_fever",

    # HEAD / MIGRAINE
    "head hurts": "headache",
    "head pain": "headache",
    "head is aching": "headache",
    "pain in head": "headache",
    "pressure in head": "headache",
    "pressure in my head": "headache",
    "migraine": "headache",
    "severe headache": "headache",
    "head is pounding": "headache",
    "pounding head": "headache",
    "throbbing head": "headache",
    "head pounding": "headache",
    "my head aches": "headache",
     "head is under pressure": "headache",
     "my head is pounding": "headache",
     "cannot concentrate": "headache",

    # FATIGUE / TIREDNESS
    "very tired": "tiredness",
    "tired": "tiredness",
    "weak": "tiredness",
    "feeling weak": "tiredness",
    "low energy": "tiredness",
    "exhausted": "tiredness",
    "fatigue": "tiredness",
    "worn out": "tiredness",
    "drained": "tiredness",
    "sleepy": "tiredness",

    # BODY / MUSCLE PAIN
    "body ache": "muscle_pain",
    "body aches": "muscle_pain",
    "body pain": "muscle_pain",
    "muscle ache": "muscle_pain",
    "muscles ache": "muscle_pain",
    "muscle aches": "muscle_pain",
    "soreness": "muscle_pain",
    "full body pain": "muscle_pain",
    "pain everywhere": "muscle_pain",
    "muscles hurting": "muscle_pain",

    # JOINTS
    "joint pain": "joint_pain",
    "pain in joints": "joint_pain",
    "stiff joints": "joint_pain",
    "joints are stiff": "joint_pain",
    "knees hurting": "joint_pain",
    "elbows aching": "joint_pain",

    # STOMACH / ABDOMINAL
    "severe stomach pain": "abdominal_pain",
    "stomach pain": "abdominal_pain",
    "stomach hurts": "abdominal_pain",
    "belly pain": "abdominal_pain",
    "abdomen pain": "abdominal_pain",
    "pain in stomach": "abdominal_pain",
    "gastric pain": "abdominal_pain",
    "abdominal cramps": "abdominal_pain",
    "cramps": "abdominal_pain",
    "my tummy hurts": "abdominal_pain",
    "stomach cramping": "abdominal_pain",
    "belly cramp": "abdominal_pain",

    # DIGESTIVE / NAUSEA / VOMITING
    "vomit": "vomiting",
    "vomiting": "vomiting",
    "throwing up": "vomiting",
    "feeling like vomiting": "nausea",
    "want to vomit": "nausea",
    "sick to stomach": "nausea",
    "upset stomach": "nausea",
    "queasy": "nausea",
    "feeling nauseous": "nausea",

    "diarrhea": "diarrhoea",
    "diarrhoea": "diarrhoea",
    "loose motion": "diarrhoea",
    "loose motions": "diarrhoea",
    "frequent stools": "diarrhoea",
    "watery stools": "diarrhoea",
    "runny stool": "diarrhoea",

    "loss of appetite": "loss_of_appetite",
    "lost my appetite": "loss_of_appetite",
    "not hungry": "loss_of_appetite",
    "dont feel like eating": "loss_of_appetite",
    "no desire to eat": "loss_of_appetite",

    # RESPIRATORY / COUGH
    "breathless": "breathlessness",
    "shortness of breath": "breathlessness",
    "short of breath": "breathlessness",
    "difficulty breathing": "breathlessness",
    "struggling to breathe": "breathlessness",
    "unable to breathe": "breathlessness",
    "hard to breathe": "breathlessness",
    "trouble breathing": "breathlessness",
    "cannot breathe": "breathlessness",

    "coughing": "cough",
    "dry cough": "cough",
    "constant cough": "cough",
    "cough a lot": "cough",
    "persistent cough": "cough",

    # CHEST
    "chest pain": "chest_pain",
    "pain in chest": "chest_pain",
    "chest discomfort": "chest_pain",
    "chest tightness": "chest_pain",
    "tightness in chest": "chest_pain",
    "pressure in chest": "chest_pain",
    "hurting chest": "chest_pain",

    # SKIN
    "itchy": "itching",
    "itchy skin": "itching",
    "skin itching": "itching",
    "rash": "skin_rash",
    "rashes": "skin_rash",
    "red spots": "skin_rash",
    "skin redness": "skin_rash",
    "bumps on skin": "skin_rash",
    "red itchy spots": "skin_rash",

    # EYES / VISION
    "blurred vision": "blurred_and_distorted_vision",
    "blurry vision": "blurred_and_distorted_vision",
    "vision blur": "blurred_and_distorted_vision",
    "cannot see clearly": "blurred_and_distorted_vision",
    "double vision": "blurred_and_distorted_vision",
    "distorted vision": "blurred_and_distorted_vision",

    # SWELLING
    "swelling": "swelling_joints",
    "swollen": "swelling_joints",
    "swelling joints": "swelling_joints",
    "joint swelling": "swelling_joints",
    "swollen joints": "swelling_joints",
    "fluid overload": "fluid_overload",
    "swollen legs": "swollen_legs",
    "swollen extremities": "swollen_extremities",
    "puffy face": "puffy_face_and_eyes",

    # THIRST / HUNGER
    "very thirsty": "excessive_thirst",
    "feeling thirsty": "excessive_thirst",
    "feel thirsty": "excessive_thirst",
    "dehydrated": "excessive_thirst",
    "excessive thirst": "excessive_thirst",
    "excessive hunger": "excessive_hunger",
    "very hungry": "excessive_hunger",
    "always hungry": "excessive_hunger",

    # NEURO / DIZZINESS
    "feeling dizzy": "dizziness",
    "feel dizzy": "dizziness",
    "feels dizzy": "dizziness",
    "i feel dizzy": "dizziness",
    "lightheaded": "dizziness",
    "spinning feeling": "dizziness",
    "room spinning": "dizziness",
    "room is spinning": "dizziness",
    "the room is spinning": "dizziness",
    "dizzy spells": "dizziness",
    "dizzy": "dizziness",
    "vertigo": "dizziness",

    # THROAT
    "sore throat": "sore_throat",
    "throat pain": "sore_throat",
    "pain in throat": "sore_throat",
    "scratchy throat": "sore_throat",
    "throat irritation": "sore_throat",

    # GENERAL / MALAISE
    "malaise": "malaise",
    "general discomfort": "malaise",
    "unwell": "malaise",
    "feeling off": "malaise",
    "not feeling well": "malaise"
}

# -------------------------------
# Load symptoms
# -------------------------------
with open(SYMPTOMS_FILE, encoding="utf-8") as f:
    dataset_symptoms = [s.strip().lower() for s in f]

# Combine both
symptom_list = list(set(dataset_symptoms + list(SYMPTOM_SYNONYMS.values())))

readable_symptoms = [s.replace("_", " ") for s in symptom_list]

# -------------------------------
# Load model
# -------------------------------
MODEL_NAME = "distiluse-base-multilingual-cased-v2"

print("Loading SentenceTransformer model...")
model = SentenceTransformer(MODEL_NAME)
model.eval()
print("Model loaded!")


# -------------------------------
# Load embeddings
# -------------------------------
if os.path.exists(EMBEDDING_CACHE_FILE):
    symptom_embeddings = torch.load(EMBEDDING_CACHE_FILE, map_location="cpu")
else:
    with torch.no_grad():
        symptom_embeddings = model.encode(readable_symptoms, convert_to_tensor=True)
    torch.save(symptom_embeddings, EMBEDDING_CACHE_FILE)

symptom_embeddings = util.normalize_embeddings(symptom_embeddings)

# -------------------------------
# Normalize text
# -------------------------------
def normalize_text(text):
    text = text.lower()
    text = text.replace("’", "'")
    text = text.replace("don't", "dont").replace("didn't", "didnt")

    # Replace synonyms
    for phrase, replacement in sorted(
        SYMPTOM_SYNONYMS.items(),
        key=lambda x: len(x[0]),
        reverse=True
    ):
        text = re.sub(r'\b' + re.escape(phrase) + r'\b', replacement, text)

    return text

# -------------------------------
# Negation
# -------------------------------
def is_negated(segment, symptom):
    readable = symptom.replace("_", " ")
    return bool(re.search(rf"(no|not|without|dont|didnt)\s+(have\s+)?{re.escape(readable)}", segment))


# -------------------------------
# Extract symptoms
# -------------------------------
def extract_symptoms(text):
    try:
        text = GoogleTranslator(source="auto", target="en").translate(text)
    except:
        pass

    # Replace smart quotes
    text = text.lower().replace("'", "'")
    
    # Split into segments
    segments = re.split(r'[,.;]|\band\b|\bwith\b|\bbut\b', text)
    
    results = []
    negated = set()
    
    for segment in segments:
        segment = segment.strip()
        if len(segment) <= 3:
            continue
        
        # Find all symptom matches in this segment
        chunk_matches = []
        
        # PRIORITY 1: Check synonym phrases first
        for phrase, canonical in SYMPTOM_SYNONYMS.items():
            if phrase in segment:
                # Get position of phrase in segment
                pos = segment.find(phrase)
                chunk_matches.append((canonical, pos))
        
        # PRIORITY 2: Check dataset symptom names
        if not chunk_matches:
            for symptom in symptom_list:
                readable = symptom.replace("_", " ")
                if readable in segment:
                    pos = segment.find(readable)
                    chunk_matches.append((symptom, pos))
        
        # PRIORITY 3: Semantic similarity (very high threshold)
        if not chunk_matches and len(segment) > 5:
            try:
                with torch.no_grad():
                    seg_embedding = model.encode([segment], convert_to_tensor=True)
                    seg_embedding = util.normalize_embeddings(seg_embedding)
                    cosine_scores = util.cos_sim(seg_embedding, symptom_embeddings)
                
                best_score_idx = torch.argmax(cosine_scores[0]).item()
                best_score = cosine_scores[0][best_score_idx].item()
                
                if best_score > 0.85:
                    chunk_matches.append((symptom_list[best_score_idx], -1))
            except:
                pass
        
        # For each match, check if it's negated based on position relative to negation words
        for symptom, pos in chunk_matches:
            # Find all negation words and their positions
            negation_patterns = list(re.finditer(r'\b(no|not|without|dont|didnt|never)\b', segment))
            
            is_negated = False
            for neg_match in negation_patterns:
                neg_pos = neg_match.start()
                # If negation word comes BEFORE the symptom, it's negated
                if neg_pos < pos:
                    is_negated = True
                    break
            
            if is_negated:
                negated.add(symptom)
            else:
                results.append(symptom)
    
    # Remove duplicates and negated
    results = list(set(results) - negated)
    return results


# -------------------------------
# Test
# -------------------------------
if __name__ == "__main__":
    while True:
        text = input("Enter symptoms: ")
        print(extract_symptoms(text))