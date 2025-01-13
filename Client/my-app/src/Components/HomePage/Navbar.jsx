import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Heart, UserPlus } from 'lucide-react';
import logo1 from '../../assets/images/logo.png';
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
            <li className="nav-item ">
            <a className={`nav-link dropdown-toggle ${openDropdowns.wisdom ? 'show' : ''}`} href="#" role="button" onClick={() => toggleDropdown('wisdom')}>Wisdom</a>
            <ul className={`dropdown-menu ${openDropdowns.wisdom ? 'show' : ''}`}>
                <li><a className="dropdown-item" href="#">Overview</a></li>
                <li><a className="dropdown-item" href="#">Blog</a></li>
                <li><a className="dropdown-item" href="#">Videos</a></li>
                <li><a className="dropdown-item" href="#">Audios</a></li>
                <li><a className="dropdown-item" href="#">Books</a></li>
              </ul>
            </li>
            <li className="nav-item ">
            <a className={`nav-link dropdown-toggle ${openDropdowns.consult ? 'show' : ''}`} href="#" role="button" onClick={() => toggleDropdown('consult')}>Consult</a>
            <ul className={`dropdown-menu ${openDropdowns.consult ? 'show' : ''}`}>
                                <li><a className="dropdown-item" href="#">Jyothish</a></li>
                                <li><a className="dropdown-item" href="#">Vastu</a></li>
                                <li><a className="dropdown-item" href="#">Spiritual guidance</a></li>
                                <li><a className="dropdown-item" href="#">Yoga</a></li>
                            </ul>
                    </li>
                    <li className="nav-item ">
                    <a className={`nav-link dropdown-toggle ${openDropdowns.community ? 'show' : ''}`} href="#" role="button" onClick={() => toggleDropdown('community')}>Community</a>
              <ul className={`dropdown-menu ${openDropdowns.community ? 'show' : ''}`}>
                                <li><a className="dropdown-item" href="#">Temple related rural development programs.</a></li>
                                <li><a className="dropdown-item" href="#">Skill Development</a></li>
                                <li><a className="dropdown-item" href="#">Organic farming</a></li>
                                <li><a className="dropdown-item" href="#">Environment conservation projects</a></li>
                                <li><a className="dropdown-item" href="#">Woman empowerment</a></li>
                                <li><a className="dropdown-item" href="#">Flower garden</a></li>
                                <li><a className="dropdown-item" href="#">Goshala</a></li>
                                <li><a className="dropdown-item" href="#">MSME registration </a></li>
                                <li><a className="dropdown-item" href="#">Group activities</a></li>
                                <li><a className="dropdown-item" href="#">Join hands s</a></li>  
                            </ul>
                    </li>
                    <li className="nav-item ">
                    <a className={`nav-link dropdown-toggle ${openDropdowns.events ? 'show' : ''}`} href="#" role="button" onClick={() => toggleDropdown('events')}>Events</a>
                    <ul className={`dropdown-menu ${openDropdowns.events ? 'show' : ''}`}>
                                <li><a className="dropdown-item" href="#">Overview </a></li>
                                <li><a className="dropdown-item" href="#">Calendar events </a></li>
                                <li><a className="dropdown-item" href="#">Navaratri</a></li>
                                <li><a className="dropdown-item" href="#">Mahashivaratri </a></li>
                                <li><a className="dropdown-item" href="#">Events & programs</a></li>
                            </ul>
                    </li>
                    <li className="nav-item ">
                    <a className={`nav-link dropdown-toggle ${openDropdowns.dakshina ? 'show' : ''}`} href="#" role="button" onClick={() => toggleDropdown('dakshina')}>Dakshina</a>
                    <ul className={`dropdown-menu ${openDropdowns.dakshina ? 'show' : ''}`}>
                                <li><a className="dropdown-item" href="#">NGO Overview and its vision.</a></li>
                                <li><a className="dropdown-item" href="#">Account details </a></li>
                                <li><a className="dropdown-item" href="#">Running projects of community </a></li>
                            </ul>
                    </li>
                    <li className="nav-item ">
                    <a className={`nav-link dropdown-toggle ${openDropdowns.dailyPractices ? 'show' : ''}`} href="#" role="button" onClick={() => toggleDropdown('dailyPractices')}>Daily Practices</a>
                    <ul className={`dropdown-menu ${openDropdowns.dailyPractices ? 'show' : ''}`}>
                                <li className="nav-item ">
                                    <a className="dropdown-item dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Kriyas </a>
                                    {/* <ul className="dropdown-menu">
                                        <li><a className="dropdown-item" href="#">Sandhya vandana </a></li>
                                        <li><a className="dropdown-item" href="#">Basic yoga practices</a></li>
                                        <li><a className="dropdown-item" href="#">Basic Prana Yamas </a></li>
                                    </ul> */}
                                </li>
                                <li><a className="dropdown-item" href="#">Meditation </a></li>
                                <li><a className="dropdown-item" href="#">Chants</a></li>
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





