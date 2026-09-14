# KisanConnect — AI/ML Module

AI/ML module for KisanConnect, an agricultural marketplace aiming to reduce
intermediaries between farmers/FPOs and buyers.

**Owner:** Krishika — AI/ML Engineer
**Scope (Phase 1 prototype):** Punjab, 3 crops — Tomato, Onion, Potato

## What this module does

| Feature | Endpoint | Status |
|---|---|---|
| Price forecasting | `GET /predict/price?commodity=` | Real ML model |
| Supply forecasting (proxy for demand) | `GET /predict/demand?commodity=` | Real ML model |
| Surplus detection | `GET /surplus-alert?commodity=` | Rule-based logic |
| Sell-timing recommendation | `GET /recommendations?commodity=` | Derived from price model |

## Data — what's real, what's proxy

- **Source:** AGMARKNET (Government of India), via the "All Type of Report
  (All Grades)" historical export — real, publicly available mandi price and
  arrival data.
- **Coverage:** Punjab state-level daily data, 1 Jan 2024 – 10 Sep 2026,
  for Tomato, Onion, and Potato. No missing days, no duplicate dates
  (independently verified).
- **Granularity:** State-level aggregate, not per-mandi/per-market. This was
  a deliberate tradeoff — state-level data was complete and gap-free;
  market-wise data was sparser and better suited for a future
  logistics/recommendation feature, not the core forecasting model.
- **No real KisanConnect transaction data exists yet** — the platform has no
  live orders. "Demand forecasting" in this prototype actually forecasts
  **arrival quantity (supply-side)**, explicitly labeled as a proxy in the
  API response itself. We chose this over fabricating synthetic demand
  numbers, since real government supply data is more defensible than
  invented demand data.

## Modeling approach

- **Model:** RandomForestRegressor per crop (6 models total: price + arrival,
  × 3 crops). Chosen for handling non-linear seasonal patterns without
  manual curve-fitting, and for being explainable — no deep learning, since
  the dataset size and problem don't need it.
- **Features:** `lag_1`, `lag_7` (price/arrival 1 and 7 days ago),
  `rolling_mean_7` (past 7-day average, excluding today to avoid leakage),
  `month`, `day_of_year` (calendar/seasonal signal).
- **Train/test split:** Chronological, not random — train on data before
  1 June 2026, test on data after. This avoids data leakage that a random
  split would cause in a time-series problem.
- **Baseline:** Naive persistence forecast ("tomorrow = today"), used as the
  benchmark our real model must beat.

## Evaluation results (test period: 1 Jun – 10 Sep 2026)

| Crop | Baseline MAE | Model MAE | Baseline MAPE | Model MAPE |
|---|---|---|---|---|
| Onion | 139.8 | 160.6 | 6.34% | 7.21% |
| Potato | 50.8 | 56.6 | 8.00% | 9.00% |
| Tomato | 204.6 | 174.6 | 10.83% | 9.42% |

**Honest finding:** the model only beats the naive baseline on Tomato.
Onion and Potato have smoother, slower-moving prices where "yesterday's
price" is already a strong predictor, leaving little room for improvement.
Tomato is far more volatile (see seasonality note below), which is exactly
where a model that learns seasonal/momentum patterns adds real value.

## Seasonality

Visual inspection of the raw price series (2024 vs 2025) confirmed strong,
repeating annual seasonality for both Tomato and Potato — prices rise
through mid-year to a September/October peak, then fall. This justified
including calendar features (`month`, `day_of_year`) rather than assuming
seasonality without checking.

## Known limitations

- State-level, not per-mandi or per-buyer — can't yet recommend a specific
  market or buyer.
- Multi-day forecasts (used in `/recommendations`) compound error, since
  each day's prediction feeds into the next day's lag features. Day-1
  forecasts are more reliable than Day-7.
- Surplus detection uses a 30-day rolling arrival average as a demand proxy,
  not real buyer demand — clearly labeled as such in the API response.
- Arrival quantity is harder to predict than price (20–25% MAPE vs 6–10%
  for price), consistent with day-to-day harvest/transport being more
  erratic than market pricing.
- Recommendation engine currently scores only by predicted price trend
  (no proximity/buyer-history scoring yet), since KisanConnect has no real
  buyer or location data to draw on at this stage.

## Project structure
ai/
├── data/
│ ├── raw/ # Original AGMARKNET Excel exports
│ └── processed/ # Cleaned, feature-engineered CSVs
├── models/ # Saved .pkl models (price + arrival, per crop)
├── src/
│ ├── build_dataset.py # Raw Excel -> cleaned combined CSV
│ ├── build_features.py # Adds lag/rolling/calendar features
│ ├── verify_processed_data.py # Independent data integrity check
│ ├── train_test_split.py # Chronological split + validation
│ ├── baseline_evaluate.py # Naive baseline benchmark
│ ├── train_model.py # Trains + evaluates price models
│ ├── train_arrival_model.py # Trains + evaluates arrival models
│ ├── surplus_detection.py # Rule-based surplus logic
│ ├── recommendation.py # Sell-timing recommendation logic
│ └── api.py # FastAPI app exposing all endpoints
├── notebooks/
├── tests/
└── requirements.txt


## How to run

```bash
# from the ai/ directory, with venv activated
uvicorn src.api:app --reload
```

Then open `http://127.0.0.1:8000/docs` for interactive testing of all
4 endpoints.

## Next steps (post-prototype)

- Per-mandi/market-level granularity for buyer-matching recommendations
- Real demand data once KisanConnect has live transactions
- Proximity-based scoring in the recommendation engine
- Hyperparameter tuning (not done yet — deliberately deprioritized in favor
  of full pipeline coverage for the internal hackathon deadline)
