import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import  logo from '../../assets/images/logo.png' 

import phone_mpckup from '../../assets/images/phone-mpckup.png'
import { FaDribbble, FaEnvelope, FaFacebook, FaInstagram, FaPhone, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer-dark main-footer overflow-hidden position-relative pt-5">
      <div className="container pt-4">
        {/* App Download Section */}
        <div className="py-5">
          <div className=" rounded-4" style={{backgroundColor:"#FFBD59"}}>
            <div className="col-xxl-10 col-md-11 col-10 d-flex flex-md-row flex-column-reverse align-items-md-end align-items-center mx-auto px-0 gap-4">
              <img 
                className="app-image flex-shrink-0" 
                src={phone_mpckup}
                width="270" 
                alt="Mobile app"
                style={{ marginTop: '-5rem' }}
              />
              <div className="align-items-lg-center align-self-center d-flex flex-column flex-lg-row ps-xxl-4 pt-5 py-md-3 text-center text-md-start">
                <div className="me-md-5">
                  <h4 className="text-white">Download Our App</h4>
                  <p className="mb-lg-0 text-white">It is a long established fact that a reader will be distracted by the readable content.</p>
                </div>
                <div className="d-flex flex-shrink-0 flex-wrap gap-3 justify-content-center">
                  <a className="align-items-center app-btn d-flex px-3 py-2 rounded-3 text-decoration-none text-white border" href="#">
                    <i className="fa-apple fab fs-28 me-2"></i>
                    <div>
                      <span className="fs-13 d-block">Available on the</span>
                      <span className="fs-17 text-capitalize">App Store</span>
                    </div>
                  </a>
                  <a className="align-items-center app-btn d-flex fs-11 px-3 py-2 rounded-3 text-decoration-none text-white border" href="#">
                    <i className="fab fa-google-play fs-25 me-2"></i>
                    <div>
                      <span className="fs-13 d-block">Get it on</span>
                      <span className="fs-17 text-capitalize">Google Play</span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Content */}
        <div className="border-top py-5">
          <div className="footer-row row gy-5 g-sm-5 gx-xxl-6">
            {/* Get In Touch Column */}
            <div className="border-end col-lg-4 col-md-7 col-sm-6">
              <h5 className="fw-bold mb-4 text-white">Get In Touch</h5>
              <div className="mb-4 text-[#8d9193]">Join our newsletter and receive the best job<br className="d-none d-xxl-block"/> openings of the week, right on your inbox.</div>
              <div className="border rounded-4 p-4 mb-4">
                <h6 className="text-white-50 mb-3">Join our Whatsapp:</h6>
                <a className="align-items-center d-block d-flex whatsapp-number" href="#">
                  <i className="fa-brands fa-whatsapp fs-3 me-2 text-white" ><FaWhatsapp  /></i>
                  <span className="fs-5 fw-semibold text-decoration-underline text-white">(123) 456-7890</span>
                </a>
              </div>
            </div>

            {/* Stay Connect Column */}
            <div className="border-end col-lg-4 col-md-5 col-sm-6">
              <h5 className="fw-bold mb-4 text-white">Stay Connect</h5>
              <div className="text-[#8d9193]">1123 Fictional St, San Francisco<br className="d-none d-xxl-block"/> , CA 94103</div>
              <div className="mt-4">
                <a className="d-block fw-medium mb-1 " href="#" style={{textDecoration:"none",color:"white"}}>
                  <i className="fa-solid fa-phone "><Phone className="me-2" size={16} style={{ color: 'white' }} />
                  </i>
                  <span>(123) 456-7890</span>
                </a>
                <a className="email-link d-block fw-medium text-[#8d9193]" href="#" style={{textDecoration:"none",color:"white"}}>
                  <i className="fa-solid fa-envelope me-2"><FaEnvelope /></i>
                  <span>[email&#160;protected]</span>
                </a>
              </div>
            </div>

            {/* Newsletter Column */}
            <div className="col-lg-4">
              <h5 className="fw-bold mb-4 text-white">Get In Touch</h5>
              <div className="newsletter position-relative mt-4">
                <input 
                  type="email" 
                  class="form-control bg-dark text-white"                 
                   placeholder="name@example.com"
                  style={{
                    height: '62px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '35px',
                    padding: '10px 63px 10px 20px',
                  }}
                />
                <button 
                  type="button" 
                  className="btn btn-[#FFBD59] search-btn position-absolute top-50 rounded-circle"
                  style={{
                    right: '10px',
                    transform: 'translateY(-50%)',
                    height: '45px',
                    width: '45px',
                    backgroundColor: '#FFBD59'
                  }}
                >
                  <i className="fa-solid fa-angle-right"></i>
                </button>
              </div>
              <div className="border-top my-4"></div>
              <h5 className="fw-bold mb-4 text-white">Follow the location</h5>
              <ul className="d-flex flex-wrap gap-2 list-unstyled mb-0 social-icon">
                <li>
                  <a href="#" className="rounded-circle align-items-center d-flex fs-19 icon-wrap justify-content-center rounded-2 text-white inst">
                    <i className="fab fa-instagram"><FaInstagram />
                    </i>
                  </a>
                </li>
                <li>
                  <a href="#" className="rounded-circle align-items-center d-flex fs-19 icon-wrap justify-content-center rounded-2 text-white twi">
                    <i className="fab fa-twitter"><FaTwitter />
                    </i>
                  </a>
                </li>
                <li>
                  <a href="#" className="rounded-circle align-items-center d-flex fs-19 icon-wrap justify-content-center rounded-2 text-white dri">
                    <i className="fab fa-dribbble"><FaDribbble/></i>
                  </a>
                </li>
                <li>
                  <a href="#" className="rounded-circle align-items-center d-flex fs-19 icon-wrap justify-content-center rounded-2 text-white fb">
                    <i className="fab fa-facebook-f"><FaFacebook/></i>
                  </a>
                </li>
                <li>
                  <a href="#" className="rounded-circle align-items-center d-flex fs-19 icon-wrap justify-content-center rounded-2 text-white whatsapp">
                    <i className="fa-brands fa-whatsapp"><FaWhatsapp/></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="container border-top">
        <div className="align-items-center g-3 py-4 row">
          <div className="col-lg-auto">
            <ul className="list-unstyled list-separator mb-2 footer-nav">
              <li className="list-inline-item"><Link to="#" className="text-[#8d9193]" style={{textDecoration:"none",color:"white"}}>Privacy  /  </Link></li>
              <li className="list-inline-item"><Link to="#" className="text-[#8d9193]" style={{textDecoration:"none",color:"white"}}>Sitemap  /  </Link></li>
              <li className="list-inline-item"><Link to="#" className="text-[#8d9193]" style={{textDecoration:"none",color:"white"}}>Cookies</Link></li>
            </ul>
          </div>
          <div className="col-lg order-md-first">
            <div className="align-items-center row">
              <Link to="/" className="col-sm-auto footer-logo mb-2 mb-sm-0">
                <img src={logo} alt="Logo" width="150" height="50" />
              </Link>
              <div className="col-sm-auto copy text-[#8d9193]">© {new Date().getFullYear()} sreeshuddhi - All Rights Reserved- All Rights Reserved</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

