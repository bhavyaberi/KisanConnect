import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import RandomForestRegressor

df = pd.read_csv("data/processed/punjab_mandi_features.csv")
df["Date"] = pd.to_datetime(df["Date"])

cutoff_date = "2026-06-01"
features = ["lag_1", "lag_7", "rolling_mean_7", "month", "day_of_year"]
target = "Modal Price"

def mae(a, p): return np.mean(np.abs(a - p))
def rmse(a, p): return np.sqrt(np.mean((a - p) ** 2))
def mape(a, p): return np.mean(np.abs((a - p) / a)) * 100

results = []

for commodity in df["Commodity"].unique():
    sub = df[df["Commodity"] == commodity]
    train = sub[sub["Date"] < cutoff_date]
    test = sub[sub["Date"] >= cutoff_date]

    X_train, y_train = train[features], train[target]
    X_test, y_test = test[features], test[target]

    model = RandomForestRegressor(n_estimators=200, random_state=42)
    model.fit(X_train, y_train)

    preds = model.predict(X_test)

    results.append({
        "Commodity": commodity,
        "MAE": mae(y_test, preds),
        "RMSE": rmse(y_test, preds),
        "MAPE": mape(y_test, preds),
    })

    joblib.dump(model, f"models/{commodity.lower()}_price_model.pkl")
    print(f"Saved model for {commodity}")

results_df = pd.DataFrame(results)
print(results_df)
results_df.to_csv("data/processed/model_results.csv", index=False)