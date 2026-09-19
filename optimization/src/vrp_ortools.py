"""
vrp_ortools.py
--------------
Delivery route optimizer for KhetSetu, built on Google OR-Tools.

PROBLEM
A delivery partner starts at some point. Each order says: pick up this much
produce from an FPO, deliver it to a buyer (a consumer's doorstep or a bulk
buyer). Find the shortest route such that:
  1. every order is picked up and delivered
  2. an order is never dropped before it is picked up
  3. the load on the vehicle never exceeds its capacity
     (a pickup adds weight, a drop removes it)
  4. the route ends at the last drop, without returning to the start

This is a Capacitated Pickup-and-Delivery Problem, a variant of the Vehicle
Routing Problem. It is NP-hard, so the solver builds a starting route and then
improves it with guided local search within a time limit.

MODEL LAYOUT
Node 0            : partner start
Nodes 1..n        : FPO pickup of order 1..n
Nodes n+1..2n     : buyer drop of order 1..n
Node 2n+1 (dummy) : route end. Distance 0 to and from every node, which lets
                    the route finish at the last drop instead of coming back.
"""

from ortools.constraint_solver import pywrapcp, routing_enums_pb2

from src.distance import build_distance_matrix

DEFAULT_SPEED_KMPH = 20  # average speed used for the time estimate (bicycle / small two-wheeler)


def solve_delivery_route(
    start: dict,
    orders: list[dict],
    vehicle_capacity_kg: float,
    speed_kmph: float = DEFAULT_SPEED_KMPH,
    time_limit_s: int = 2,
) -> dict:
    """
    start  : {"name", "lat", "lon"}
    orders : [{"order_id", "item", "weight_kg",
               "fpo": {"name","lat","lon"}, "buyer": {"name","lat","lon"}}, ...]

    Returns a dict with: route (list of stops), total_distance_km,
    estimated_minutes, peak_load_kg, feasible, message.
    """
    if not orders:
        return {
            "route": [_stop(start, "start", None, "", 0.0)],
            "total_distance_km": 0.0, "estimated_minutes": 0,
            "peak_load_kg": 0.0, "feasible": True, "message": "",
        }

    too_heavy = [o["order_id"] for o in orders if o["weight_kg"] > vehicle_capacity_kg]
    if too_heavy:
        return _infeasible(
            f"Order(s) {', '.join(map(str, too_heavy))} exceed the vehicle capacity "
            f"({vehicle_capacity_kg} kg). Split the order or use a larger vehicle."
        )

    n = len(orders)
    places = [start] + [o["fpo"] for o in orders] + [o["buyer"] for o in orders]
    end_node = len(places)

    # Distances in metres (OR-Tools works with integers), plus the dummy end node.
    km = build_distance_matrix(places)
    dist = [[int(round(d * 1000)) for d in row] + [0] for row in km]
    dist.append([0] * (end_node + 1))

    grams = [int(round(o["weight_kg"] * 1000)) for o in orders]
    demand = [0] + grams + [-g for g in grams] + [0]  # + at pickup, - at drop

    manager = pywrapcp.RoutingIndexManager(end_node + 1, 1, [0], [end_node])
    routing = pywrapcp.RoutingModel(manager)

    # Cost of travelling between two stops = distance.
    transit = routing.RegisterTransitCallback(
        lambda i, j: dist[manager.IndexToNode(i)][manager.IndexToNode(j)]
    )
    routing.SetArcCostEvaluatorOfAllVehicles(transit)

    # Capacity: the running load must stay between 0 and the vehicle capacity.
    load_cb = routing.RegisterUnaryTransitCallback(lambda i: demand[manager.IndexToNode(i)])
    routing.AddDimensionWithVehicleCapacity(
        load_cb, 0, [int(round(vehicle_capacity_kg * 1000))], True, "Load"
    )

    # Distance dimension, used to enforce "pickup happens before drop".
    routing.AddDimension(transit, 0, 10_000_000, True, "Distance")
    dist_dim = routing.GetDimensionOrDie("Distance")
    for k in range(n):
        pickup = manager.NodeToIndex(1 + k)
        drop = manager.NodeToIndex(1 + n + k)
        routing.AddPickupAndDelivery(pickup, drop)
        routing.solver().Add(routing.VehicleVar(pickup) == routing.VehicleVar(drop))
        routing.solver().Add(dist_dim.CumulVar(pickup) <= dist_dim.CumulVar(drop))

    params = pywrapcp.DefaultRoutingSearchParameters()
    params.first_solution_strategy = routing_enums_pb2.FirstSolutionStrategy.PARALLEL_CHEAPEST_INSERTION
    params.local_search_metaheuristic = routing_enums_pb2.LocalSearchMetaheuristic.GUIDED_LOCAL_SEARCH
    params.time_limit.FromSeconds(time_limit_s)

    solution = routing.SolveWithParameters(params)
    if solution is None:
        return _infeasible("No feasible route found for these orders and vehicle capacity.")

    # Read the route out of the solution.
    stops, load, peak, total_m = [], 0.0, 0.0, 0
    index = routing.Start(0)
    while not routing.IsEnd(index):
        node = manager.IndexToNode(index)
        load += demand[node] / 1000
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

    total_km = total_m / 1000
    return {
        "route": stops,
        "total_distance_km": round(total_km, 2),
        "estimated_minutes": round(total_km / speed_kmph * 60),
        "peak_load_kg": round(peak, 3),
        "feasible": True,
        "message": "",
    }


def _stop(place: dict, kind: str, order_id, item: str, load_after: float) -> dict:
    return {"name": place["name"], "kind": kind, "order_id": order_id,
            "item": item, "load_after_kg": round(load_after, 3)}


def _infeasible(message: str) -> dict:
    return {"route": [], "total_distance_km": 0, "estimated_minutes": 0,
            "peak_load_kg": 0, "feasible": False, "message": message}
