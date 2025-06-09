import { useState } from 'react';

const BirthDataForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    birthDate: '',
    birthTime: '',
    location: '',
    latitude: null,
    longitude: null,
    unknownTime: false
  });
  
  const [errors, setErrors] = useState({});
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'unknownTime') {
      setFormData(prev => ({
        ...prev,
        unknownTime: checked,
        birthTime: checked ? '12:00' : prev.birthTime
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleLocationSearch = async () => {
    if (!formData.location.trim()) {
      setErrors(prev => ({ ...prev, location: 'Please enter a location' }));
      return;
    }

    try {
      setIsSearchingLocation(true);
      setErrors(prev => ({ ...prev, location: null }));
      
      // Simulate geocoding with a simple calculation for demo purposes
      // In a real app, this would use a geocoding service like Google Places API
      setTimeout(() => {
        // Generate deterministic but realistic-looking coordinates based on location string
        const locationHash = formData.location.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const latitude = ((locationHash % 180) - 90).toFixed(6);
        const longitude = ((locationHash * 2 % 360) - 180).toFixed(6);
        
        setFormData(prev => ({
          ...prev,
          latitude,
          longitude
        }));
        
        setIsSearchingLocation(false);
      }, 1000);
    } catch (error) {
      console.error('Error geocoding location:', error);
      setErrors(prev => ({ ...prev, location: 'Could not find coordinates for this location' }));
      setIsSearchingLocation(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.birthDate) {
      newErrors.birthDate = 'Birth date is required';
    }
    
    if (!formData.unknownTime && !formData.birthTime) {
      newErrors.birthTime = 'Birth time is required (or select "I don\'t know my exact birth time")';
    }
    
    if (!formData.location) {
      newErrors.location = 'Birth location is required';
    }
    
    if (!formData.latitude || !formData.longitude) {
      newErrors.coordinates = 'Please search for a valid location to get coordinates';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        birthDate: formData.birthDate,
        birthTime: formData.unknownTime ? '12:00:00' : formData.birthTime + ':00',
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        locationName: formData.location
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-xl border border-white/20">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Enter Your Birth Details</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Birth Date */}
        <div>
          <label htmlFor="birthDate" className="block text-sm font-medium text-white mb-1">
            Birth Date
          </label>
          <input
            type="date"
            id="birthDate"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            className={`w-full px-4 py-2 bg-white/5 border ${errors.birthDate ? 'border-red-500' : 'border-purple-300/30'} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
          />
          {errors.birthDate && (
            <p className="mt-1 text-sm text-red-400">{errors.birthDate}</p>
          )}
        </div>
        
        {/* Birth Time */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="birthTime" className="block text-sm font-medium text-white">
              Birth Time
            </label>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="unknownTime"
                name="unknownTime"
                checked={formData.unknownTime}
                onChange={handleChange}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="unknownTime" className="ml-2 text-xs text-white/80">
                I don't know my exact birth time
              </label>
            </div>
          </div>
          <input
            type="time"
            id="birthTime"
            name="birthTime"
            value={formData.birthTime}
            onChange={handleChange}
            disabled={formData.unknownTime}
            className={`w-full px-4 py-2 bg-white/5 border ${errors.birthTime ? 'border-red-500' : 'border-purple-300/30'} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 ${formData.unknownTime ? 'opacity-50' : ''}`}
          />
          {errors.birthTime && (
            <p className="mt-1 text-sm text-red-400">{errors.birthTime}</p>
          )}
        </div>
        
        {/* Birth Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-white mb-1">
            Birth Location
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="City, Country"
              className={`flex-1 px-4 py-2 bg-white/5 border ${errors.location ? 'border-red-500' : 'border-purple-300/30'} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
            <button
              type="button"
              onClick={handleLocationSearch}
              disabled={isSearchingLocation}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-70"
            >
              {isSearchingLocation ? '...' : 'Search'}
            </button>
          </div>
          {errors.location && (
            <p className="mt-1 text-sm text-red-400">{errors.location}</p>
          )}
        </div>
        
        {/* Coordinates Display */}
        {(formData.latitude && formData.longitude) ? (
          <div className="text-xs text-white/70 italic">
            Coordinates: {formData.latitude}, {formData.longitude}
          </div>
        ) : errors.coordinates ? (
          <p className="text-sm text-red-400">{errors.coordinates}</p>
        ) : null}
        
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 px-6 text-lg font-semibold rounded-lg bg-gold-500 text-gray-900 hover:bg-gold-400 transition-colors shadow-lg hover:shadow-xl"
        >
          Generate My Cosmic Blueprint
        </button>
      </form>
    </div>
  );
};

export default BirthDataForm;
