import json
import os

import pytest
from fastapi.testclient import TestClient

from src.api import app
from src.distance import haversine_distance_km
from src.heuristic import greedy_route
from src.units import to_kg
from src.vrp_ortools import solve_delivery_route
from tests.demo import load_sample

client = TestClient(app)
SAMPLE_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "sample_route_request.json")


def check_route_rules(result, orders, capacity):
    """Every order picked up then dropped once, load always within [0, capacity]."""
    picked, dropped = set(), set()
    for s in result["route"]:
        assert 0 <= s["load_after_kg"] <= capacity + 1e-6
        if s["kind"] == "pickup":
            picked.add(s["order_id"])
        elif s["kind"] == "drop":
            assert s["order_id"] in picked, "dropped before pickup"
            dropped.add(s["order_id"])
    ids = {o["order_id"] for o in orders}
    assert picked == ids and dropped == ids


def test_haversine_known_distance():
    # Jalandhar -> Ludhiana is roughly 50 km in a straight line
    d = haversine_distance_km(31.3260, 75.5762, 30.9010, 75.8573)
    assert 45 < d < 60


def test_unit_conversion():
    assert to_kg(10, "kg") == 10
    assert to_kg(4, "bunch") == 1.0
    assert to_kg(2, "/week") == 10.0
    with pytest.raises(ValueError):
        to_kg(1, "crate")


def test_optimized_route_follows_rules():
    start, orders, capacity = load_sample()
    result = solve_delivery_route(start, orders, capacity)
    assert result["feasible"]
    assert result["peak_load_kg"] <= capacity
    check_route_rules(result, orders, capacity)


def test_optimized_not_longer_than_greedy():
    start, orders, capacity = load_sample()
    best = solve_delivery_route(start, orders, capacity)
    base = greedy_route(start, orders, capacity)
    assert best["total_distance_km"] <= base["total_distance_km"] + 1e-6


def test_order_heavier_than_vehicle_is_infeasible():
    start, orders, _ = load_sample()
    result = solve_delivery_route(start, orders, vehicle_capacity_kg=10)
    assert result["feasible"] is False
    assert "exceed" in result["message"]


def test_no_orders():
    start, _, _ = load_sample()
    result = solve_delivery_route(start, [], 40)
    assert result["feasible"] and len(result["route"]) == 1


def test_api_optimize_route():
    with open(SAMPLE_PATH) as f:
        payload = json.load(f)
    r = client.post("/optimize-route", json=payload)
    assert r.status_code == 200
    body = r.json()
    assert body["feasible"] and body["total_distance_km"] > 0


def test_api_rejects_unknown_unit():
    with open(SAMPLE_PATH) as f:
        payload = json.load(f)
    payload["orders"][0]["unit"] = "crate"
    assert client.post("/optimize-route", json=payload).status_code == 422
