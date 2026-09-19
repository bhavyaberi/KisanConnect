"""
vrp_ortools.py
--------------
Delivery route planner for KhetSetu, built on Google OR-Tools.

THE PROBLEM
A delivery partner starts somewhere in their neighbourhood. There are a few
orders. Each order = "pick up X kg from an FPO, drop it at a buyer"
(a consumer's doorstep or a bulk buyer). We want the shortest route where:
  1. every order is picked up, then delivered
  2. an order is never dropped before it's picked up
  3. the load on the vehicle never goes above its capacity
     (pickups add weight, drops remove it)
  4. the partner doesn't need to come back to the start - the route
     ends at the last drop

This is a Pickup-and-Delivery Problem with capacity (a VRP variant).
It's operations research, not machine learning.
"""

from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp

from src.distance import build_distance_matrix

DEFAULT_SPEED_KMPH = 20  # assumption: bicycle / small two-wheeler in town


def solve_delivery_route(
    start: dict,
    orders: list[dict],
    vehicle_capacity_kg: float,
    speed_kmph: float = DEFAULT_SPEED_KMPH,
    time_limit_s: int = 2,
) -> dict:
    """
    start  : {"name", "lat", "lon"}
    orders : list of {"order_id", "item", "weight_kg", "fpo": {name,lat,lon}, "buyer": {name,lat,lon}}
    """
    if not orders:
        return _result([_stop(start, "start", None, "", 0.0)], 0.0, 0.0, speed_kmph)

    # An order heavier than the vehicle can never be carried - say so clearly.
    too_heavy = [o["order_id"] for o in orders if o["weight_kg"] > vehicle_capacity_kg]
    if too_heavy:
        return _infeasible(
            f"Order(s) {', '.join(map(str, too_heavy))} are heavier than the vehicle capacity "
            f"({vehicle_capacity_kg} kg). Split them or use a bigger vehicle."
        )

    n = len(orders)
    # Node layout: 0 = start | 1..n = FPO pickups | n+1..2n = buyer drops | 2n+1 = dummy end
    locations = [start] + [o["fpo"] for o in orders] + [o["buyer"] for o in orders]
    end_node = len(locations)

    km = build_distance_matrix(locations)
    scaled = [[int(round(d * 1000)) for d in row] for row in km]  # metres (ints)
    # Dummy end node: distance 0 to/from everywhere, so the route ends at the
    # last drop instead of returning to the start.
    for row in scaled:
        row.append(0)
    scaled.append([0] * (end_node + 1))

    grams = [int(round(o["weight_kg"] * 1000)) for o in orders]
    demands = [0] + grams + [-g for g in grams] + [0]  # + at pickup, - at drop

    manager = pywrapcp.RoutingIndexManager(end_node + 1, 1, [0], [end_node])
    routing = pywrapcp.RoutingModel(manager)

    def distance_cb(i, j):
        return scaled[manager.IndexToNode(i)][manager.IndexToNode(j)]

    transit = routing.RegisterTransitCallback(distance_cb)
    routing.SetArcCostEvaluatorOfAllVehicles(transit)

    # Capacity: running load must stay between 0 and capacity at every stop.
    def demand_cb(i):
        return demands[manager.IndexToNode(i)]

    demand = routing.RegisterUnaryTransitCallback(demand_cb)
    routing.AddDimensionWithVehicleCapacity(
        demand, 0, [int(round(vehicle_capacity_kg * 1000))], True, "Load"
    )

    # Distance dimension - needed to force "pickup happens before drop".
    routing.AddDimension(transit, 0, 10_000_000, True, "Distance")
    dist_dim = routing.GetDimensionOrDie("Distance")

    for k in range(n):
        p = manager.NodeToIndex(1 + k)
        d = manager.NodeToIndex(1 + n + k)
        routing.AddPickupAndDelivery(p, d)
        routing.solver().Add(routing.VehicleVar(p) == routing.VehicleVar(d))
        routing.solver().Add(dist_dim.CumulVar(p) <= dist_dim.CumulVar(d))

    params = pywrapcp.DefaultRoutingSearchParameters()
    params.first_solution_strategy = routing_enums_pb2.FirstSolutionStrategy.PARALLEL_CHEAPEST_INSERTION
    params.local_search_metaheuristic = routing_enums_pb2.LocalSearchMetaheuristic.GUIDED_LOCAL_SEARCH
    params.time_limit.FromSeconds(time_limit_s)

    solution = routing.SolveWithParameters(params)
    if solution is None:
        return _infeasible("No feasible route found for these orders and vehicle capacity.")

    # ---- Read the route back out ----
    stops = []
    load = 0.0
    peak = 0.0
    total_m = 0
    index = routing.Start(0)
    while not routing.IsEnd(index):
        node = manager.IndexToNode(index)
        load += demands[node] / 1000
        peak = max(peak, load)
        if node == 0:
            stops.append(_stop(start, "start", None, "", 0.0))
        elif node <= n:
            o = orders[node - 1]
            stops.append(_stop(o["fpo"], "pickup", o["order_id"], o.get("item", ""), load))
        else:
            o = orders[node - n - 1]
            stops.append(_stop(o["buyer"], "drop", o["order_id"], o.get("item", ""), load))
        nxt = solution.Value(routing.NextVar(index))
        total_m += routing.GetArcCostForVehicle(index, nxt, 0)
        index = nxt

    return _result(stops, total_m / 1000, peak, speed_kmph)


# ------------------------------- helpers -------------------------------

def _stop(place, kind, order_id, item, load_after):
    return {"name": place["name"], "kind": kind, "order_id": order_id,
            "item": item, "load_after_kg": round(load_after, 3)}


def _result(stops, distance_km, peak_kg, speed_kmph):
    return {
        "route": stops,
        "total_distance_km": round(distance_km, 2),
        "estimated_minutes": round(distance_km / speed_kmph * 60),
        "peak_load_kg": round(peak_kg, 3),
        "feasible": True,
        "message": "",
    }


def _infeasible(message):
    return {"route": [], "total_distance_km": 0, "estimated_minutes": 0,
            "peak_load_kg": 0, "feasible": False, "message": message}
