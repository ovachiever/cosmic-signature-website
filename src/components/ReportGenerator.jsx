import React, { useState } from 'react';
import { fetchCosmicReport } from '../lib/supabaseClient';
import { useCosmicReport } from '../lib/astroCalculator';
import Hero from './Hero';
import BirthDataForm from './BirthDataForm';
import CosmicReport from './CosmicReport';
import Footer from './Footer';

const ReportGenerator = () => {
  const [birthData, setBirthData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [report, setReport] = useState(null);

  const handleSubmit = async (formData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Call the Python backend API instead of using the frontend calculation
      const response = await fetch('http://localhost:5000/api/cosmic-signature', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          birthDate: formData.birthDate,
          birthTime: formData.birthTime,
          latitude: formData.latitude,
          longitude: formData.longitude,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate cosmic signature');
      }
      
      const cosmicData = await response.json();
      
      // Save the birth data for display
      setBirthData(formData);
      
      // Set the report from the backend
      setReport(cosmicData);
      
      // Optionally save to Supabase
      try {
        await fetchCosmicReport({
          birth_date: formData.birthDate,
          birth_time: formData.birthTime,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          sun_sign: cosmicData.sunSign,
          moon_sign: cosmicData.moonSign,
          ascendant: cosmicData.ascendant,
          report_content: cosmicData
        });
      } catch (supabaseError) {
        console.error('Error saving to Supabase:', supabaseError);
        // Continue even if Supabase save fails
      }
    } catch (err) {
      setError('Error generating cosmic report: ' + err.message);
      console.error('Error generating cosmic report:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setBirthData(null);
    setReport(null);
    setError(null);
  };

  return (
    <div className="report-generator">
      {!birthData && !report && (
        <>
          <Hero onGetStarted={() => window.scrollTo({ top: document.querySelector('.form-container').offsetTop, behavior: 'smooth' })} />
          <BirthDataForm onSubmit={handleSubmit} />
        </>
      )}
      
      {isLoading && (
        <div className="loading-container">
          <div className="cosmic-loader"></div>
          <p>Calculating your cosmic signature...</p>
        </div>
      )}
      
      {error && (
        <div className="error-container">
          <h3>Cosmic Disturbance</h3>
          <p>{error}</p>
          <button className="reset-button" onClick={handleReset}>Try Again</button>
        </div>
      )}
      
      {report && birthData && (
        <CosmicReport 
          report={report} 
          birthData={{
            ...birthData,
            formattedDate: report.formattedBirthDate,
            formattedTime: report.formattedBirthTime
          }} 
          onReset={handleReset} 
        />
      )}
      
      <Footer />
    </div>
  );
};

export default ReportGenerator;
