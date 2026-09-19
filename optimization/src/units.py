"""
units.py
--------
KhetSetu lists produce in different units (kg, bunch, dozen, piece, weekly
basket). Vehicle capacity is a weight, so every quantity is converted to kg
before routing.

The factors below are approximate averages. Adjust them here if the
marketplace uses different pack sizes.
"""

KG_PER_UNIT = {
    "kg": 1.0,
    "bunch": 0.25,   # leafy greens such as spinach
    "dozen": 1.5,    # fruit such as mangoes
    "pc": 0.4,       # single items such as cauliflower
    "week": 5.0,     # weekly vegetable basket
}


def to_kg(quantity: float, unit: str = "kg") -> float:
    """Convert a quantity in a marketplace unit to kg. Accepts '/kg' style units too."""
    key = unit.strip().lower().lstrip("/")
    if key not in KG_PER_UNIT:
        raise ValueError(f"Unknown unit '{unit}'. Supported units: {', '.join(KG_PER_UNIT)}")
    return round(quantity * KG_PER_UNIT[key], 3)
