import pandas as pd

df = pd.read_csv("data/processed/punjab_mandi_features.csv")
df["Date"] = pd.to_datetime(df["Date"])

cutoff_date = "2026-06-01"

train = df[df["Date"] < cutoff_date]
test = df[df["Date"] >= cutoff_date]

print("Train shape:", train.shape)
print("Test shape:", test.shape)

print(train["Commodity"].value_counts())
print(test["Commodity"].value_counts())

print("Train date range:", train["Date"].min(), "->", train["Date"].max())
print("Test date range:", test["Date"].min(), "->", test["Date"].max())