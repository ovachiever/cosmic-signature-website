from flask import Flask, request, jsonify
from flask_cors import CORS
import pytz
from datetime import datetime
from timezonefinder import TimezoneFinder
import swisseph as swe

# Import the core logic from our new, verified module
from astrology_core import get_astrological_data, ephe_path_exists

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize timezone finder
tf = TimezoneFinder()

# --- Helper Functions for API ---

def get_timezone_from_coordinates(lat, lon):
    """Get timezone from coordinates using timezonefinder."""
    try:
        timezone_str = tf.timezone_at(lat=lat, lng=lon)
        if timezone_str:
            return timezone_str
        else:
            # Fallback to offset-based timezone
            offset_hours = round(lon / 15)
            return f"Etc/GMT{-offset_hours if offset_hours >= 0 else f'+{abs(offset_hours)}'}"
    except Exception as e:
        print(f"Error getting timezone: {e}")
        # Fallback to UTC
        return 'UTC'

def get_julian_day(date_str, time_str, timezone_str):
    """Convert date, time, and timezone to Julian day."""
    try:
        # Parse the date and time
        date_format = "%Y-%m-%d"
        time_format = "%H:%M"
        
        birth_date = datetime.strptime(date_str, date_format).date()
        birth_time = datetime.strptime(time_str, time_format).time()
        
        # Combine date and time
        birth_datetime = datetime.combine(birth_date, birth_time)
        
        # Apply timezone
        timezone = pytz.timezone(timezone_str)
        birth_datetime = timezone.localize(birth_datetime)
        
        # Convert to UTC
        birth_datetime_utc = birth_datetime.astimezone(pytz.UTC)
        
        # Calculate Julian day
        jd = swe.julday(
            birth_datetime_utc.year,
            birth_datetime_utc.month,
            birth_datetime_utc.day,
            birth_datetime_utc.hour + birth_datetime_utc.minute / 60.0 + birth_datetime_utc.second / 3600.0
        )
        
        return jd
    except Exception as e:
        print(f"Error calculating Julian day: {e}")
        return None

# --- API Endpoints ---

@app.route('/api/cosmic-signature', methods=['POST'])
def cosmic_signature_endpoint():
    try:
        data = request.json
        
        # Extract birth data
        birth_date = data.get('birthDate')
        birth_time = data.get('birthTime')
        latitude = float(data.get('latitude'))
        longitude = float(data.get('longitude'))
        
        # Get timezone based on coordinates
        timezone_str = get_timezone_from_coordinates(latitude, longitude)
        
        # Calculate Julian day
        jd = get_julian_day(birth_date, birth_time, timezone_str)
        if not jd:
            return jsonify({"error": "Invalid birth data"}), 400
            
        # Check if ephemeris files exist
        if not ephe_path_exists():
            return jsonify({"error": "Ephemeris data not found on server."}), 500

        # Get all astrological data from the core module
        chart_data = get_astrological_data(jd, latitude, longitude)
        
        # Add frontend-expected fields
        sun_sign = chart_data['planets']['Sun']['sign']
        moon_sign = chart_data['planets']['Moon']['sign']
        ascendant_sign = chart_data['ascendant']['sign']
        
        # Format birth data for display
        from datetime import datetime
        birth_datetime = datetime.strptime(f"{birth_date} {birth_time}", "%Y-%m-%d %H:%M")
        formatted_birth_date = birth_datetime.strftime("%B %d, %Y")
        formatted_time = birth_datetime.strftime("%I:%M %p")
        
        # Add all expected fields
        chart_data.update({
            'sunSign': sun_sign,
            'moonSign': moon_sign,
            'ascendant': ascendant_sign,
            'ascendantData': chart_data['ascendant'],
            'formattedBirthDate': formatted_birth_date,
            'formattedTime': formatted_time,
            'overview': f"You emerge as a {sun_sign} Sun with the emotional depths of a {moon_sign} Moon, anchored through a {ascendant_sign} Rising. This trinity forms your cosmic signature—a unique frequency in the symphony of existence. Your air elemental dominance reveals the primary energy through which you interface with reality. This configuration appears in only 1 in 1728 births, marking you as a rare cosmic expression.",
            'meta': {
                "birthDate": birth_date,
                "birthTime": birth_time,
                "timezone": timezone_str,
                "coordinates": {
                    "latitude": latitude,
                    "longitude": longitude
                }
            }
        })
        
        return jsonify(chart_data)
    
    except Exception as e:
        print(f"Error in cosmic_signature_endpoint: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": "An internal server error occurred."}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({"status": "healthy", "service": "cosmic-signature-api"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
