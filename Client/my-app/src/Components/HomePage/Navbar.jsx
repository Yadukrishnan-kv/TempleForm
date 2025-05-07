import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, UserPlus } from 'lucide-react';
import logo1 from '../../assets/images/logo.png';
import { IoMdArrowDropdown } from "react-icons/io";

import './HomePage.css'
import './Navbar.css'
function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});

  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath.includes('about')) {
      setActiveLink('about');
    
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
  
  const toggleDropdown = (dropdownName) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [dropdownName]: !prev[dropdownName]
    }));
  };

  const closeDropdowns = () => {
    setOpenDropdowns({});
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

         <Link to={'/Signin'}> <a
            
            className="nav-icon-link"
            aria-label="Sign In"
          >
            <UserPlus className="nav-icon" />
          </a></Link>

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
            <li className="nav-item ">
                    <a className={`nav-link dropdown-toggle ${openDropdowns.TemplePage ? 'show' : ''}`} href="#" role="button" onClick={() => toggleDropdown('TemplePage')}>Temples<IoMdArrowDropdown />
                    </a>
                    <ul className={`dropdown-menu ${openDropdowns.TemplePage ? 'show' : ''}`}>
                                <li><a className="dropdown-item" href="#">Madam</a></li>
                                <li><a className="dropdown-item" href="#">Kudumbakshetram </a></li>
                                <li><a className="dropdown-item" href="#">Bajanamadam </a></li>
                                <li><a className="dropdown-item" href="#">Sevagramam </a></li>
                                <li><a className="dropdown-item" href="#">Kaavukal</a></li>
                                <li><a className="dropdown-item" href="#">Sarppakaav </a></li>

                            </ul>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${activeLink === 'Temple Acharyas' ? 'active' : ''}`}
                href="/newForm"
                onClick={() => {
                  setActiveLink('Temple Acharyas');
                  setIsMobileMenuOpen(true);
                }}
              >
                Temple Acharyas
              </a>
            </li>
            <li className="nav-item ">
            <a className={`nav-link dropdown-toggle ${openDropdowns.Padashala ? 'show' : ''}`} href="#" role="button" onClick={() => toggleDropdown('Padashala')}>Padashala<IoMdArrowDropdown />
            </a>
            <ul className={`dropdown-menu ${openDropdowns.Padashala ? 'show' : ''}`}>
            <li><a className="dropdown-item" href="#">Youtube</a></li>
            <li><a className="dropdown-item" href="#">Sound Cloud</a></li>
                            </ul>
              </li>
            <li className="nav-item ">
            <a className={`nav-link dropdown-toggle ${openDropdowns.wisdom ? 'show' : ''}`} href="#" role="button" onClick={() => toggleDropdown('wisdom')}>Wisdom<IoMdArrowDropdown />
            </a>
            <ul className={`dropdown-menu ${openDropdowns.wisdom ? 'show' : ''}`}>
                <li><a className="dropdown-item" href="#">Youtube</a></li>
                <li><a className="dropdown-item" href="#">Sound Cloud</a></li>
            </ul>
            </li>
            <li className="nav-item ">
                    <a className={`nav-link dropdown-toggle ${openDropdowns.events ? 'show' : ''}`} href="#" role="button" onClick={() => toggleDropdown('events')}>Events<IoMdArrowDropdown />
                    </a>
                    <ul className={`dropdown-menu ${openDropdowns.events ? 'show' : ''}`}>
                                <li><a className="dropdown-item" href="#">Calendars</a></li>
                                <li><a className="dropdown-item" href="#">Events</a></li>
                            </ul>
                    </li>
                    <li className="nav-item ">
                    <a className={`nav-link dropdown-toggle ${openDropdowns.Community ? 'show' : ''}`} href="#" role="button" onClick={() => toggleDropdown('Community')}>Community<IoMdArrowDropdown />
                    </a>
                    <ul className={`dropdown-menu ${openDropdowns.Community ? 'show' : ''}`}>
                                <li><a className="dropdown-item" href="#">How to Join</a></li>
                                <li><a className="dropdown-item" href="#">Social Impact</a></li>
                               
                            </ul>
                    </li>
                    
                    
                    <li className="nav-item ">
                    <a className={`nav-link dropdown-toggle ${openDropdowns.Aboutus ? 'show' : ''}`} href="#" role="button" onClick={() => toggleDropdown('Aboutus')}>About Us<IoMdArrowDropdown />
                    </a>
                    <ul className={`dropdown-menu ${openDropdowns.Aboutus ? 'show' : ''}`}>
                               
                                <li><a className="dropdown-item" href="/about#vision">Vission </a></li>
                                <li><a className="dropdown-item" href="/about#vision">Mission</a></li>
                                <li><a className="dropdown-item" href="#">Accademic Panel and Acharyas</a></li>

                               
                            </ul>
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





