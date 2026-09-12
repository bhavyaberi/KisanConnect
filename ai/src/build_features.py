import pandas as pd

# Load the processed dataset
df = pd.read_csv("data/processed/punjab_mandi_prices.csv")
df["Date"] = pd.to_datetime(df["Date"])

# Sort by Commodity, then Date - crucial for correct lag/rolling computation
df = df.sort_values(["Commodity", "Date"]).reset_index(drop=True)

# Calendar features
df["month"] = df["Date"].dt.month
df["day_of_year"] = df["Date"].dt.dayofyear

# Lag features - computed SEPARATELY per commodity
df["lag_1"] = df.groupby("Commodity")["Modal Price"].shift(1)
df["lag_7"] = df.groupby("Commodity")["Modal Price"].shift(7)

# Rolling 7-day average of the PAST 7 days, not including today
df["rolling_mean_7"] = (
    df.groupby("Commodity")["Modal Price"]
    .shift(1)
    .rolling(window=7)
    .mean()
)

before_drop = df.shape[0]
df = df.dropna(subset=["lag_1", "lag_7", "rolling_mean_7"])
after_drop = df.shape[0]
print(f"Dropped {before_drop - after_drop} rows with missing lag/rolling features")

# Final checks before saving
print(df.shape)
print(df[["Commodity", "Date", "Modal Price", "lag_1", "lag_7", "rolling_mean_7", "month", "day_of_year"]].head(10))

# Save once
df.to_csv("data/processed/punjab_mandi_features.csv", index=False)
print("Saved features file:", df.shape)