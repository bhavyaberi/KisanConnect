"""
api.py
------
FastAPI service exposing the route optimizer to the rest of KhetSetu.

Run from the optimization/ folder:
    uvicorn src.api:app --reload --port 8001
Interactive docs: http://127.0.0.1:8001/docs

CORS is enabled for the Vite dev server so the React app can call it directly.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from src.heuristic import greedy_route
from src.units import to_kg
from src.vrp_ortools import solve_delivery_route

app = FastAPI(title="KhetSetu Route Optimization Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------- request / response ----------------------------

class Location(BaseModel):
    name: str
    lat: float
    lon: float


class Order(BaseModel):
    order_id: str
    item: str = ""                 # e.g. "Tomatoes"
    quantity: float = Field(gt=0)
    unit: str = "kg"               # kg | bunch | dozen | pc | week
    fpo: Location                  # pickup point
    buyer: Location                # drop point (consumer or bulk buyer)


class RouteRequest(BaseModel):
    vehicle_capacity_kg: float = Field(gt=0, default=40)
    partner_start: Location        # delivery partner's starting point
    orders: list[Order]


class Stop(BaseModel):
    name: str
    kind: str                      # "start" | "pickup" | "drop"
    order_id: str | None = None
    item: str = ""
    load_after_kg: float           # kg on the vehicle after this stop


class RouteResponse(BaseModel):
    route: list[Stop]
    total_distance_km: float
    estimated_minutes: int
    peak_load_kg: float
    feasible: bool
    message: str = ""


def _prepare(request: RouteRequest):
    """Convert the request into the plain dicts the solver uses (quantities -> kg)."""
    try:
        orders = [
            {
                "order_id": o.order_id,
                "item": o.item,
                "weight_kg": to_kg(o.quantity, o.unit),
                "fpo": o.fpo.model_dump(),
                "buyer": o.buyer.model_dump(),
            }
            for o in request.orders
        ]
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    return request.partner_start.model_dump(), orders


# --------------------------------- endpoints ---------------------------------

@app.get("/")
def health_check():
    return {"status": "ok", "service": "KhetSetu Route Optimization Service"}


@app.post("/optimize-route", response_model=RouteResponse)
def optimize_route(request: RouteRequest):
    """Optimized route for one delivery partner."""
    start, orders = _prepare(request)
    return solve_delivery_route(start, orders, request.vehicle_capacity_kg)


@app.post("/optimize-route/baseline")
def optimize_route_baseline(request: RouteRequest):
    """Greedy nearest-stop route, for comparison with the optimized one."""
    start, orders = _prepare(request)
    return greedy_route(start, orders, request.vehicle_capacity_kg)
