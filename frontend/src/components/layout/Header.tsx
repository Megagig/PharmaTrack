import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import './HeaderStyles.css';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  const handleLogin = () => {
    navigate('/login');
    setMenuOpen(false);
  };

  const handleRegister = () => {
    navigate('/register');
    setMenuOpen(false);
  };

  const handleDashboard = () => {
    if (user?.role === 'EXECUTIVE' || user?.role === 'ADMIN') {
      navigate('/executive/dashboard');
    } else if (user?.role === 'PHARMACY') {
      navigate('/pharmacy/dashboard');
    }
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          <div className="logo-container">
            <Link to="/" className="logo-link">
              <div className="logo-circle">
                <span className="logo-text">P</span>
              </div>
              <h3 className="logo-title">PharmaTrack</h3>
            </Link>
          </div>

          <nav className="nav-desktop">
            <ul className="nav-links">
              <li>
                <Link
                  to="/"
                  className="nav-link"
                  onClick={() => setMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="nav-link"
                  onClick={() => setMenuOpen(false)}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/features"
                  className="nav-link"
                  onClick={() => setMenuOpen(false)}
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="nav-link"
                  onClick={() => setMenuOpen(false)}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          <div className="auth-buttons-desktop">
            {isAuthenticated ? (
              <>
                <button className="btn btn-subtle" onClick={handleDashboard}>
                  Dashboard
                </button>
                <button className="btn btn-outline-red" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <button className="btn btn-subtle" onClick={handleLogin}>
                  Login
                </button>
                <button className="btn btn-primary" onClick={handleRegister}>
                  Register
                </button>
              </>
            )}
          </div>

          <button className="mobile-menu-toggle" onClick={toggleMenu}>
            <span className={`hamburger ${menuOpen ? 'active' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? 'active' : ''}`}>
        <nav className="mobile-nav">
          <ul className="mobile-nav-links">
            <li>
              <Link
                to="/"
                className="mobile-nav-link"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="mobile-nav-link"
                onClick={() => setMenuOpen(false)}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/features"
                className="mobile-nav-link"
                onClick={() => setMenuOpen(false)}
              >
                Features
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="mobile-nav-link"
                onClick={() => setMenuOpen(false)}
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        <div className="mobile-auth-buttons">
          {isAuthenticated ? (
            <>
              <button
                className="btn btn-primary btn-full"
                onClick={handleDashboard}
              >
                Dashboard
              </button>
              <button
                className="btn btn-outline-red btn-full"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="btn btn-primary btn-full"
                onClick={handleLogin}
              >
                Login
              </button>
              <button
                className="btn btn-outline btn-full"
                onClick={handleRegister}
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
