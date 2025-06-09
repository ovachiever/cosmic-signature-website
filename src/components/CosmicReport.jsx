import React from 'react';

const CosmicReport = ({ report, birthData, onReset }) => {
  if (!report) return null;

  return (
    <div className="cosmic-report">
      <div className="report-header">
        <h1>Your Cosmic Signature</h1>
        <p className="birth-info">Based on your birth at {birthData.formattedTime} on {report.formattedBirthDate}</p>
      </div>

      <div className="report-section core-signature">
        <div className="signature-item">
          <h3>Sun Sign</h3>
          <div className="sign-icon sun-sign">{report.sunSign}</div>
          <p>Your core essence and conscious identity</p>
        </div>
        
        <div className="signature-item">
          <h3>Moon Sign</h3>
          <div className="sign-icon moon-sign">{report.moonSign}</div>
          <p>Your emotional landscape and inner world</p>
        </div>
        
        <div className="signature-item">
          <h3>Ascendant</h3>
          <div className="sign-icon ascendant-sign">{report.ascendant}</div>
          <p>Your outer persona and approach to life</p>
        </div>
      </div>

      <div className="report-section unique-insights">
        <h2>Your Cosmic Blueprint</h2>
        <p>{report.uniqueInsights}</p>
      </div>

      <div className="report-section aspects">
        <h2>Celestial Aspects</h2>
        <div className="aspects-grid">
          {report.aspects.slice(0, 5).map((aspect, index) => (
            <div key={index} className="aspect-item">
              <h4>{aspect.aspect}: {aspect.planets}</h4>
              <p>{aspect.influence}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="report-actions">
        <button className="reset-button" onClick={onReset}>Generate New Report</button>
      </div>
    </div>
  );
};

export default CosmicReport;
