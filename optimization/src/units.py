"""
units.py
--------
KhetSetu lists produce in different units (kg, bunch, dozen, pc, week basket).
The route solver only understands weight, so we convert everything to kg.

These factors are ROUGH ASSUMPTIONS for the prototype, not measured values.
Tune them here in one place.
"""

KG_PER_UNIT = {
    "kg": 1.0,
    "bunch": 0.25,   # e.g. spinach
    "dozen": 1.5,    # e.g. mangoes
    "pc": 0.4,       # e.g. cauliflower
    "week": 5.0,     # weekly veg basket
}


def to_kg(quantity: float, unit: str = "kg") -> float:
    """Convert a quantity in a marketplace unit to kg. Accepts '/kg' style too."""
    key = unit.strip().lower().lstrip("/")
    if key not in KG_PER_UNIT:
        raise ValueError(f"Unknown unit '{unit}'. Supported: {', '.join(KG_PER_UNIT)}")
    return round(quantity * KG_PER_UNIT[key], 3)
