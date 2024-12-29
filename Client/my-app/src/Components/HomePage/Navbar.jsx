import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Hook to get the current URL path
import './HomePage.css';
import logo1 from '../../assets/images/logo.png';
import { Heart, UserPlus } from 'lucide-react';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const location = useLocation(); // Get the current path

  useEffect(() => {
    // Update activeLink based on the current path
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
  }, [location.pathname]); // Run this effect whenever the path changes

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <a
                className={`nav-link ${activeLink === 'home' ? 'active' : ''}`}
                href="/"
                onClick={() => setActiveLink('home')}
              >
                Home
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${activeLink === 'about' ? 'active' : ''}`}
                href="/about"
                onClick={() => setActiveLink('about')}
              >
                About Us
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${activeLink === 'temples' ? 'active' : ''}`}
                href="/TemplePage"
                onClick={() => setActiveLink('temples')}
              >
                Temples
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${activeLink === 'contact' ? 'active' : ''}`}
                href="/contact"
                onClick={() => setActiveLink('contact')}
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



