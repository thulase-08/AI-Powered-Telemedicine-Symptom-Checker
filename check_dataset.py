import pandas as pd

# Load datasets
train_df = pd.read_csv("../data/Training.csv")
test_df = pd.read_csv("../data/Testing.csv")

# Clean column names
train_df.columns = train_df.columns.str.strip().str.lower()
test_df.columns = test_df.columns.str.strip().str.lower()

print("==== TRAINING DATASET ====")
print("Rows, Columns:", train_df.shape)
print("Columns:", train_df.columns.tolist())
print("Missing values:\n", train_df.isnull().sum())
print("\nSample rows:")
print(train_df.head())

print("\n==== TESTING DATASET ====")
print("Rows, Columns:", test_df.shape)
print("Columns:", test_df.columns.tolist())
print("Missing values:\n", test_df.isnull().sum())
print("\nSample rows:")
print(test_df.head())