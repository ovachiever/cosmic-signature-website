import React, { useState } from 'react';
import { fetchCosmicSignature } from '../lib/apiClient';
import { fetchCosmicReport } from '../lib/supabaseClient';
import { generateCosmicReport } from '../lib/openaiClient';
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
      
      // Use the API client to fetch the cosmic signature
      const { success, data: cosmicData, error } = await fetchCosmicSignature(formData);

      if (!success) {
        throw new Error(error || 'Failed to generate cosmic signature');
      }
      
      // Save the birth data for display
      setBirthData(formData);
      
      // Generate OpenAI cosmic report with the astrological data
      const openAIReport = await generateCosmicReport({
        ...cosmicData,
        birthData: {
          ...formData,
          birthDate: formData.birthDate,
          birthTime: formData.birthTime,
          birthPlace: formData.birthPlace,
          latitude: formData.latitude,
          longitude: formData.longitude
        }
      });

      if (openAIReport.error) {
        throw new Error(`OpenAI API Error: ${openAIReport.error}`);
      }
      
      // Merge the OpenAI report with the cosmic data
      const completeReport = {
        ...cosmicData,
        ...openAIReport
      };
      
      // Set the complete report
      setReport(completeReport);
      
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
