import pandas as pd
import joblib

def recommend_best_market_time(commodity):
    """
    Simple, explainable recommendation:
    Since we don't have per-market granularity in our current dataset (state-level only),
    this recommends WHEN to sell based on forecasted price trend, not WHERE.
    """
    df = pd.read_csv("data/processed/punjab_mandi_features.csv")
    df["Date"] = pd.to_datetime(df["Date"])
    sub = df[df["Commodity"] == commodity].sort_values("Date")

    model = joblib.load(f"models/{commodity.lower()}_price_model.pkl")
    last_date = sub["Date"].max()

    feature_names = ["lag_1", "lag_7", "rolling_mean_7", "month", "day_of_year"]
    current_price = sub.iloc[-1]["Modal Price"]

    # Forecast next 7 days, one day at a time
    history = sub["Modal Price"].tolist()
    forecasts = []
    for i in range(1, 8):
        next_date = last_date + pd.Timedelta(days=i)
        feats = pd.DataFrame([[
            history[-1], history[-7], sum(history[-7:]) / 7,
            next_date.month, next_date.dayofyear,
        ]], columns=feature_names)
        pred = model.predict(feats)[0]
        forecasts.append({"date": str(next_date.date()), "predicted_price": round(float(pred), 2)})
        history.append(pred)

    best_day = max(forecasts, key=lambda x: x["predicted_price"])

    return {
        "commodity": commodity,
        "current_price": round(float(current_price), 2),
        "next_7_day_forecast": forecasts,
        "recommendation": f"Best predicted day to sell in next 7 days: {best_day['date']} at ~Rs.{best_day['predicted_price']}/quintal",
    }

if __name__ == "__main__":
    for c in ["Onion", "Potato", "Tomato"]:
        print(recommend_best_market_time(c))
        print()