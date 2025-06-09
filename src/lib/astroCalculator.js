import { useState, useEffect } from 'react';

// This file is now a simple wrapper that will call the Python backend
// instead of doing calculations in the frontend

export const useCosmicReport = (birthData) => {
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const generateReport = async () => {
      if (!birthData) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Call the Python backend API
        const response = await fetch('http://localhost:5000/api/cosmic-signature', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            birthDate: birthData.birthDate,
            birthTime: birthData.birthTime,
            latitude: birthData.latitude,
            longitude: birthData.longitude,
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to generate cosmic signature');
        }
        
        const cosmicData = await response.json();
        setReport(cosmicData);
      } catch (err) {
        setError('Error generating cosmic report: ' + err.message);
        console.error('Error generating cosmic report:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (birthData) {
      generateReport();
    }
  }, [birthData]);

  return { report, isLoading, error };
};

// Export a function to validate birth data
export const validateBirthData = (data) => {
  const errors = {};
  
  if (!data.birthDate) {
    errors.birthDate = 'Birth date is required';
  }
  
  if (!data.birthTime) {
    errors.birthTime = 'Birth time is required';
  }
  
  if (!data.latitude || isNaN(parseFloat(data.latitude))) {
    errors.latitude = 'Valid latitude is required';
  } else if (parseFloat(data.latitude) < -90 || parseFloat(data.latitude) > 90) {
    errors.latitude = 'Latitude must be between -90 and 90';
  }
  
  if (!data.longitude || isNaN(parseFloat(data.longitude))) {
    errors.longitude = 'Valid longitude is required';
  } else if (parseFloat(data.longitude) < -180 || parseFloat(data.longitude) > 180) {
    errors.longitude = 'Longitude must be between -180 and 180';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
