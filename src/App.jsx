import React, { useState } from 'react';
import Hero from './components/Hero';
import BirthDataForm from './components/BirthDataForm';
import ReportGenerator from './components/ReportGenerator';
import CosmicReport from './components/CosmicReport';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [birthData, setBirthData] = useState(null);
  const [report, setReport] = useState(null);

  const handleBirthDataSubmit = (data) => {
    setBirthData(data);
    // Scroll to the report generator section
    const reportSection = document.getElementById('report-section');
    reportSection.scrollIntoView({ behavior: 'smooth' });
  };

  const handleReportGenerated = (reportData) => {
    setReport(reportData);
    // Scroll to the report display section
    setTimeout(() => {
      const reportDisplaySection = document.getElementById('report-display-section');
      reportDisplaySection.scrollIntoView({ behavior: 'smooth' });
    }, 500);
  };

  return (
    <div className="App">
      {/* Hero Section */}
      <Hero />
      
      {/* Birth Form Section */}
      <section id="birth-form-section" className="py-16 px-4 min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0e27] to-[#141a3a]">
        <div className="w-full max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-8">Enter Your Cosmic Coordinates</h2>
          <BirthDataForm onSubmit={handleBirthDataSubmit} />
        </div>
      </section>
      
      {/* Report Generator Section */}
      <section id="report-section" className={`py-16 px-4 min-h-screen flex items-center justify-center bg-gradient-to-b from-[#141a3a] to-[#0a0e27] ${!birthData ? 'hidden' : ''}`}>
        <div className="w-full max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Generate Your Cosmic Blueprint</h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            We'll analyze the celestial configuration at your birth moment to reveal your unique cosmic signature.
          </p>
          {birthData && <ReportGenerator birthData={birthData} onReportGenerated={handleReportGenerated} />}
        </div>
      </section>
      
      {/* Report Display Section */}
      <section id="report-display-section" className={`py-16 px-4 min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0e27] to-[#141a3a] ${!report ? 'hidden' : ''}`}>
        {report && <CosmicReport report={report} />}
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
