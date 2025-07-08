import React from 'react';
import logoPartner from '../assets/logo-partner.webp';
import './FooterModern.css';

const Footer = () => {
  return (
    <footer className="custom-footer-modern">
      <div className="footer-modern-content">
        <div className="footer-modern-row">
          <span className="footer-modern-copyright">
            © 2024 BidAlbania. Të gjitha të drejtat e rezervuara.
          </span>
          <div className="footer-modern-logos">
            <img 
              src={logoPartner} 
              width={420}
              alt="Partner Logo" 
              className="footer-modern-logo"
            />
            {/* Mund të shtosh edhe logo të tjera këtu nëse ka */}
          </div>
        </div>
        {/* Mund të shtosh rrjete sociale këtu nëse dëshiron */}
      </div>
    </footer>
  );
};

export default Footer;
