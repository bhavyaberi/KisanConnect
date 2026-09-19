# KhetSetu — Delivery Route Optimization

Plans the route for a **delivery partner** on KhetSetu: pick up orders from
FPOs, drop them at consumers / bulk buyers, with the shortest total distance.
This is operations research (Google OR-Tools), **not machine learning**.

## What it does

Input: partner's start point, vehicle capacity, and a list of orders.
Each order = one item, quantity + unit, the FPO to pick up from, the buyer to drop at.

Output: ordered stops (`start` / `pickup` / `drop`), total km, estimated minutes,
peak load. Rules it follows:

- every order is picked up before it's dropped
- load on the vehicle never goes above capacity (pickup adds, drop removes)
- route ends at the last drop (partner doesn't return to start)
- an order heavier than the vehicle → `feasible: false` with a clear message

Quantities in marketplace units (`kg`, `bunch`, `dozen`, `pc`, `week`) are
converted to kg in `src/units.py`. Those factors are rough assumptions.

## Run it

```bash
cd optimization
pip install -r requirements.txt

python3 -m tests.demo                       # offline demo, greedy vs optimized
uvicorn src.api:app --reload --port 8001    # API, docs at /docs
```

Demo on the synthetic sample: 49.2 km (greedy) → 41.68 km (optimized), 15.3% shorter.
Sample data is made up, so quote it only as "measured on our test case".

## Calling it from the React app

CORS is already enabled for the Vite dev server (`localhost:5173`).

```js
const res = await fetch('http://127.0.0.1:8001/optimize-route', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    vehicle_capacity_kg: 40,
    partner_start: { name: 'Home', lat: 31.224, lon: 75.7708 },
    orders: [{
      order_id: 'KS-101', item: 'Tomatoes', quantity: 15, unit: 'kg',
      fpo:   { name: 'Green Valley FPO', lat: 31.26, lon: 75.72 },
      buyer: { name: 'Consumer - Model Town', lat: 31.235, lon: 75.76 },
    }],
  }),
})
const plan = await res.json() // plan.route, plan.total_distance_km, plan.estimated_minutes
```

Stops carry `order_id` and `item`, so the frontend can show names in Hindi/English
using the existing `produceNameHi` / `fpoNameHi` maps.

## Files

```
src/distance.py       Haversine distance + distance matrix
src/units.py          kg / bunch / dozen / pc / week -> kg
src/heuristic.py      greedy baseline (nearest allowed stop)
src/vrp_ortools.py    OR-Tools pickup-and-delivery planner with capacity
src/api.py            FastAPI: /optimize-route, /optimize-route/simple
data/sample_route_request.json   synthetic demo data
tests/demo.py         greedy vs optimized side by side
```

## Honest limits (good for Q&A)

| Thing | Status |
|---|---|
| Pickup→drop order + capacity + shortest route | Built |
| Distance | Haversine straight-line, not road distance (roads are ~20–40% longer). Swap in OSRM / Google Directions later |
| Minutes | Estimate only: distance ÷ assumed 20 km/h |
| Live traffic, time slots, multiple partners | Not built. Time slots would use an OR-Tools time dimension; multiple partners = more vehicles in the model |
| Optimality | Small orders → optimal or very close. Bigger ones → best found within the time limit |
