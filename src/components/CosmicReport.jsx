import React, { useState } from 'react';

const CosmicReport = ({ report }) => {
  if (!report) return null;

  return (
    <div className="w-full max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-xl border border-white/20 text-white">
      <h2 className="text-3xl font-bold text-center mb-8 text-gold-400">Your Cosmic Signature</h2>
      
      {/* Introduction */}
      <div className="mb-10">
        <p className="text-xl leading-relaxed">{report.introduction}</p>
      </div>
      
      {/* Sun Sign */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-3 text-purple-300">Solar Essence</h3>
        <p className="text-lg leading-relaxed">{report.sunSign}</p>
      </div>
      
      {/* Moon Sign */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-3 text-purple-300">Lunar Reflection</h3>
        <p className="text-lg leading-relaxed">{report.moonSign}</p>
      </div>
      
      {/* Ascendant */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-3 text-purple-300">Cosmic Mask</h3>
        <p className="text-lg leading-relaxed">{report.ascendant}</p>
      </div>
      
      {/* Unique Aspects */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-3 text-purple-300">Unique Celestial Configurations</h3>
        <div className="space-y-4">
          {report.uniqueAspects.split('\n\n').map((aspect, index) => (
            <p key={index} className="text-lg leading-relaxed">{aspect}</p>
          ))}
        </div>
      </div>
      
      {/* Sacred Geometry */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-3 text-purple-300">Sacred Geometry Pattern: {report.sacredGeometry.name}</h3>
        <div className="flex items-center justify-center my-6">
          <div className="w-48 h-48 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-gold-400/30 rounded-full animate-pulse"></div>
            <div className="absolute inset-4 border-2 border-white/40 rounded-full"></div>
            {report.sacredGeometry.name === 'Grand Trine' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 border-2 border-gold-400/60 rotate-180" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
              </div>
            )}
            {report.sacredGeometry.name === 'Star Tetrahedron' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 border-2 border-gold-400/60" style={{ clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }}></div>
                <div className="w-32 h-32 border-2 border-purple-400/60" style={{ clipPath: 'polygon(50% 100%, 100% 0%, 0% 0%)' }}></div>
              </div>
            )}
            {report.sacredGeometry.name === 'Mystic Rectangle' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-24 border-2 border-gold-400/60 rounded-lg"></div>
              </div>
            )}
            {report.sacredGeometry.name === 'Golden Ratio Spiral' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-40 h-40 border-2 border-gold-400/60 rounded-full" style={{ clipPath: 'polygon(100% 50%, 50% 50%, 50% 0%, 0% 0%, 0% 100%, 100% 100%)' }}></div>
              </div>
            )}
            {report.sacredGeometry.name === 'Merkaba' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 border-2 border-gold-400/60 rotate-45" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}></div>
                <div className="w-32 h-32 border-2 border-purple-400/60 -rotate-45" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}></div>
              </div>
            )}
          </div>
        </div>
        <p className="text-lg leading-relaxed">{report.sacredGeometry.description}</p>
      </div>
      
      {/* Galactic Mission */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-3 text-purple-300">Your Galactic Mission</h3>
        <p className="text-lg leading-relaxed">{report.galacticMission}</p>
      </div>
      
      {/* Cosmic Terminology */}
      <div className="mt-12 pt-8 border-t border-white/20">
        <h3 className="text-xl font-semibold mb-4 text-center text-gold-400">Cosmic Glossary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.terminology.map((term) => (
            <div key={term.id} className="bg-white/5 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-300">{term.term}</h4>
              <p className="text-sm text-white/80">{term.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CosmicReport;
