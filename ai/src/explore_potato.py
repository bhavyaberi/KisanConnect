import pandas as pd
import matplotlib.pyplot as plt

# Load the processed dataset
df = pd.read_csv("data/processed/punjab_mandi_prices.csv")

# Re-apply datetime conversion (remember: CSV doesn't preserve dtypes)
df["Date"] = pd.to_datetime(df["Date"])

# Filter to just Potato, and sort by date
potato = df[df["Commodity"] == "Potato"].sort_values("Date")

# Plot
plt.figure(figsize=(12, 5))
plt.plot(potato["Date"], potato["Modal Price"])
plt.title("Punjab Potato Modal Price (2024-2026)")
plt.xlabel("Date")
plt.ylabel("Modal Price (Rs./Quintal)")
plt.show()