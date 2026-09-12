import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import RandomForestRegressor

df = pd.read_csv("data/processed/punjab_mandi_prices.csv")
df["Date"] = pd.to_datetime(df["Date"])
df = df.sort_values(["Commodity", "Date"]).reset_index(drop=True)

df["month"] = df["Date"].dt.month
df["day_of_year"] = df["Date"].dt.dayofyear
df["lag_1"] = df.groupby("Commodity")["Arrival Quantity"].shift(1)
df["lag_7"] = df.groupby("Commodity")["Arrival Quantity"].shift(7)
df["rolling_mean_7"] = df.groupby("Commodity")["Arrival Quantity"].shift(1).rolling(7).mean()
df = df.dropna(subset=["lag_1", "lag_7", "rolling_mean_7"])

cutoff_date = "2026-06-01"
features = ["lag_1", "lag_7", "rolling_mean_7", "month", "day_of_year"]
target = "Arrival Quantity"

def mae(a, p): return np.mean(np.abs(a - p))
def mape(a, p): return np.mean(np.abs((a - p) / a)) * 100

results = []
for commodity in df["Commodity"].unique():
    sub = df[df["Commodity"] == commodity]
    train = sub[sub["Date"] < cutoff_date]
    test = sub[sub["Date"] >= cutoff_date]

    model = RandomForestRegressor(n_estimators=200, random_state=42)
    model.fit(train[features], train[target])
    preds = model.predict(test[features])

    results.append({"Commodity": commodity, "MAE": mae(test[target], preds), "MAPE": mape(test[target], preds)})
    joblib.dump(model, f"models/{commodity.lower()}_arrival_model.pkl")

print(pd.DataFrame(results))

# Save the feature-engineered arrival dataset too, so the API can build features from it
df.to_csv("data/processed/punjab_mandi_arrival_features.csv", index=False)