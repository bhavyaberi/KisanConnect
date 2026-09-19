"""
distance.py
-----------
Straight-line (great-circle) distance between GPS coordinates using the
Haversine formula, plus a helper that builds a full distance matrix.

Haversine does not follow roads, so real road distance is longer (roughly
1.2x-1.4x). To use road distance, replace `haversine_distance_km` with a call
to a routing service (OSRM, Google Directions, Mapbox). The rest of the module
only depends on the function signature.
"""

import math

EARTH_RADIUS_KM = 6371.0


def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Distance in km between two points given in decimal degrees."""
    lat1_r, lat2_r = math.radians(lat1), math.radians(lat2)
    dlat = lat2_r - lat1_r
    dlon = math.radians(lon2 - lon1)

    a = math.sin(dlat / 2) ** 2 + math.cos(lat1_r) * math.cos(lat2_r) * math.sin(dlon / 2) ** 2
    return round(EARTH_RADIUS_KM * 2 * math.asin(math.sqrt(a)), 3)


def build_distance_matrix(locations: list[dict]) -> list[list[float]]:
    """
    NxN matrix where matrix[i][j] is the distance in km from locations[i] to
    locations[j]. Each location needs "lat" and "lon" keys.
    """
    n = len(locations)
    matrix = [[0.0] * n for _ in range(n)]
    for i in range(n):
        for j in range(n):
            if i != j:
                matrix[i][j] = haversine_distance_km(
                    locations[i]["lat"], locations[i]["lon"],
                    locations[j]["lat"], locations[j]["lon"],
                )
    return matrix
