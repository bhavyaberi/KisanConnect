"""
heuristic.py
------------
Baseline planner: greedy "go to the nearest stop that's allowed".

A delivery partner picks up orders from FPOs and drops them at buyers.
Rules the greedy planner follows:
  - can't drop an order before it's picked up
  - can't pick up if it would go over the vehicle capacity

It only looks one step ahead, so it can make a route that looks fine now
and forces a long detour later. That's what the OR-Tools solver fixes,
and it gives us a baseline number to compare against.
"""

from src.distance import haversine_distance_km


def greedy_route(start: dict, orders: list[dict], capacity_kg: float) -> dict:
    """
    start  : {"name", "lat", "lon"}  delivery partner's starting point
    orders : list of {"order_id", "item", "weight_kg", "fpo": {...}, "buyer": {...}}
    """
    todo_pickup = list(orders)   # not picked up yet
    on_board = []                # picked up, not delivered yet
    current = start
    load = 0.0
    total = 0.0
    route = [{"name": start["name"], "kind": "start", "order_id": None, "item": "", "load_after_kg": 0.0}]

    while todo_pickup or on_board:
        options = []
        for o in todo_pickup:
            if load + o["weight_kg"] <= capacity_kg:
                options.append(("pickup", o, o["fpo"]))
        for o in on_board:
            options.append(("drop", o, o["buyer"]))

        kind, order, place = min(
            options,
            key=lambda x: haversine_distance_km(current["lat"], current["lon"], x[2]["lat"], x[2]["lon"]),
        )
        total += haversine_distance_km(current["lat"], current["lon"], place["lat"], place["lon"])
        current = place

        if kind == "pickup":
            todo_pickup.remove(order)
            on_board.append(order)
            load += order["weight_kg"]
        else:
            on_board.remove(order)
            load -= order["weight_kg"]

        route.append({
            "name": place["name"], "kind": kind, "order_id": order["order_id"],
            "item": order.get("item", ""), "load_after_kg": round(load, 3),
        })

    return {"route": route, "total_distance_km": round(total, 2)}
