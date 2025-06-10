// API client for communicating with the Python backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function fetchCosmicSignature(birthData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cosmic-signature`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        birthDate: birthData.birthDate,
        birthTime: birthData.birthTime || '12:00',
        latitude: birthData.latitude,
        longitude: birthData.longitude,
        timezone: birthData.timezone || 'UTC'
      }),
      signal: AbortSignal.timeout(30000) // 30 second timeout for complex calculations
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Error fetching cosmic signature:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Check if backend is available
export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000) // 5 second timeout
    });
    return response.ok;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
}
