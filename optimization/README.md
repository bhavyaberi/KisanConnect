# KhetSetu — Route Optimization

This module plans delivery routes for KhetSetu. When a delivery partner has
several orders to move from FPOs to buyers, it works out the order of stops
that gives the **shortest total distance**, while making sure the vehicle is
never overloaded and nothing is delivered before it is picked up.

It is a standalone service. It has no dependency on the frontend or on any
other module — it receives a JSON request and returns a JSON route.

---

## 1. Where it fits in KhetSetu

KhetSetu connects FPOs directly with consumers and bulk buyers, and delivery
partners carry the produce in between (see the *Delivery* page in the app).

```
Buyer places an order on the Marketplace
        |
Order is assigned to a delivery partner
        |
Backend / frontend sends the partner's location + their orders
to this service   ->   POST /optimize-route
        |
Service returns the best stop order, total km, estimated time
        |
App shows the route to the delivery partner
```

Each **order** in the request is: *which item, how much, which FPO to pick it
up from, which buyer to deliver it to.*

---

## 2. The problem it solves

Given:

- a delivery partner's starting point
- the vehicle's maximum load (kg)
- a list of orders (FPO pickup → buyer drop, with quantity)

Find the shortest route such that:

1. every order is picked up and delivered
2. an order is never dropped before it has been picked up
3. the load on the vehicle never goes above its capacity
   (a pickup adds weight, a drop removes it)
4. the route ends at the last drop — the partner does not have to return

Example of why this is not trivial: with a 40 kg vehicle and 72 kg of total
orders, the partner cannot pick up everything first. The route has to
interleave pickups and drops so the load stays under 40 kg, and it should do
that with as little travelling as possible.

This is a **Capacitated Pickup-and-Delivery Problem**, a variant of the
Vehicle Routing Problem (VRP). It is solved with Google OR-Tools, a
constraint-optimization library. This is classical operations research: the
solver searches for the best route under the rules above using the given
distances. It does not learn from past data.

---

## 3. How it works

**Step 1 — Convert quantities to kg** (`src/units.py`).
The marketplace sells in kg, bunch, dozen, piece and weekly basket. Vehicle
capacity is a weight, so every quantity is converted to kg first. The
conversion factors are approximate averages and can be edited in one place.

**Step 2 — Build the distance matrix** (`src/distance.py`).
Every stop (partner start, each FPO, each buyer) is a GPS point. The
Haversine formula gives the straight-line distance between every pair of
points, stored in a table so it is calculated once.

**Step 3 — Set up the OR-Tools model** (`src/vrp_ortools.py`).
Each order becomes a pickup node and a drop node. The rules are given to the
solver as constraints:

- *Pairing:* each pickup and its drop must be on the same route, with the
  pickup first.
- *Capacity:* a "load" dimension adds the order's weight at the pickup and
  subtracts it at the drop. The running load is restricted to stay between 0
  and the vehicle capacity.
- *Open end:* a dummy end node with zero distance to everywhere lets the route
  finish at the last drop instead of returning to the start.

**Step 4 — Search.**
The solver builds a first route with the *parallel cheapest insertion*
strategy, then improves it using *guided local search* (repeatedly trying
small changes such as moving or swapping stops) for a short time limit
(2 seconds by default).

**Step 5 — Return the route.**
The result lists each stop in order with its type (`start` / `pickup` /
`drop`), the order and item involved, and the load on the vehicle after the
stop. It also reports total distance, estimated time and peak load.

**Baseline for comparison** (`src/heuristic.py`).
A simple greedy planner ("go to the nearest stop that is allowed") follows
the same rules. It is used to measure how much the optimizer saves.

---

## 4. Files

```
optimization/
├── data/
│   └── sample_route_request.json   Example request (5 orders, 3 FPOs)
├── src/
│   ├── distance.py       Haversine distance + distance matrix
│   ├── units.py          kg / bunch / dozen / pc / week  ->  kg
│   ├── heuristic.py      Greedy baseline planner
│   ├── vrp_ortools.py    The optimizer (OR-Tools)
│   └── api.py            FastAPI service (/optimize-route)
├── tests/
│   ├── demo.py           Baseline vs optimized, printed side by side
│   └── test_optimizer.py Automated tests (pytest)
├── requirements.txt
├── requirements-dev.txt  Adds pytest + httpx for running the tests
└── README.md
```

---

## 5. Setup and running

Requires Python 3.10+.

```bash
cd optimization
pip install -r requirements.txt
```

**Run the demo (no server needed):**

```bash
python3 -m tests.demo
```

**Run the API:**

```bash
uvicorn src.api:app --reload --port 8001
```

Open http://127.0.0.1:8001/docs to try the endpoints in the browser.

**Run the tests:**

```bash
pip install -r requirements-dev.txt
python3 -m pytest
```

---

## 6. API

### `GET /`
Health check. Returns `{"status": "ok", ...}`.

### `POST /optimize-route`
Returns the optimized route for one delivery partner.

**Request**

```json
{
  "vehicle_capacity_kg": 40,
  "partner_start": { "name": "Delivery Partner - Home", "lat": 31.2240, "lon": 75.7708 },
  "orders": [
    {
      "order_id": "KS-101",
      "item": "Tomatoes",
      "quantity": 15,
      "unit": "kg",
      "fpo":   { "name": "Green Valley FPO",      "lat": 31.2600, "lon": 75.7200 },
      "buyer": { "name": "Consumer - Model Town", "lat": 31.2350, "lon": 75.7600 }
    }
  ]
}
```

| Field | Meaning |
|---|---|
| `vehicle_capacity_kg` | Max weight the vehicle can carry (default 40) |
| `partner_start` | Where the delivery partner begins |
| `orders[].order_id` | Order identifier, echoed back in the route |
| `orders[].item` | Produce name, echoed back in the route |
| `orders[].quantity` + `unit` | Amount; unit is one of `kg`, `bunch`, `dozen`, `pc`, `week` |
| `orders[].fpo` | Pickup location (the FPO) |
| `orders[].buyer` | Drop location (consumer or bulk buyer) |

An unknown unit returns HTTP 422 with a message listing the supported units.

**Response** (from `data/sample_route_request.json`, shortened)

```json
{
  "route": [
    { "name": "Delivery Partner - Home", "kind": "start",  "order_id": null,     "item": "",         "load_after_kg": 0.0 },
    { "name": "Green Valley FPO",        "kind": "pickup", "order_id": "KS-101", "item": "Tomatoes", "load_after_kg": 15.0 },
    "..."
  ],
  "total_distance_km": 41.68,
  "estimated_minutes": 125,
  "peak_load_kg": 40.0,
  "feasible": true,
  "message": ""
}
```

| Field | Meaning |
|---|---|
| `route` | Stops in visiting order |
| `route[].kind` | `start`, `pickup` or `drop` |
| `route[].load_after_kg` | Weight on the vehicle after that stop |
| `total_distance_km` | Total distance of the route |
| `estimated_minutes` | Distance ÷ assumed average speed (20 km/h) |
| `peak_load_kg` | Highest load at any point on the route |
| `feasible` | `false` if no valid route exists |
| `message` | Explains why when `feasible` is `false` |

If a single order is heavier than the vehicle capacity, the service returns
`feasible: false` with a message instead of producing an overloaded route.

### `POST /optimize-route/baseline`
Same request. Returns the greedy route, useful for comparing against the
optimized one.

---

## 7. Calling it from the React app

CORS is enabled for the Vite dev server (`http://localhost:5173`).

```js
const res = await fetch('http://127.0.0.1:8001/optimize-route', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    vehicle_capacity_kg: 40,
    partner_start: { name: 'Home', lat: 31.224, lon: 75.7708 },
    orders,   // array of orders in the shape above
  }),
})
const plan = await res.json()
// plan.route, plan.total_distance_km, plan.estimated_minutes
```

Each stop carries `order_id` and `item`, so the frontend can look up display
names (including the Hindi names already in the app) and show a numbered stop
list on the Delivery page.

---

## 8. Results on the sample data

`python3 -m tests.demo` on `data/sample_route_request.json` (5 orders, 72 kg
total, 40 kg vehicle):

| Planner | Distance |
|---|---|
| Greedy nearest-stop baseline | 49.2 km |
| Optimizer (OR-Tools) | 41.68 km (about 15% shorter) |

The sample uses made-up coordinates and orders near Phagwara. The 15% figure
is for this sample only, not a general claim.

---

## 9. Design notes and current scope

**Distance is straight-line (Haversine), not road distance.** Real road
distance is typically 20–40% longer. The distance function is isolated in
`src/distance.py`, so it can be replaced with a routing service such as OSRM
or the Google Directions API without touching the solver.

**Estimated time is approximate.** It is distance divided by an assumed
average speed of 20 km/h, not live traffic.

**Optimality.** For a handful of orders per partner, which is the expected
case in local delivery, OR-Tools typically finds the optimal or a near-optimal
route. The problem is NP-hard, so for much larger inputs the solver returns the
best route found within its time limit rather than a proven optimum.

**One vehicle per request.** Each request plans one delivery partner. Several
partners can be handled by splitting orders between them and calling the
service once per partner.

**Not included yet (future scope):**

- Delivery time slots / deadlines: would add an OR-Tools time dimension with
  a time window per stop, in the same way the capacity dimension was added.
- Several vehicles in one request: change the vehicle count in
  `RoutingIndexManager` and pass a capacity for each vehicle.
- Live traffic and real road distances: swap the distance function as above.
- Perishability-aware ordering: would use the same time dimension with
  produce-specific deadlines.

---

## 10. Common questions

**What algorithm is used?**
OR-Tools routing solver: parallel cheapest insertion to build a first route,
then guided local search to improve it.

**Why not check every possible route?**
The number of possible orderings grows factorially with the number of stops,
so brute force becomes impossible very quickly. The solver's search finds a
very good route without enumerating them all.

**Why compare against a greedy baseline?**
It gives a concrete, reproducible number for how much the optimizer helps.

**How is capacity enforced?**
Through a capacity dimension in the model: the running load is +weight at a
pickup and −weight at a drop, and is constrained to stay within 0 and the
vehicle capacity at every stop. The solver cannot output a route that breaks
it.

**How is "pickup before drop" enforced?**
Each pickup/drop pair is registered as a pair in the model, and a constraint
requires the pickup to occur earlier along the route than its drop.
