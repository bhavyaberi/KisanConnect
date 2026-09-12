import pandas as pd

check = pd.read_csv("data/processed/punjab_mandi_prices.csv")
print(check.shape)
print(check.dtypes)
print(check.head())