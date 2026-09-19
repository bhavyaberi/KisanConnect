"""
heuristic.py
------------
Greedy baseline planner: from the current position, always go to the nearest
stop that is currently allowed.

Rules it follows (same as the optimizer):
  - an order can only be dropped after it has been picked up
  - a pickup is skipped while it would push the load over capacity

It only looks one stop ahead, so it can force long detours later. It is kept
as a reference to measure how much the optimizer in vrp_ortools.py improves on
simple greedy routing.
"""

from src.distance import haversine_distance_km


def greedy_route(start: dict, orders: list[dict], capacity_kg: float) -> dict:
    """
    start  : {"name", "lat", "lon"}
    orders : [{"order_id", "item", "weight_kg", "fpo": {...}, "buyer": {...}}, ...]
    """
    to_pick_up = list(orders)
    on_board: list[dict] = []
    current = start
    load = 0.0
    total_km = 0.0
    route = [{"name": start["name"], "kind": "start", "order_id": None, "item": "", "load_after_kg": 0.0}]

    while to_pick_up or on_board:
        options = [("pickup", o, o["fpo"]) for o in to_pick_up if load + o["weight_kg"] <= capacity_kg]
        options += [("drop", o, o["buyer"]) for o in on_board]

        kind, order, place = min(
            options,
            key=lambda x: haversine_distance_km(current["lat"], current["lon"], x[2]["lat"], x[2]["lon"]),
        )
        total_km += haversine_distance_km(current["lat"], current["lon"], place["lat"], place["lon"])
        current = place

        if kind == "pickup":
            to_pick_up.remove(order)
            on_board.append(order)
            load += order["weight_kg"]
        else:
            on_board.remove(order)
            load -= order["weight_kg"]

        route.append({
            "name": place["name"], "kind": kind, "order_id": order["order_id"],
            "item": order.get("item", ""), "load_after_kg": round(load, 3),
        })

    return {"route": route, "total_distance_km": round(total_km, 2)}
