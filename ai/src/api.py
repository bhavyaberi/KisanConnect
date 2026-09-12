from fastapi import FastAPI, HTTPException
import pandas as pd
import joblib

from src.surplus_detection import get_surplus_alert
from src.recommendation import recommend_best_market_time

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="KisanConnect AI - Price Forecasting")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for hackathon/demo simplicity; restrict this in real production
    allow_methods=["*"],
    allow_headers=["*"],
)


# Load data and models once at startup, not per-request (much faster)
df = pd.read_csv("data/processed/punjab_mandi_features.csv")
df["Date"] = pd.to_datetime(df["Date"])

models = {
    "Onion": joblib.load("models/onion_price_model.pkl"),
    "Potato": joblib.load("models/potato_price_model.pkl"),
    "Tomato": joblib.load("models/tomato_price_model.pkl"),
}

def build_next_day_features(commodity: str):
    sub = df[df["Commodity"] == commodity].sort_values("Date")
    if sub.empty:
        return None

    last_date = sub["Date"].max()
    next_date = last_date + pd.Timedelta(days=1)

    last_7 = sub.tail(7)["Modal Price"]

    lag_1 = sub.iloc[-1]["Modal Price"]
    lag_7 = sub.iloc[-7]["Modal Price"]
    rolling_mean_7 = last_7.mean()

    feature_names = ["lag_1", "lag_7", "rolling_mean_7", "month", "day_of_year"]
    features = pd.DataFrame([[
        lag_1,
        lag_7,
        rolling_mean_7,
        next_date.month,
        next_date.dayofyear,
    ]], columns=feature_names)
    return features, next_date, last_date

@app.get("/predict/price")
def predict_price(commodity: str):
    commodity = commodity.capitalize()

    if commodity not in models:
        raise HTTPException(status_code=400, detail=f"Unknown commodity: {commodity}")

    result = build_next_day_features(commodity)
    if result is None:
        raise HTTPException(status_code=404, detail=f"No data found for {commodity}")

    features, next_date, last_date = result
    model = models[commodity]
    predicted_price = model.predict(features)[0]

    return {
        "commodity": commodity,
        "based_on_data_up_to": str(last_date.date()),
        "predicted_date": str(next_date.date()),
        "predicted_modal_price": round(float(predicted_price), 2),
        "unit": "Rs./Quintal",
    }

@app.get("/predict/demand")
def predict_demand(commodity: str):
    commodity = commodity.capitalize()
    if commodity not in ["Onion", "Potato", "Tomato"]:
        raise HTTPException(status_code=400, detail=f"Unknown commodity: {commodity}")

    arrival_df = pd.read_csv("data/processed/punjab_mandi_arrival_features.csv")
    arrival_df["Date"] = pd.to_datetime(arrival_df["Date"])
    sub = arrival_df[arrival_df["Commodity"] == commodity].sort_values("Date")

    model = joblib.load(f"models/{commodity.lower()}_arrival_model.pkl")
    last_date = sub["Date"].max()
    next_date = last_date + pd.Timedelta(days=1)
    feature_names = ["lag_1", "lag_7", "rolling_mean_7", "month", "day_of_year"]
    feats = pd.DataFrame([[
        sub.iloc[-1]["Arrival Quantity"],
        sub.iloc[-7]["Arrival Quantity"],
        sub.tail(7)["Arrival Quantity"].mean(),
        next_date.month,
        next_date.dayofyear,
    ]], columns=feature_names)

    pred = model.predict(feats)[0]
    return {
        "commodity": commodity,
        "note": "This forecasts arrival quantity (supply-side) as a proxy, since no real buyer demand data exists yet.",
        "based_on_data_up_to": str(last_date.date()),
        "predicted_date": str(next_date.date()),
        "predicted_arrival_quantity": round(float(pred), 2),
        "unit": "Metric Tonnes",
    }

@app.get("/surplus-alert")
def surplus_alert(commodity: str):
    commodity = commodity.capitalize()
    if commodity not in ["Onion", "Potato", "Tomato"]:
        raise HTTPException(status_code=400, detail=f"Unknown commodity: {commodity}")
    return get_surplus_alert(commodity)

@app.get("/recommendations")
def recommendations(commodity: str):
    commodity = commodity.capitalize()
    if commodity not in ["Onion", "Potato", "Tomato"]:
        raise HTTPException(status_code=400, detail=f"Unknown commodity: {commodity}")
    return recommend_best_market_time(commodity)

@app.get("/history")
def get_history(commodity: str, days: int = 90):
    commodity = commodity.capitalize()
    if commodity not in ["Onion", "Potato", "Tomato"]:
        raise HTTPException(status_code=400, detail=f"Unknown commodity: {commodity}")

    sub = df[df["Commodity"] == commodity].sort_values("Date").tail(days)

    return {
        "commodity": commodity,
        "days_returned": len(sub),
        "history": [
            {
                "date": str(row["Date"].date()),
                "modal_price": round(float(row["Modal Price"]), 2),
                "arrival_quantity": round(float(row["Arrival Quantity"]), 2),
            }
            for _, row in sub.iterrows()
        ],
    }

@app.get("/market-overview")
def market_overview():
    overview = []
    for commodity in ["Onion", "Potato", "Tomato"]:
        result = build_next_day_features(commodity)
        features, next_date, last_date = result
        predicted_price = models[commodity].predict(features)[0]
        surplus_info = get_surplus_alert(commodity)

        overview.append({
            "commodity": commodity,
            "predicted_price": round(float(predicted_price), 2),
            "surplus_percent": surplus_info["surplus_percent"],
            "severity": surplus_info["severity"],
        })

    return {"date": str(df["Date"].max().date()), "crops": overview}