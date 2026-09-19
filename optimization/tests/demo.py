"""
demo.py
-------
Runs the greedy baseline and the OR-Tools planner on the sample KhetSetu
orders and prints both, plus the distance improvement.

Run:
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
        {
            "order_id": o["order_id"], "item": o["item"],
            "weight_kg": to_kg(o["quantity"], o["unit"]),
            "fpo": o["fpo"], "buyer": o["buyer"],
        }
        for o in data["orders"]
    ]
    return data["partner_start"], orders, data["vehicle_capacity_kg"]


def show(result):
    for s in result["route"]:
        label = {"start": "START ", "pickup": "PICKUP", "drop": "DROP  "}[s["kind"]]
        extra = f"  [{s['order_id']} {s['item']}]" if s["order_id"] else ""
        print(f"  {label} {s['name']}{extra}  -> load {s['load_after_kg']} kg")
    print("  Total distance:", result["total_distance_km"], "km")


def main():
    start, orders, capacity = load_sample()
    print("=" * 60)
    print("KHETSETU DELIVERY ROUTE - DEMO")
    print("=" * 60)
    print(f"Orders: {len(orders)} | Vehicle capacity: {capacity} kg | "
          f"Total weight: {sum(o['weight_kg'] for o in orders):.1f} kg\n")

    print("BASELINE: greedy nearest stop")
    base = greedy_route(start, orders, capacity)
    show(base)

    print("\nOPTIMIZED: OR-Tools")
    best = solve_delivery_route(start, orders, capacity)
    show(best)
    print(f"  Peak load: {best['peak_load_kg']} kg / {capacity} kg | ~{best['estimated_minutes']} min")

    if base["total_distance_km"] > 0 and best["feasible"]:
        pct = (base["total_distance_km"] - best["total_distance_km"]) / base["total_distance_km"] * 100
        print(f"\nOptimized route is {pct:.1f}% shorter than the greedy baseline")
        print("(measured on this synthetic sample only, not a general claim)")


if __name__ == "__main__":
    main()
