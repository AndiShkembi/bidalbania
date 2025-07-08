import React from 'react';
import logoPartner from '../assets/logo-partner.webp';

const Footer = () => {
  return (
    <footer className="custom-footer">
      <div className="footer-content">
        <div className="footer-text-logo">
          <span>© 2024 BidAlbania. Të gjitha të drejtat e rezervuara.</span>
          <br></br>
          <img 
            src={logoPartner} 
            width={550}
            alt="Partner Logo" 
            className="partner-logo"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
