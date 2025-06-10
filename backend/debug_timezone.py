#!/usr/bin/env python3
"""
Debug the timezone and date conversion issue
"""

from datetime import datetime
import pytz
from timezonefinder import TimezoneFinder
import swisseph as swe

# Initialize timezone finder
tf = TimezoneFinder()

# Test case data
birth_date_str = "1982-06-03"
birth_time_str = "04:26"
lat, lon = 43.7508, -87.7145

print("=== TIMEZONE DEBUG ===")
print(f"Input: {birth_date_str} {birth_time_str}")
print(f"Location: {lat}, {lon}")

# 1. Get timezone from coordinates
tz_str = tf.timezone_at(lat=lat, lng=lon)
print(f"\nDetected timezone: {tz_str}")

# 2. Parse date and time
date_obj = datetime.strptime(birth_date_str, "%Y-%m-%d").date()
time_obj = datetime.strptime(birth_time_str, "%H:%M").time()
print(f"Parsed date: {date_obj}")
print(f"Parsed time: {time_obj}")

# 3. Combine and localize
local_dt = datetime.combine(date_obj, time_obj)
print(f"\nLocal datetime (naive): {local_dt}")

# 4. Apply timezone
timezone = pytz.timezone(tz_str)
local_dt_tz = timezone.localize(local_dt)
print(f"Local datetime (aware): {local_dt_tz}")
print(f"Timezone offset: {local_dt_tz.strftime('%z')}")

# 5. Convert to UTC
utc_dt = local_dt_tz.astimezone(pytz.UTC)
print(f"\nUTC datetime: {utc_dt}")

# 6. Calculate Julian Day
jd = swe.julday(
    utc_dt.year,
    utc_dt.month,
    utc_dt.day,
    utc_dt.hour + utc_dt.minute / 60.0 + utc_dt.second / 3600.0
)
print(f"\nJulian Day: {jd}")

# 7. Expected values
print("\n=== EXPECTED VALUES ===")
print("For June 3, 1982 4:26 AM CDT:")
print("UTC should be: 1982-06-03 09:26:00")
print("Julian Day should be: 2445123.8930555554")
print(f"Actual JD difference: {jd - 2445123.8930555554}")

# 8. Check if DST is being applied correctly
print("\n=== DST CHECK ===")
print(f"Is DST active? {local_dt_tz.dst()}")
print(f"Timezone name: {local_dt_tz.tzname()}")

# 9. Manual CDT calculation
print("\n=== MANUAL CDT CALCULATION ===")
# CDT is UTC-5
manual_utc_hour = 4 + 26/60 + 5  # 4:26 AM + 5 hours
print(f"Manual UTC hour: {manual_utc_hour}")
manual_jd = swe.julday(1982, 6, 3, manual_utc_hour)
print(f"Manual Julian Day: {manual_jd}")
print(f"Matches expected? {abs(manual_jd - 2445123.8930555554) < 0.0001}")
