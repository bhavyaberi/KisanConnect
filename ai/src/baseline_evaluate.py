import pandas as pd
import numpy as np

df = pd.read_csv("data/processed/punjab_mandi_features.csv")
df["Date"] = pd.to_datetime(df["Date"])

cutoff_date = "2026-06-01"
test = df[df["Date"] >= cutoff_date].copy()

# Baseline prediction: tomorrow's price = today's lag_1 (i.e. yesterday's actual price)
test["baseline_pred"] = test["lag_1"]

def mae(actual, pred):
    return np.mean(np.abs(actual - pred))

def rmse(actual, pred):
    return np.sqrt(np.mean((actual - pred) ** 2))

def mape(actual, pred):
    return np.mean(np.abs((actual - pred) / actual)) * 100

results = []
for commodity in test["Commodity"].unique():
    subset = test[test["Commodity"] == commodity]
    results.append({
        "Commodity": commodity,
        "MAE": mae(subset["Modal Price"], subset["baseline_pred"]),
        "RMSE": rmse(subset["Modal Price"], subset["baseline_pred"]),
        "MAPE": mape(subset["Modal Price"], subset["baseline_pred"]),
    })

results_df = pd.DataFrame(results)
print(results_df)

results_df.to_csv("data/processed/baseline_results.csv", index=False)