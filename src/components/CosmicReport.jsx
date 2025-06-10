import React from 'react';
import SacredGeometry from './SacredGeometry';
import { marked } from 'marked';

const CosmicReport = ({ report, onReset }) => {
  if (!report) return null;

  // Sanitize and render the markdown content from the cosmic report
  const renderMarkdown = (content) => {
    if (!content) return null;
    const rawMarkup = marked.parse(content, { breaks: true });
    return { __html: rawMarkup };
  };

  return (
    <div className="cosmic-report">
      <div className="report-header">
        <h1>Your Hash Clock</h1>
        <p className="birth-info">Based on your birth at {report.formattedTime} on {report.formattedBirthDate}</p>
      </div>

      <div className="report-section sacred-geometry-chart">
        <h2>Your Sacred Geometry</h2>
        <SacredGeometry 
          planets={report.planets} 
          aspects={report.aspects} 
          sunSign={report.sunSign} 
          moonSign={report.moonSign} 
          ascendant={report.ascendant}
          ascendantData={report.ascendantData}
        />
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

      {report.cosmicReport ? (
        <div 
          className="report-section cosmic-blueprint"
          dangerouslySetInnerHTML={renderMarkdown(report.cosmicReport)}
        />
      ) : (
        report.overview && (
          <div className="report-section unique-insights">
            <h2>Your Cosmic Blueprint</h2>
            <p>{report.overview}</p>
          </div>
        )
      )}

      <div className="report-actions">
        <button className="reset-button" onClick={onReset}>Generate New Report</button>
      </div>
    </div>
  );
};

export default CosmicReport;
