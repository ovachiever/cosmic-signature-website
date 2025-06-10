#!/usr/bin/env python3
"""
Direct Swiss Ephemeris test following the exact pattern from the user.
This will help us verify our calculations are correct.
"""

import swisseph as swe
import json
from datetime import datetime
import os

# 1) Point to ephemeris data files
ephe_path = os.path.join(os.path.dirname(__file__), 'ephe')
print(f"Setting ephemeris path to: {ephe_path}")
swe.set_ephe_path(ephe_path)

# 2) Test case: Erik's birth data
# June 3, 1982 at 4:26 AM CDT in Sheboygan, WI
# CDT is UTC-5, so 4:26 AM CDT = 9:26 AM UTC
print("\nTest Case: June 3, 1982 at 4:26 AM CDT in Sheboygan, WI")
print("Converting to UTC: 9:26 AM UTC")

# Build Julian Day for birth moment (UTC)
year, month, day = 1982, 6, 3  # June 3, not June 4!
hour = 9 + 26/60  # 9:26 AM UTC
jd_ut = swe.julday(year, month, day, hour)
print(f"Julian Day (UT): {jd_ut}")

# 3) Pull out planet positions
planet_ids = {
    'Sun': swe.SUN,
    'Moon': swe.MOON,
    'Mercury': swe.MERCURY,
    'Venus': swe.VENUS,
    'Mars': swe.MARS,
    'Jupiter': swe.JUPITER,
    'Saturn': swe.SATURN,
    'Uranus': swe.URANUS,
    'Neptune': swe.NEPTUNE,
    'Pluto': swe.PLUTO,
}

data = {}
print("\nPlanet Positions:")
for name, pid in planet_ids.items():
    result = swe.calc_ut(jd_ut, pid)
    lon = result[0][0]  # longitude
    lat = result[0][1]  # latitude
    dist = result[0][2]  # distance
    
    # Calculate zodiac sign
    sign_num = int(lon / 30)
    signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", 
             "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
    sign = signs[sign_num % 12]
    degree_in_sign = lon % 30
    
    data[name] = {
        'longitude': lon,
        'latitude': lat,
        'distance_au': dist,
        'sign': sign,
        'degree_in_sign': degree_in_sign
    }
    
    print(f"{name:10} {lon:7.3f}° = {sign} {degree_in_sign:5.2f}°")

# 4) Compute houses & angles (Placidus)
# Sheboygan, WI coordinates
lat, lon = 43.7508, -87.7145
print(f"\nHouse Calculation for lat={lat}, lon={lon}")

cusps, ascmc = swe.houses(jd_ut, lat, lon, b"P")
data['houses'] = {
    'cusps': list(cusps),  # Convert tuple to list for JSON
    'asc': ascmc[0],
    'mc': ascmc[1],
    'armc': ascmc[2],
    'vertex': ascmc[3],
    'equatorial_ascendant': ascmc[4],
    'co_ascendant_koch': ascmc[5],
    'co_ascendant_munkasey': ascmc[6],
    'polar_ascendant': ascmc[7]
}

# Calculate Ascendant sign
asc_lon = ascmc[0]
asc_sign_num = int(asc_lon / 30)
asc_sign = signs[asc_sign_num % 12]
asc_degree = asc_lon % 30

print(f"\nAscendant: {asc_lon:.3f}° = {asc_sign} {asc_degree:.2f}°")
print(f"Midheaven: {ascmc[1]:.3f}°")

# 5) Output complete data
print("\n" + "="*50)
print("COMPLETE DATA DUMP:")
print("="*50)
print(json.dumps(data, indent=2))

# Summary for verification
print("\n" + "="*50)
print("SUMMARY FOR JUNE 3, 1982 4:26 AM CDT SHEBOYGAN, WI:")
print("="*50)
print(f"Sun Sign: {data['Sun']['sign']}")
print(f"Moon Sign: {data['Moon']['sign']}")
print(f"Ascendant: {asc_sign} {asc_degree:.2f}°")
print("="*50)
