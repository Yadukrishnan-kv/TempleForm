import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Heart, UserPlus } from 'lucide-react';
import logo1 from '../../assets/images/logo.png';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath.includes('about')) {
      setActiveLink('about');
    } else if (currentPath.includes('TemplePage')) {
      setActiveLink('temples');
    } else if (currentPath.includes('contact')) {
      setActiveLink('contact');
    } else {
      setActiveLink('home');
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={`navbar navbar-expand-lg navbar-light sticky-top ${isScrolled ? 'shadow-sm' : ''}`}>
      <div className="container">
        <a href="/" className="navbar-brand">
          <img
            className="logo-dark"
            src={logo1}
            alt="Logo"
            height={70}
          />
        </a>

        <div className="d-flex order-lg-2">
          <a
            href="/favorites"
            className="nav-icon-link"
            aria-label="Favorites"
          >
            <Heart className="nav-icon" />
            <span className="nav-count">0</span>
          </a>

          <a
            href="/sign-in"
            className="nav-icon-link"
            aria-label="Sign In"
          >
            <UserPlus className="nav-icon" />
          </a>

          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleMobileMenu}
            aria-controls="navbarSupportedContent"
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>

        <div className={`collapse navbar-collapse ${isMobileMenuOpen ? 'show' : ''}`} id="navbarSupportedContent">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <a
                className={`nav-link ${activeLink === 'home' ? 'active' : ''}`}
                href="/"
                onClick={() => {
                  setActiveLink('home');
                  setIsMobileMenuOpen(false);
                }}
              >
                Home
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${activeLink === 'about' ? 'active' : ''}`}
                href="/about"
                onClick={() => {
                  setActiveLink('about');
                  setIsMobileMenuOpen(false);
                }}
              >
                About Us
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${activeLink === 'temples' ? 'active' : ''}`}
                href="/TemplePage"
                onClick={() => {
                  setActiveLink('temples');
                  setIsMobileMenuOpen(false);
                }}
              >
                Temples
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${activeLink === 'contact' ? 'active' : ''}`}
                href="/contact"
                onClick={() => {
                  setActiveLink('contact');
                  setIsMobileMenuOpen(false);
                }}
              >
                Contact Us
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;





