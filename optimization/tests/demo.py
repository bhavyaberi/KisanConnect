"""
demo.py
-------
Runs the greedy baseline and the optimizer on data/sample_route_request.json
and prints both routes with the distance saved.

    cd optimization
    python3 -m tests.demo
"""

import json
import os

from src.heuristic import greedy_route
from src.units import to_kg
from src.vrp_ortools import solve_delivery_route


def load_sample():
    path = os.path.join(os.path.dirname(__file__), "..", "data", "sample_route_request.json")
    with open(path) as f:
        data = json.load(f)
    orders = [
        {"order_id": o["order_id"], "item": o["item"], "weight_kg": to_kg(o["quantity"], o["unit"]),
         "fpo": o["fpo"], "buyer": o["buyer"]}
        for o in data["orders"]
    ]
    return data["partner_start"], orders, data["vehicle_capacity_kg"]


def show(result):
    labels = {"start": "START ", "pickup": "PICKUP", "drop": "DROP  "}
    for s in result["route"]:
        extra = f"  [{s['order_id']} {s['item']}]" if s["order_id"] else ""
        print(f"  {labels[s['kind']]} {s['name']}{extra}  -> load {s['load_after_kg']} kg")
    print("  Total distance:", result["total_distance_km"], "km")


def main():
    start, orders, capacity = load_sample()
    total_weight = sum(o["weight_kg"] for o in orders)
    print(f"Orders: {len(orders)} | Capacity: {capacity} kg | Total weight: {total_weight:.1f} kg\n")

    print("Greedy baseline (nearest allowed stop):")
    base = greedy_route(start, orders, capacity)
    show(base)

    print("\nOptimized (OR-Tools):")
    best = solve_delivery_route(start, orders, capacity)
    show(best)
    print(f"  Peak load: {best['peak_load_kg']} kg / {capacity} kg | ~{best['estimated_minutes']} min")

    saved = (base["total_distance_km"] - best["total_distance_km"]) / base["total_distance_km"] * 100
    print(f"\nOptimized route is {saved:.1f}% shorter than the greedy baseline on this sample.")


if __name__ == "__main__":
    main()
