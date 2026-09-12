import pandas as pd
import joblib

SURPLUS_THRESHOLD_PERCENT = 20  # configurable

df = pd.read_csv("data/processed/punjab_mandi_arrival_features.csv")
df["Date"] = pd.to_datetime(df["Date"])

def get_surplus_alert(commodity):
    sub = df[df["Commodity"] == commodity].sort_values("Date")
    last_date = sub["Date"].max()

    demand_baseline = sub.tail(30)["Arrival Quantity"].mean()

    model = joblib.load(f"models/{commodity.lower()}_arrival_model.pkl")
    last_7 = sub.tail(7)["Arrival Quantity"]
    next_date = last_date + pd.Timedelta(days=1)

    feature_names = ["lag_1", "lag_7", "rolling_mean_7", "month", "day_of_year"]
    features = pd.DataFrame([[
        sub.iloc[-1]["Arrival Quantity"],
        sub.iloc[-7]["Arrival Quantity"],
        last_7.mean(),
        next_date.month,
        next_date.dayofyear,
    ]], columns=feature_names)
    forecasted_supply = model.predict(features)[0]

    surplus_pct = ((forecasted_supply - demand_baseline) / demand_baseline) * 100

    if surplus_pct >= 50:
        severity = "severe"
    elif surplus_pct >= 20:
        severity = "moderate"
    else:
        severity = "none"

    return {
        "commodity": commodity,
        "forecasted_supply": round(float(forecasted_supply), 2),
        "demand_baseline_proxy": round(float(demand_baseline), 2),
        "surplus_percent": round(float(surplus_pct), 2),
        "surplus_alert": bool(surplus_pct >= SURPLUS_THRESHOLD_PERCENT),
        "severity": severity,
        "threshold_percent": SURPLUS_THRESHOLD_PERCENT,
    }

if __name__ == "__main__":
    for c in ["Onion", "Potato", "Tomato"]:
        print(get_surplus_alert(c))