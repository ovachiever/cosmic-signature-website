import React from 'react';

const Footer = () => {
  return (
    <footer className="py-8 px-4 text-center text-white/60 bg-[#0a0e27]/80 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto">
        <p className="mb-2">
          Created with cosmic simplicity and divine elegance
        </p>
        <p className="text-sm">
          © {new Date().getFullYear()} Cosmic Signature | Powered by the stars ✨
        </p>
      </div>
    </footer>
  );
};

export default Footer;
