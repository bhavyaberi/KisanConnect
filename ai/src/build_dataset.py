import pandas as pd


def load_and_clean_mandi_file(filepath):
    df = pd.read_excel(filepath, skiprows=1)
    df = df.dropna(subset=["Date"])
    df["Date"] = pd.to_datetime(df["Date"], format="%d-%m-%Y")

    # Rename the year-specific columns to generic, consistent names
    df = df.rename(columns={
        col: "Arrival Quantity" for col in df.columns if col.startswith("Arrival Quantity")
    })
    df = df.rename(columns={
        col: "Modal Price" for col in df.columns if col.startswith("Modal Price")
    })
    return df

# Load all the files
onion_2024 = load_and_clean_mandi_file("data/raw/punjab_onion_2024.xlsx")
onion_2025 = load_and_clean_mandi_file("data/raw/punjab_onion_2025.xlsx")
onion_2026 = load_and_clean_mandi_file("data/raw/punjab_onion_2026.xlsx")
onion_full = pd.concat([onion_2024, onion_2025, onion_2026], ignore_index=True)

potato_2024 = load_and_clean_mandi_file("data/raw/punjab_potato_2024.xlsx")
potato_2025 = load_and_clean_mandi_file("data/raw/punjab_potato_2025.xlsx")
potato_2026 = load_and_clean_mandi_file("data/raw/punjab_potato_2026.xlsx")
potato_full = pd.concat([potato_2024, potato_2025, potato_2026], ignore_index=True)

tomato_2024 = load_and_clean_mandi_file("data/raw/punjab_tomato_2024.xlsx")
tomato_2025 = load_and_clean_mandi_file("data/raw/punjab_tomato_2025.xlsx")
tomato_2026 = load_and_clean_mandi_file("data/raw/punjab_tomato_2026.xlsx")
tomato_full = pd.concat([tomato_2024, tomato_2025, tomato_2026], ignore_index=True)

print(potato_full.shape)
print(tomato_full.shape)
print(onion_full.shape)

mandi_full = pd.concat([onion_full, potato_full, tomato_full], ignore_index=True)

print(mandi_full.shape)
print(mandi_full["Commodity"].value_counts())

mandi_full.to_csv("data/processed/punjab_mandi_prices.csv", index=False)
print("Saved:", mandi_full.shape)
