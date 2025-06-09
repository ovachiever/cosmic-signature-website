import React from 'react';

const CosmicReport = ({ report, birthData, onReset }) => {
  if (!report) return null;

  return (
    <div className="report-container">
      <div className="report-header">
        <h2 className="report-title">Your Cosmic Signature</h2>
        <p className="report-subtitle">
          Based on your birth at {birthData.birthTime} on {new Date(birthData.birthDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
      
      <div className="report-section">
        <h3 className="report-section-title">Solar Essence</h3>
        <div className="report-content">
          <p>
            Your Sun in <span className="report-highlight">{report.sunSign}</span> reveals your core essence and conscious self-expression. 
            This placement illuminates your path toward self-realization and shapes how you radiate your unique energy into the world.
          </p>
          <div className="report-visualization">
            {/* Solar visualization would be rendered here */}
          </div>
        </div>
      </div>
      
      <div className="report-section">
        <h3 className="report-section-title">Lunar Landscape</h3>
        <div className="report-content">
          <p>
            Your Moon in <span className="report-highlight">{report.moonSign}</span> reflects your emotional nature and subconscious patterns.
            This placement reveals how you process feelings, what brings you comfort, and your intuitive responses to life's ebb and flow.
          </p>
          <div className="report-visualization">
            {/* Lunar visualization would be rendered here */}
          </div>
        </div>
      </div>
      
      <div className="report-section">
        <h3 className="report-section-title">Rising Expression</h3>
        <div className="report-content">
          <p>
            Your Ascendant in <span className="report-highlight">{report.ascendant}</span> shapes your outer persona and how others perceive you.
            This cosmic mask represents your natural approach to new situations and the energy you project into the world.
          </p>
          <div className="report-visualization">
            {/* Ascendant visualization would be rendered here */}
          </div>
        </div>
      </div>
      
      <div className="report-section">
        <h3 className="report-section-title">Celestial Aspects</h3>
        <div className="report-content">
          <p>
            The unique geometric relationships between celestial bodies at your birth moment create a cosmic symphony that resonates throughout your life:
          </p>
          <ul className="aspect-list">
            {report.aspects.map((aspect, index) => (
              <li key={index} className="aspect-item">
                <span className="aspect-name">{aspect.aspect}:</span> {aspect.planets} — <span className="aspect-influence">{aspect.influence}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="report-section">
        <h3 className="report-section-title">Unique Cosmic Signature</h3>
        <div className="report-content">
          <p>
            {report.uniqueInsights}
          </p>
        </div>
      </div>
      
      <div className="report-actions">
        <button className="report-button" onClick={onReset}>
          Generate New Signature
        </button>
        <button className="report-button">
          Save as PDF
        </button>
      </div>
    </div>
  );
};

export default CosmicReport;
