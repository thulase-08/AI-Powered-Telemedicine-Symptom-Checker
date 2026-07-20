import pandas as pd

# Load dataset (use Training.csv)
df = pd.read_csv("../data/Training.csv")

# Clean column names
df.columns = df.columns.str.strip().str.lower()

# Target column
TARGET = "prognosis"

# All symptom columns = everything except prognosis
symptom_cols = [col for col in df.columns if col != TARGET]

# Save to symptoms.txt
with open("symptoms.txt", "w", encoding="utf-8") as f:
    for s in sorted(symptom_cols):
        f.write(f"{s}\n")

print("symptoms.txt created successfully")
