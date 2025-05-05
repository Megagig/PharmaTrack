import { Link } from 'react-router-dom';
import './FooterStyles.css';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-column">
            <div className="footer-logo">
              <div className="footer-logo-circle">
                <span className="footer-logo-text">P</span>
              </div>
              <h3 className="footer-logo-title">PharmaTrack</h3>
            </div>
            <p className="footer-description">
              Streamlining pharmacy data collection and reporting for better healthcare outcomes across the nation.
            </p>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">Company</h4>
            <Link to="/about" className="footer-link">About Us</Link>
            <Link to="/features" className="footer-link">Features</Link>
            <Link to="/contact" className="footer-link">Contact</Link>
            <Link to="/careers" className="footer-link">Careers</Link>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">Resources</h4>
            <Link to="/help" className="footer-link">Help Center</Link>
            <Link to="/documentation" className="footer-link">Documentation</Link>
            <Link to="/privacy" className="footer-link">Privacy Policy</Link>
            <Link to="/terms" className="footer-link">Terms of Service</Link>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">Contact</h4>
            <p className="footer-text">Email: info@pharmatrack.com</p>
            <p className="footer-text">Phone: +1 (555) 123-4567</p>
            <p className="footer-text">Address: 123 Health Avenue, Medical District, City</p>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} PharmaTrack. All rights reserved.
          </p>
          <div className="footer-links">
            <a href="/privacy" className="footer-bottom-link">Privacy Policy</a>
            <span className="footer-separator">•</span>
            <a href="/terms" className="footer-bottom-link">Terms of Service</a>
            <span className="footer-separator">•</span>
            <a href="/cookies" className="footer-bottom-link">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
